import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const orderNumber = searchParams.get('orderNumber');
    const contact = searchParams.get('contact'); // email or phone

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: 'Please provide an Order Number' },
        { status: 400 }
      );
    }

    const cleanOrderNumber = orderNumber.trim().toUpperCase();
    const query: any = { orderNumber: cleanOrderNumber };

    if (contact) {
      const cleanContact = contact.trim().toLowerCase();
      query.$or = [{ 'customer.email': cleanContact }, { 'customer.phone': cleanContact }];
    }

    const order = await Order.findOne(query).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            'No matching order found. Please verify your Order ID and contact details.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error tracking order' },
      { status: 500 }
    );
  }
}
