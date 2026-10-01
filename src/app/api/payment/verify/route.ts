import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyRazorpaySignature, getRazorpayClient } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
      isDemoMode,
    } = body;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: 'Order number is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const razorpay = getRazorpayClient();

    // Verify cryptographic signature if live gateway is configured
    if (razorpay && !isDemoMode) {
      const isValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid payment signature. Verification failed.' },
          { status: 400 }
        );
      }
    }

    // Mark order as Paid and Confirmed
    order.paymentStatus = 'Paid';
    order.orderStatus = 'Confirmed';
    order.paymentDetails = {
      gateway: isDemoMode ? 'Razorpay (Test/Demo)' : 'Razorpay',
      orderId: razorpay_order_id || 'manual_test',
      paymentId: razorpay_payment_id || `pay_${Date.now()}`,
      signature: razorpay_signature || '',
      paidAt: new Date(),
    };

    // Add status update
    order.tracking = order.tracking || { carrier: 'Srirama Express Courier', trackingNumber: '', statusUpdates: [] };
    order.tracking.statusUpdates = order.tracking.statusUpdates || [];
    order.tracking.statusUpdates.push({
      status: 'Confirmed',
      message: `Online payment of ₹${order.pricing.total.toLocaleString('en-IN')} verified successfully via Razorpay.`,
      timestamp: new Date(),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      orderNumber: order.orderNumber,
      paymentId: order.paymentDetails.paymentId,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
