import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchPhone = req.nextUrl.searchParams.get('phone');
    const auth = extractAuthUser(req, 'customer');

    if (!auth && !searchPhone) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const queryFilters: any[] = [];

    if (auth && auth.role === 'customer') {
      const userDoc = await User.findById(auth.userId);
      const userPhone = userDoc?.phone || '';

      queryFilters.push({ user: auth.userId });
      queryFilters.push({ 'customer.email': auth.email.toLowerCase() });

      if (userPhone) {
        const clean = userPhone.replace(/\D/g, '');
        if (clean.length >= 10) {
          const reg = new RegExp(`${clean.slice(-10)}$`);
          queryFilters.push({ 'customer.phone': reg });
          queryFilters.push({ 'shippingAddress.phone': reg });
        }
      }
    }

    if (searchPhone) {
      const cleanSearch = searchPhone.replace(/\D/g, '');
      if (cleanSearch.length >= 10) {
        const reg = new RegExp(`${cleanSearch.slice(-10)}$`);
        queryFilters.push({ 'customer.phone': reg });
        queryFilters.push({ 'shippingAddress.phone': reg });
      }
    }

    if (queryFilters.length === 0) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const orders = await Order.find({
      $or: queryFilters,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching orders' },
      { status: 500 }
    );
  }
}
