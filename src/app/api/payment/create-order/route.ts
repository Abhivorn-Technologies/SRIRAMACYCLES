import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber, amount, customer } = body;

    if (!orderNumber || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid order number or amount' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const razorpay = getRazorpayClient();
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

    // 1. If Razorpay client is available with real keys
    if (razorpay) {
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderNumber,
        notes: {
          store: 'Sri Rama Cycle & Auto Spare Parts',
          customerName: customer?.name || '',
          customerPhone: customer?.phone || '',
        },
      });

      return NextResponse.json({
        success: true,
        isLiveGateway: true,
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId,
      });
    }

    // 2. Demo / Test fallback when waiting for client production keys
    const mockOrderId = `order_mock_${Date.now()}`;
    return NextResponse.json({
      success: true,
      isLiveGateway: false,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId || 'rzp_test_placeholder',
      message: 'Razorpay keys not yet configured in .env. Test mode active.',
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
