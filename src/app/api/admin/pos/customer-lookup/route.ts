import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = extractAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone')?.trim();

    if (!phone || phone.length < 3) {
      return NextResponse.json({ success: true, customers: [] });
    }

    await connectToDatabase();

    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Search in registered users by exact phone number
    const users = await User.find({
      role: 'customer',
      phone: cleanPhone,
    })
      .select('name email phone addresses')
      .limit(1)
      .lean();

    // Also search past offline/online orders if not in registered users
    const pastOrders = await Order.find({
      'customer.phone': cleanPhone,
    })
      .select('customer shippingAddress')
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();

    const customerMap = new Map();

    users.forEach((u: any) => {
      customerMap.set(u.phone, {
        name: u.name,
        email: u.email,
        phone: u.phone,
        isRegistered: true,
        address: u.addresses?.[0] || null,
      });
    });

    pastOrders.forEach((o: any) => {
      const p = o.customer?.phone?.replace(/[^0-9]/g, '');
      if (p && !customerMap.has(p)) {
        customerMap.set(p, {
          name: o.customer.name,
          email: o.customer.email?.includes('@pos.') ? '' : o.customer.email || '',
          phone: o.customer.phone,
          isRegistered: false,
          address: o.shippingAddress || null,
        });
      }
    });

    return NextResponse.json({
      success: true,
      customers: Array.from(customerMap.values()),
    });
  } catch (error: any) {
    console.error('POS customer lookup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error searching customers' },
      { status: 500 }
    );
  }
}
