import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const now = new Date();
    const allActive = await Coupon.find({ isActive: true })
      .select('code description discountType discountValue minOrderAmount expiryDate')
      .sort({ createdAt: -1 })
      .lean();

    const coupons = allActive
      .filter((c: any) => !c.expiryDate || new Date(c.expiryDate) > now)
      .slice(0, 10);

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
