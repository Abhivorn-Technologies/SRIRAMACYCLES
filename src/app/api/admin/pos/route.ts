import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { extractAuthUser } from '@/lib/auth';

// GET /api/admin/pos - Get recent POS transactions & today's counter sales
export async function GET(req: NextRequest) {
  try {
    const auth = extractAuthUser(req, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    let recentPOSOrders: any[] = [];
    let todaySummary: any = {
      todaySalesCount: 0,
      todayTotalRevenue: 0,
      cashTotal: 0,
      upiTotal: 0,
      cardTotal: 0,
    };

    try {
      const [orders, stats] = await Promise.all([
        Order.find({ orderSource: 'POS' })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean(),
        Order.aggregate([
          {
            $match: {
              orderSource: 'POS',
              paymentStatus: 'Paid',
              createdAt: { $gte: todayStart },
            },
          },
          {
            $group: {
              _id: null,
              todaySalesCount: { $sum: 1 },
              todayTotalRevenue: { $sum: '$pricing.total' },
              cashTotal: {
                $sum: {
                  $cond: [{ $eq: ['$posDetails.paymentMode', 'Cash'] }, '$pricing.total', 0],
                },
              },
              upiTotal: {
                $sum: {
                  $cond: [{ $eq: ['$posDetails.paymentMode', 'UPI'] }, '$pricing.total', 0],
                },
              },
              cardTotal: {
                $sum: {
                  $cond: [{ $eq: ['$posDetails.paymentMode', 'Card'] }, '$pricing.total', 0],
                },
              },
            },
          },
        ]),
      ]);

      recentPOSOrders = orders || [];
      if (stats && stats.length > 0) {
        todaySummary = stats[0];
      }
    } catch (aggErr) {
      console.warn('POS aggregation fallback:', aggErr);
    }

    return NextResponse.json({
      success: true,
      orders: recentPOSOrders,
      todaySummary,
    });
  } catch (error: any) {
    console.error('POS GET error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching POS records' },
      { status: 500 }
    );
  }
}

// POST /api/admin/pos - Complete Sale & Process In-Store Checkout
export async function POST(req: NextRequest) {
  try {
    const auth = extractAuthUser(req, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const {
      customer,
      items,
      pricing,
      paymentMode, // 'Cash' | 'UPI' | 'Card' | 'Split'
      cashReceived,
      changeReturned,
      customDiscount,
      notes,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one item is required to generate a bill' },
        { status: 400 }
      );
    }

    // 1. Process and validate customer details (MANDATORY for billing)
    const customerPhone = customer?.phone?.trim() || '';
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    const customerName = customer?.name?.trim() || '';
    const customerEmail = customer?.email?.trim() || ''; // No auto-generated or dummy email

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, message: 'A valid 10-digit customer mobile phone number is required for billing' },
        { status: 400 }
      );
    }

    if (!customerName) {
      return NextResponse.json(
        { success: false, message: 'Customer name is required for billing' },
        { status: 400 }
      );
    }

    let linkedUserId = null;
    try {
      const existingUser = await User.findOne({
        role: 'customer',
        phone: cleanPhone,
      });
      if (existingUser) {
        linkedUserId = existingUser._id;
      }
    } catch (uErr) {
      console.warn('Customer lookup error in POS checkout:', uErr);
    }

    // 2. Validate & deduct inventory safely
    const orderItems: any[] = [];
    for (const item of items) {
      const isValidOid = item.productId && mongoose.Types.ObjectId.isValid(item.productId);

      if (isValidOid && item.productId !== 'custom-service') {
        try {
          const product = await Product.findById(item.productId);
          if (product) {
            // Decrement stock in MongoDB
            await Product.findByIdAndUpdate(item.productId, {
              $inc: { stock: -Math.max(1, item.quantity) },
            });

            orderItems.push({
              product: product._id,
              name: item.name || product.name,
              image: item.image || product.images?.[0] || '/images/placeholder-bike.png',
              price: Number(item.price),
              quantity: Number(item.quantity),
              variant: item.variant || {},
            });
            continue;
          }
        } catch (pErr) {
          console.warn('Product findById error in POS:', pErr);
        }
      }

      // If custom workshop service / non-catalog item or fallback
      orderItems.push({
        product: new mongoose.Types.ObjectId(), // Valid generated ObjectId
        name: item.name || 'Custom Workshop Service',
        image: item.image || '/images/placeholder-bike.png',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        variant: {},
      });
    }

    // 3. Generate unique POS invoice number
    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const posOrderNumber = `POS-${dateStr}-${randomSuffix}`;
    const gstInvoiceNumber = `SRC-POS-${dateStr}-${randomSuffix}`;

    // 4. Map paymentMethod to match standard Order schema enum ('COD' | 'CARD' | 'UPI' | 'NETBANKING')
    let paymentMethodEnum: 'COD' | 'CARD' | 'UPI' | 'NETBANKING' = 'COD';
    if (paymentMode === 'UPI') paymentMethodEnum = 'UPI';
    else if (paymentMode === 'Card') paymentMethodEnum = 'CARD';
    else if (paymentMode === 'Split') paymentMethodEnum = 'UPI';
    else paymentMethodEnum = 'COD'; // Cash counter sale

    // 5. Create Order Document in MongoDB
    const subtotal = Number(pricing?.subtotal) || 0;
    const discount = Number(pricing?.discount) || Number(customDiscount) || 0;
    const tax = Number(pricing?.tax) || 0;
    const total = Number(pricing?.total) || Math.max(0, subtotal - discount + tax);

    const newOrder = await Order.create({
      orderNumber: posOrderNumber,
      user: linkedUserId,
      customer: {
        name: customerName,
        email: customerEmail || undefined, // POS walk-in: no email — use undefined to skip validator
        phone: customerPhone || 'Counter Sale',
      },
      shippingAddress: {
        name: customerName,
        phone: customerPhone || 'Counter Sale',
        addressType: 'Store Pickup / Counter',
        street: 'Sri Rama Cycle & Auto Spare Parts, Kazipet Counter',
        landmark: 'Counter Sale',
        city: 'Kazipet, Hanumakonda',
        state: 'Telangana',
        pincode: '506003',
        country: 'India',
      },
      items: orderItems,
      pricing: {
        subtotal,
        shipping: 0,
        tax,
        discount,
        total,
      },
      paymentMethod: paymentMethodEnum,
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      orderSource: 'POS',
      posDetails: {
        cashierName: auth.name || 'Store Cashier',
        paymentMode: paymentMode || 'Cash',
        cashReceived: Number(cashReceived) || total,
        changeReturned: Number(changeReturned) || 0,
        customDiscount: discount,
        gstInvoiceNumber: gstInvoiceNumber,
        notes: notes || '',
      },
      tracking: {
        carrier: 'In-Store Handover',
        trackingNumber: `HANDOVER-${posOrderNumber}`,
        statusUpdates: [
          {
            status: 'Delivered',
            message: 'Handed over directly to customer at store counter.',
            timestamp: new Date(),
          },
        ],
      },
      notes: notes ? `POS Counter Sale: ${notes}` : 'In-Store POS Counter Sale',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'POS Sale recorded successfully',
        order: newOrder,
        receipt: {
          invoiceNumber: gstInvoiceNumber,
          orderNumber: posOrderNumber,
          date: newOrder.createdAt,
          cashier: auth.name || 'Store Counter',
          customer: {
            name: customerName,
            phone: customerPhone,
          },
          items: orderItems,
          pricing: newOrder.pricing,
          posDetails: newOrder.posDetails,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POS Checkout error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to complete POS transaction' },
      { status: 500 }
    );
  }
}
