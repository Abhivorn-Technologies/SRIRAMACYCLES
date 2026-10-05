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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Incomplete payment credentials received from gateway.' },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return NextResponse.json(
        { success: false, message: 'Payment gateway configuration missing.' },
        { status: 500 }
      );
    }

    // Verify cryptographic HMAC SHA256 signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      order.paymentStatus = 'Failed';
      await order.save();
      return NextResponse.json(
        { success: false, message: 'Cryptographic signature verification failed. Untrusted payment.' },
        { status: 400 }
      );
    }

    // Mark order as Paid with verified transaction details
    // Note: orderStatus remains 'Placed' so store admin can review and confirm manually!
    order.paymentStatus = 'Paid';
    order.paymentDetails = {
      gateway: 'Razorpay',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      paidAt: new Date(),
    };

    // Add status update
    order.tracking = order.tracking || { carrier: 'Srirama Express Courier', trackingNumber: '', statusUpdates: [] };
    order.tracking.statusUpdates = order.tracking.statusUpdates || [];
    order.tracking.statusUpdates.push({
      status: 'Payment Received',
      message: `Online payment of ₹${order.pricing.total.toLocaleString('en-IN')} verified successfully via Razorpay (Txn ID: ${razorpay_payment_id}). Ready for store confirmation.`,
      timestamp: new Date(),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Order is placed and awaiting store confirmation.',
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
