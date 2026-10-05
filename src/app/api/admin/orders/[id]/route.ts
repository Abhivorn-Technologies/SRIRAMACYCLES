import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { extractAuthUser } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = extractAuthUser(req, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { id } = params;
    const body = await req.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Check if orderStatus is updated -> add to statusUpdates timeline
    if (body.orderStatus && body.orderStatus !== order.orderStatus) {
      const statusMessageMap: Record<string, string> = {
        Placed: 'Order received and verified.',
        Confirmed: 'Order confirmed and scheduled for assembly.',
        Processing: 'Cycle is undergoing multi-point precision assembly and tuning.',
        Packed: 'Package sealed in heavy-duty shipping crate with protective foam.',
        Shipped: `Handed over to carrier ${body.tracking?.carrier || order.tracking?.carrier || 'Srirama Express Courier'}.`,
        'Out for Delivery': 'Your cycle is out for final doorstep delivery with our courier partner.',
        Delivered: 'Order successfully delivered. Enjoy your ride!',
        Cancelled: 'Order cancelled.',
      };

      order.tracking.statusUpdates.push({
        status: body.orderStatus,
        message: body.statusMessage || statusMessageMap[body.orderStatus] || `Status updated to ${body.orderStatus}`,
        timestamp: new Date(),
      });

      order.orderStatus = body.orderStatus;
    }

    if (body.paymentStatus) {
      // Audit & Security Policy: An order verified as 'Paid' cannot be altered or reverted
      if (order.paymentStatus === 'Paid' && body.paymentStatus !== 'Paid') {
        return NextResponse.json(
          {
            success: false,
            message: 'Security Policy: An order verified as Paid cannot be reverted to any other payment status.',
          },
          { status: 400 }
        );
      }
      order.paymentStatus = body.paymentStatus;
    }

    if (body.tracking) {
      if (body.tracking.carrier) order.tracking.carrier = body.tracking.carrier;
      if (body.tracking.trackingNumber) order.tracking.trackingNumber = body.tracking.trackingNumber;
      if (body.tracking.estimatedDelivery) order.tracking.estimatedDelivery = body.tracking.estimatedDelivery;
    }

    if (body.notes !== undefined) {
      order.notes = body.notes;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating order' },
      { status: 500 }
    );
  }
}
