import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Enquiry from '@/models/Enquiry';
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

    await connectToDatabase();

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
      unreadEnquiries,
      totalEnquiries,
      recentOrders,
      lowStockProducts,
      recentEnquiries,
      revenueAggregation,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments({ orderStatus: { $in: ['Placed', 'Confirmed', 'Processing'] } }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Enquiry.countDocuments({ status: 'unread' }),
      Enquiry.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(6).lean(),
      Product.find({ stock: { $lte: 3 }, isActive: true })
        .select('name sku stock price images')
        .limit(6)
        .lean(),
      Enquiry.find().sort({ createdAt: -1 }).limit(4).lean(),
      Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } },
      ]),
    ]);

    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        deliveredOrders,
        unreadEnquiries,
        totalEnquiries,
      },
      recentOrders,
      lowStockProducts,
      recentEnquiries,
    });
  } catch (error: any) {
    console.error('Admin stats GET error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching statistics' },
      { status: 500 }
    );
  }
}
