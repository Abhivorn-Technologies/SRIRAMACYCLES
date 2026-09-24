import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { extractAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = extractAuthUser(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error: any) {
    console.error('Admin GET coupons error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = extractAuthUser(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();

    if (!body.code || !body.discountValue) {
      return NextResponse.json(
        { success: false, message: 'Coupon code and discount value are required' },
        { status: 400 }
      );
    }

    const code = body.code.trim().toUpperCase();

    const existing = await Coupon.findOne({ code });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'A coupon with this code already exists' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.create({
      code,
      description: body.description || '',
      discountType: body.discountType || 'percentage',
      discountValue: Number(body.discountValue),
      minOrderAmount: Number(body.minOrderAmount || 0),
      maxDiscountAmount: body.maxDiscountAmount ? Number(body.maxDiscountAmount) : undefined,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
      usageLimit: Number(body.usageLimit || 1000),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    return NextResponse.json({
      success: true,
      message: 'Coupon created successfully',
      coupon,
    });
  } catch (error: any) {
    console.error('Admin POST coupon error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
