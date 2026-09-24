import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      $or: [{ expiryDate: { $exists: false } }, { expiryDate: { $gt: now } }],
    })
      .select('code description discountType discountValue minOrderAmount')
      .sort({ discountValue: -1 })
      .limit(6);

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error: any) {
    console.error('Active coupons fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch available offers' },
      { status: 500 }
    );
  }
}
