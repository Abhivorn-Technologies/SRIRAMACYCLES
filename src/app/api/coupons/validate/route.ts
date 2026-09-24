import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    let body: any = {};
    try {
      body = await request.json();
    } catch (parseErr) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON request payload' },
        { status: 400 }
      );
    }

    const { code, cartSubtotal = 0 } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Please enter a coupon code' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Check in Database
    let coupon = await Coupon.findOne({ code: cleanCode });

    // 2. Default initial seed coupons fallback if DB is fresh
    if (!coupon) {
      if (cleanCode === 'RIDE10') {
        coupon = await Coupon.create({
          code: 'RIDE10',
          description: '10% Discount on all cycles & accessories',
          discountType: 'percentage',
          discountValue: 10,
          minOrderAmount: 499,
          isActive: true,
        });
      } else if (cleanCode === 'SRIRAMA15') {
        coupon = await Coupon.create({
          code: 'SRIRAMA15',
          description: '15% Mega Discount for Sri Rama customers',
          discountType: 'percentage',
          discountValue: 15,
          minOrderAmount: 1999,
          isActive: true,
        });
      } else if (cleanCode === 'WELCOME5') {
        coupon = await Coupon.create({
          code: 'WELCOME5',
          description: '5% Welcome bonus',
          discountType: 'percentage',
          discountValue: 5,
          minOrderAmount: 0,
          isActive: true,
        });
      }
    }

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Check active
    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, message: 'This coupon is currently inactive' },
        { status: 400 }
      );
    }

    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { success: false, message: 'This coupon has expired' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: 'Coupon usage limit has been reached' },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (cartSubtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, cartSubtotal);
    }

    return NextResponse.json({
      success: true,
      message: `Coupon ${coupon.code} applied successfully!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        description: coupon.description,
      },
    });
  } catch (error: any) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error validating coupon' },
      { status: 500 }
    );
  }
}
