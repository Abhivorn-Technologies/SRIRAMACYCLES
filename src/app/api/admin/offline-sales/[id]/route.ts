import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import OfflineSale from '@/models/OfflineSale';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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

    const { id } = params;
    await connectToDatabase();
    const body = await req.json();

    const updateData: any = {};
    if (body.srNo !== undefined) updateData.srNo = String(body.srNo).trim();
    if (body.customerName) updateData.customerName = body.customerName.trim();
    if (body.phone) updateData.phone = body.phone.trim();
    if (body.cycleModel) updateData.cycleModel = body.cycleModel.trim();
    if (body.brand !== undefined) updateData.brand = String(body.brand).trim();
    if (body.cycleSize !== undefined) updateData.cycleSize = String(body.cycleSize).trim();
    if (body.price !== undefined) updateData.price = Number(body.price) || 0;
    if (body.paymentMode) updateData.paymentMode = body.paymentMode;
    if (body.feedback !== undefined) updateData.feedback = String(body.feedback).trim();
    if (body.notes !== undefined) updateData.notes = String(body.notes).trim();
    if (body.purchaseDate) {
      const d = new Date(body.purchaseDate);
      if (!isNaN(d.getTime())) {
        updateData.purchaseDate = d;
      }
    }

    const updated = await OfflineSale.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Record updated successfully',
      record: updated,
    });
  } catch (error: any) {
    console.error('Error updating offline sale record:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { id } = params;
    await connectToDatabase();

    const deleted = await OfflineSale.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Record deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting offline sale record:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete record' },
      { status: 500 }
    );
  }
}
