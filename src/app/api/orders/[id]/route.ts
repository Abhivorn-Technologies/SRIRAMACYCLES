import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const auth = extractAuthUser(req);

    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { orderNumber: id.toUpperCase() };

    const order = await Order.findOne(query).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // If customer user is logged in, verify ownership or admin
    if (auth && auth.role !== 'admin' && order.user && order.user.toString() !== auth.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to view this order' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching order' },
      { status: 500 }
    );
  }
}
