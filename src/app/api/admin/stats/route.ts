import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Enquiry from '@/models/Enquiry';
import OfflineSale from '@/models/OfflineSale';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function getFilterDateRange(searchParams: URLSearchParams) {
  const period = searchParams.get('period') || 'this_month';
  const customStart = searchParams.get('startDate');
  const customEnd = searchParams.get('endDate');
  const monthParam = searchParams.get('month'); // e.g. "2026-10"

  const now = new Date();
  let start: Date | null = null;
  let end: Date | null = null;
  let label = 'This Month';

  if (period === 'all') {
    return { period: 'all', start: null, end: null, label: 'All Time' };
  }

  if (period === 'today') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    label = `Today (${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;
  } else if (period === 'yesterday') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
    label = `Yesterday (${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;
  } else if (period === 'this_week') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    label = 'Last 7 Days';
  } else if (period === 'last_month') {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    label = start.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  } else if (period === 'month' && monthParam) {
    const parts = monthParam.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    if (!isNaN(y) && !isNaN(m)) {
      start = new Date(y, m, 1, 0, 0, 0, 0);
      end = new Date(y, m + 1, 0, 23, 59, 59, 999);
      label = start.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    } else {
      // Fallback to this month
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      label = start.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    }
  } else if (period === 'custom' && customStart && customEnd) {
    const s = new Date(customStart);
    s.setHours(0, 0, 0, 0);
    const e = new Date(customEnd);
    e.setHours(23, 59, 59, 999);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
      start = s;
      end = e;
      label = `${s.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} – ${e.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      label = start.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    }
  } else {
    // Default: this_month
    start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    label = start.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }

  return { period, start, end, label };
}

export async function GET(req: NextRequest) {
  try {
    const auth = extractAuthUser(req, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const { period, start, end, label } = getFilterDateRange(searchParams);

    // Build date filters
    const orderDateFilter: any = {};
    const offlineDateFilter: any = {};

    if (start && end) {
      orderDateFilter.createdAt = { $gte: start, $lte: end };
      offlineDateFilter.purchaseDate = { $gte: start, $lte: end };
    }

    // Filter match for paid orders
    const paidOrderMatch: any = {
      paymentStatus: 'Paid',
      ...orderDateFilter,
    };

    // Filter match for all orders in period (to calculate conversion/counts)
    const anyOrderMatch: any = {
      ...orderDateFilter,
    };

    // Parallel fetch lifetime stats + filtered analytics
    const [
      totalProducts,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
      unreadEnquiries,
      totalEnquiries,
      recentOrders,
      lowStockProducts,
      recentEnquiries,
      lifetimeOrderRevenueAgg,
      lifetimeOfflineRevenueAgg,
      lifetimeOrdersCount,
      // Filtered Aggregations
      periodOrderStatsAgg,
      periodOfflineStatsAgg,
      periodDailyOrdersAgg,
      periodDailyOfflineAgg,
      periodRecentOrders,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
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
      // Lifetime Order Revenue
      Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } },
      ]),
      // Lifetime Offline Sales Revenue
      OfflineSale.aggregate([
        { $group: { _id: null, totalAmount: { $sum: '$price' } } },
      ]),
      Order.countDocuments(),

      // Filtered Order Aggregation
      Order.aggregate([
        { $match: paidOrderMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$pricing.total' },
            totalOrders: { $sum: 1 },
            onlineRevenue: {
              $sum: {
                $cond: [{ $ne: ['$orderSource', 'POS'] }, '$pricing.total', 0],
              },
            },
            onlineOrders: {
              $sum: {
                $cond: [{ $ne: ['$orderSource', 'POS'] }, 1, 0],
              },
            },
            posRevenue: {
              $sum: {
                $cond: [{ $eq: ['$orderSource', 'POS'] }, '$pricing.total', 0],
              },
            },
            posOrders: {
              $sum: {
                $cond: [{ $eq: ['$orderSource', 'POS'] }, 1, 0],
              },
            },
            cashRevenue: {
              $sum: {
                $cond: [{ $in: ['$paymentMethod', ['COD', 'Cash', 'cash']] }, '$pricing.total', 0],
              },
            },
            upiRevenue: {
              $sum: {
                $cond: [{ $in: ['$paymentMethod', ['UPI', 'upi']] }, '$pricing.total', 0],
              },
            },
            cardRevenue: {
              $sum: {
                $cond: [{ $in: ['$paymentMethod', ['CARD', 'Card', 'card']] }, '$pricing.total', 0],
              },
            },
            netbankingRevenue: {
              $sum: {
                $cond: [{ $in: ['$paymentMethod', ['NETBANKING', 'Netbanking']] }, '$pricing.total', 0],
              },
            },
          },
        },
      ]),

      // Filtered Offline Sales Aggregation
      OfflineSale.aggregate([
        { $match: offlineDateFilter },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$price' },
            totalCount: { $sum: 1 },
            cashAmount: {
              $sum: {
                $cond: [{ $eq: ['$paymentMode', 'Cash'] }, '$price', 0],
              },
            },
            onlineAmount: {
              $sum: {
                $cond: [{ $in: ['$paymentMode', ['Online', 'UPI', 'Card']] }, '$price', 0],
              },
            },
          },
        },
      ]),

      // Daily Breakdown for Orders
      Order.aggregate([
        { $match: paidOrderMatch },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$pricing.total' },
            orders: { $sum: 1 },
            onlineRevenue: {
              $sum: {
                $cond: [{ $ne: ['$orderSource', 'POS'] }, '$pricing.total', 0],
              },
            },
            posRevenue: {
              $sum: {
                $cond: [{ $eq: ['$orderSource', 'POS'] }, '$pricing.total', 0],
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Daily Breakdown for Offline Sales
      OfflineSale.aggregate([
        { $match: offlineDateFilter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$purchaseDate' } },
            amount: { $sum: '$price' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Orders for this filtered period
      Order.find(anyOrderMatch).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    // Format Lifetime numbers
    const lifetimeOrderRevenue = lifetimeOrderRevenueAgg[0]?.totalRevenue || 0;
    const lifetimeOfflineRevenue = lifetimeOfflineRevenueAgg[0]?.totalAmount || 0;
    const lifetimeTotalRevenue = lifetimeOrderRevenue + lifetimeOfflineRevenue;

    // Format Filtered numbers
    const orderStats = periodOrderStatsAgg[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      onlineRevenue: 0,
      onlineOrders: 0,
      posRevenue: 0,
      posOrders: 0,
      cashRevenue: 0,
      upiRevenue: 0,
      cardRevenue: 0,
      netbankingRevenue: 0,
    };

    const offlineStats = periodOfflineStatsAgg[0] || {
      totalAmount: 0,
      totalCount: 0,
      cashAmount: 0,
      onlineAmount: 0,
    };

    const periodTotalRevenue = (orderStats.totalRevenue || 0) + (offlineStats.totalAmount || 0);
    const periodTotalOrders = (orderStats.totalOrders || 0) + (offlineStats.totalCount || 0);
    const avgOrderValue = periodTotalOrders > 0 ? Math.round(periodTotalRevenue / periodTotalOrders) : 0;

    // Merge Daily Trend
    const dailyMap = new Map<string, { date: string; revenue: number; orders: number; online: number; pos: number; offline: number }>();

    // Helper to format short date string "12 Oct"
    const formatDayLabel = (dateStr: string) => {
      try {
        const [y, m, d] = dateStr.split('-');
        const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
        return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      } catch {
        return dateStr;
      }
    };

    periodDailyOrdersAgg.forEach((item: any) => {
      const key = item._id;
      if (!key) return;
      dailyMap.set(key, {
        date: key,
        revenue: item.revenue || 0,
        orders: item.orders || 0,
        online: item.onlineRevenue || 0,
        pos: item.posRevenue || 0,
        offline: 0,
      });
    });

    periodDailyOfflineAgg.forEach((item: any) => {
      const key = item._id;
      if (!key) return;
      if (dailyMap.has(key)) {
        const existing = dailyMap.get(key)!;
        existing.revenue += item.amount || 0;
        existing.orders += item.count || 0;
        existing.offline = item.amount || 0;
      } else {
        dailyMap.set(key, {
          date: key,
          revenue: item.amount || 0,
          orders: item.count || 0,
          online: 0,
          pos: 0,
          offline: item.amount || 0,
        });
      }
    });

    // If period is specific month or within 31 days and start/end are set, fill missing days for a smooth graph!
    if (start && end) {
      const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 31 && diffDays > 0) {
        const iter = new Date(start);
        while (iter <= end) {
          const y = iter.getFullYear();
          const m = String(iter.getMonth() + 1).padStart(2, '0');
          const d = String(iter.getDate()).padStart(2, '0');
          const key = `${y}-${m}-${d}`;
          if (!dailyMap.has(key)) {
            dailyMap.set(key, {
              date: key,
              revenue: 0,
              orders: 0,
              online: 0,
              pos: 0,
              offline: 0,
            });
          }
          iter.setDate(iter.getDate() + 1);
        }
      }
    }

    const trend = Array.from(dailyMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((entry) => ({
        ...entry,
        label: formatDayLabel(entry.date),
      }));

    return NextResponse.json({
      success: true,
      filter: {
        period,
        label,
        startDate: start ? start.toISOString() : null,
        endDate: end ? end.toISOString() : null,
        selectedMonth: searchParams.get('month') || null,
      },
      revenueOverview: {
        totalRevenue: periodTotalRevenue,
        totalOrders: periodTotalOrders,
        averageOrderValue: avgOrderValue,
        orderRevenue: orderStats.totalRevenue || 0,
        orderCount: orderStats.totalOrders || 0,
        onlineRevenue: orderStats.onlineRevenue || 0,
        onlineOrders: orderStats.onlineOrders || 0,
        posRevenue: orderStats.posRevenue || 0,
        posOrders: orderStats.posOrders || 0,
        offlineRevenue: offlineStats.totalAmount || 0,
        offlineOrders: offlineStats.totalCount || 0,
        paymentBreakdown: {
          cash: (orderStats.cashRevenue || 0) + (offlineStats.cashAmount || 0),
          upi: orderStats.upiRevenue || 0,
          card: orderStats.cardRevenue || 0,
          netbanking: orderStats.netbankingRevenue || 0,
        },
        trend,
      },
      stats: {
        totalRevenue: lifetimeTotalRevenue,
        lifetimeOrderRevenue,
        lifetimeOfflineRevenue,
        totalOrders: lifetimeOrdersCount,
        totalProducts,
        totalCustomers,
        pendingOrders,
        deliveredOrders,
        unreadEnquiries,
        totalEnquiries,
      },
      recentOrders: period !== 'all' && periodRecentOrders.length > 0 ? periodRecentOrders : recentOrders,
      periodOrdersCount: periodRecentOrders.length,
      lowStockProducts,
      recentEnquiries,
    });
  } catch (error: any) {
    console.error('Admin stats GET error:', error);
    return NextResponse.json({
      success: true,
      filter: {
        period: 'this_month',
        label: 'This Month',
        startDate: null,
        endDate: null,
        selectedMonth: null,
      },
      revenueOverview: {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        orderRevenue: 0,
        orderCount: 0,
        onlineRevenue: 0,
        onlineOrders: 0,
        posRevenue: 0,
        posOrders: 0,
        offlineRevenue: 0,
        offlineOrders: 0,
        paymentBreakdown: {
          cash: 0,
          upi: 0,
          card: 0,
          netbanking: 0,
        },
        trend: [],
      },
      stats: {
        totalRevenue: 0,
        lifetimeOrderRevenue: 0,
        lifetimeOfflineRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        unreadEnquiries: 0,
        totalEnquiries: 0,
      },
      recentOrders: [],
      periodOrdersCount: 0,
      lowStockProducts: [],
      recentEnquiries: [],
      _fallback: true,
    });
  }
}

