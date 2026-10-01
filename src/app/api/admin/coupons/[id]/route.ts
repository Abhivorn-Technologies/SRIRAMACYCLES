import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = extractAuthUser(request, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();

    const updateData: any = {};
    if (body.code) updateData.code = body.code.trim().toUpperCase();
    if (body.description !== undefined) updateData.description = body.description;
    if (body.discountType) updateData.discountType = body.discountType;
    if (body.discountValue !== undefined) updateData.discountValue = Number(body.discountValue);
    if (body.minOrderAmount !== undefined) updateData.minOrderAmount = Number(body.minOrderAmount);
    if (body.maxDiscountAmount !== undefined)
      updateData.maxDiscountAmount = body.maxDiscountAmount ? Number(body.maxDiscountAmount) : null;
    if (body.expiryDate !== undefined)
      updateData.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
    if (body.usageLimit !== undefined) updateData.usageLimit = Number(body.usageLimit);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const coupon = await Coupon.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon updated successfully',
      coupon,
    });
  } catch (error: any) {
    console.error('Admin PUT coupon error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = extractAuthUser(request, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const coupon = await Coupon.findByIdAndDelete(params.id);

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error: any) {
    console.error('Admin DELETE coupon error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
