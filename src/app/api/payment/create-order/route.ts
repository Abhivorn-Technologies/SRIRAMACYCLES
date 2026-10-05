import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber, amount, customer } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    const receipt = (orderNumber || `SRC-${Date.now()}`).slice(0, 40);
    const amountInPaise = Math.round(Number(amount) * 100);
    const razorpay = getRazorpayClient();
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

    if (!razorpay) {
      return NextResponse.json(
        {
          success: false,
          message: 'Online payment gateway is temporarily unavailable. Please verify Razorpay keys in environment variables or choose Cash on Delivery.',
        },
        { status: 503 }
      );
    }

    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        store: 'Sri Rama Cycle & Auto Spare Parts',
        customerName: customer?.name || '',
        customerPhone: customer?.phone || '',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId,
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
