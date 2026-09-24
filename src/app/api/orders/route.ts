import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { extractAuthUser } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST, TAX_RATE } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const auth = extractAuthUser(req);
    const body = await req.json();

    const { customer, shippingAddress, items, paymentMethod, notes, couponCode } = body;

    // Validation
    const customerName = (customer?.name || shippingAddress?.name || '').trim();
    const customerPhone = (customer?.phone || shippingAddress?.phone || '').trim();
    const customerEmail = (customer?.email || '').trim().toLowerCase();

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, message: 'Please provide customer name and phone number' },
        { status: 400 }
      );
    }

    if (
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      return NextResponse.json(
        { success: false, message: 'Please provide a complete shipping address' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Your shopping cart is empty' },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const validatedItems = [];

    // Calculate subtotal & validate items
    for (const item of items) {
      const unitPrice =
        item.product.salePrice && item.product.salePrice > 0
          ? item.product.salePrice
          : item.product.price;

      subtotal += unitPrice * item.quantity;

      validatedItems.push({
        product: item.product._id || item.product,
        name: item.product.name || item.name,
        image: item.product.images?.[0] || item.image || '',
        price: unitPrice,
        quantity: item.quantity,
        variant: {
          size: item.selectedSize || item.variant?.size || '',
          color: item.selectedColor || item.variant?.color || '',
        },
      });
    }

    // Calculate coupon discount
    let discount = 0;
    if (couponCode === 'RIDE10') {
      discount = Math.round(subtotal * 0.1);
    } else if (couponCode === 'SRIRAMA15') {
      discount = Math.round(subtotal * 0.15);
    } else if (couponCode === 'WELCOME5') {
      discount = Math.round(subtotal * 0.05);
    }

    const discountedSubtotal = subtotal - discount;
    const shipping =
      discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0
        ? 0
        : STANDARD_SHIPPING_COST;
    const tax = Math.round(discountedSubtotal * TAX_RATE);
    const total = discountedSubtotal + shipping + tax;

    const orderNumber = generateOrderNumber();

    try {
      await connectToDatabase();

      // Deduct stock in DB if connected
      for (const item of items) {
        if (item.product._id && item.product._id.match(/^[0-9a-fA-F]{24}$/)) {
          const productDoc = await Product.findById(item.product._id);
          if (productDoc) {
            productDoc.stock = Math.max(0, productDoc.stock - item.quantity);
            await productDoc.save();
          }
        }
      }

      // Find associated user by customer phone, email or customer auth (NEVER admin)
      let userDoc = null;
      try {
        const cleanPhone = customerPhone.replace(/\D/g, '');
        // 1. Prioritize finding the customer account by the phone number used at checkout
        if (cleanPhone.length >= 10) {
          userDoc = await User.findOne({
            phone: new RegExp(`${cleanPhone.slice(-10)}$`),
            role: 'customer',
          });
        }
        // 2. If not found by phone, check customer email
        if (!userDoc && customerEmail) {
          userDoc = await User.findOne({
            email: customerEmail,
            role: 'customer',
          });
        }
        // 3. If authenticated customer session
        if (!userDoc && auth && auth.userId && auth.role === 'customer') {
          userDoc = await User.findById(auth.userId);
        }
      } catch (findErr) {
        console.error('Error finding user for order:', findErr);
      }

      const order = await Order.create({
        orderNumber,
        user: userDoc ? userDoc._id : null,
        customer: {
          name: customerName,
          email: customerEmail || (customerPhone ? `${customerPhone}@sriramacycles.com` : ''),
          phone: customerPhone,
        },
        shippingAddress: {
          name: (shippingAddress.name || customerName).trim(),
          phone: (shippingAddress.phone || customerPhone).trim(),
          addressType: shippingAddress.addressType || 'Home',
          street: shippingAddress.street.trim(),
          landmark: shippingAddress.landmark || '',
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          pincode: shippingAddress.pincode.trim(),
          country: shippingAddress.country || 'India',
        },
        items: validatedItems,
        pricing: {
          subtotal,
          shipping,
          tax,
          discount,
          total,
        },
        paymentMethod: paymentMethod || 'COD',
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        orderStatus: 'Placed',
        tracking: {
          carrier: 'Srirama Express Courier',
          trackingNumber: `TRK-${orderNumber.replace('SRC-', '')}`,
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          statusUpdates: [
            {
              status: 'Placed',
              message: 'Order received and verified by Srirama Cycles dispatch center.',
              timestamp: new Date(),
            },
          ],
        },
        notes: notes || '',
      });

      // Save delivery address to customer profile if user exists (for Meesho-style 1-click 2nd order checkout)
      if (userDoc) {
        try {
          userDoc.addresses = userDoc.addresses || [];
          const isAddressAlreadySaved = userDoc.addresses.some(
            (a: any) =>
              a.pincode === shippingAddress.pincode.trim() &&
              a.street.toLowerCase() === shippingAddress.street.trim().toLowerCase()
          );

          if (!isAddressAlreadySaved) {
            const shouldBeDefault = userDoc.addresses.length === 0;
            userDoc.addresses.push({
              name: (shippingAddress.name || customer.name).trim(),
              phone: (shippingAddress.phone || customer.phone).trim(),
              addressType: shippingAddress.addressType || 'Home',
              street: shippingAddress.street.trim(),
              landmark: shippingAddress.landmark || '',
              city: shippingAddress.city.trim(),
              state: shippingAddress.state.trim(),
              pincode: shippingAddress.pincode.trim(),
              country: shippingAddress.country || 'India',
              isDefault: shouldBeDefault,
            } as any);
            await userDoc.save();
          }
        } catch (addrErr) {
          console.error('Failed to auto-save address to user profile:', addrErr);
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Order placed successfully',
          orderNumber: order.orderNumber,
          orderId: order._id,
        },
        { status: 201 }
      );
    } catch (dbErr) {
      console.warn('DB creation fallback, returning generated order:', dbErr);
      return NextResponse.json(
        {
          success: true,
          message: 'Order placed successfully',
          orderNumber,
          orderId: orderNumber,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
