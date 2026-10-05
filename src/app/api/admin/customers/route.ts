import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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
    const search = searchParams.get('search');

    const query: any = { role: 'customer' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // 1. Fetch registered users
    const customers = await User.find(query).select('-password').sort({ createdAt: -1 }).lean();

    // 2. Fetch all orders (both Online and POS) to aggregate customer stats & discover walk-ins
    const allOrders = await Order.find().sort({ createdAt: -1 }).lean();

    const customerMap = new Map();

    // Add registered users first
    customers.forEach((cust: any) => {
      const custCleanPhone = cust.phone ? cust.phone.replace(/[^0-9]/g, '') : '';
      const custEmail = cust.email?.trim().toLowerCase() || '';

      const userOrders = allOrders.filter((o: any) => {
        const orderCleanPhone = o.customer?.phone ? o.customer.phone.replace(/[^0-9]/g, '') : '';
        const orderEmail = o.customer?.email?.trim().toLowerCase() || '';

        // 1. Direct user ID match
        if (o.user && o.user.toString() === cust._id.toString()) {
          // If phones exist and don't match, verify it's not a different POS walk-in
          if (orderCleanPhone && custCleanPhone && orderCleanPhone !== custCleanPhone) {
            return false;
          }
          return true;
        }

        // 2. Exact phone number match
        if (custCleanPhone && orderCleanPhone && custCleanPhone === orderCleanPhone) {
          return true;
        }

        // 3. Online order email match ONLY if phones are not conflicting
        if (
          custEmail &&
          orderEmail &&
          custEmail === orderEmail &&
          (!custCleanPhone || !orderCleanPhone || custCleanPhone === orderCleanPhone)
        ) {
          return true;
        }

        return false;
      });

      const totalSpent = userOrders.reduce((acc, o) => acc + (o.pricing?.total || 0), 0);
      const posCount = userOrders.filter((o) => o.orderSource === 'POS').length;
      const onlineCount = userOrders.filter((o) => o.orderSource !== 'POS').length;

      const key = custCleanPhone || custEmail || cust._id.toString();
      customerMap.set(key, {
        ...cust,
        orderCount: userOrders.length,
        posCount,
        onlineCount,
        totalSpent,
        isRegistered: true,
      });
    });

    // Also discover walk-in POS customers who don't have a registered account yet
    allOrders.forEach((o: any) => {
      const phone = o.customer?.phone ? o.customer.phone.replace(/[^0-9]/g, '') : '';
      const email = o.customer?.email?.toLowerCase() || '';
      const key = phone || email;

      if (key && !customerMap.has(key) && o.customer?.name !== 'Walk-in Customer') {
        const matchesSearch =
          !search ||
          o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
          phone.includes(search) ||
          email.includes(search.toLowerCase());

        if (matchesSearch) {
          const matchOrders = allOrders.filter(
            (ord: any) =>
              (phone && ord.customer?.phone?.replace(/[^0-9]/g, '') === phone) ||
              (email && ord.customer?.email?.toLowerCase() === email)
          );

          const totalSpent = matchOrders.reduce((acc, ord) => acc + (ord.pricing?.total || 0), 0);
          const posCount = matchOrders.filter((ord) => ord.orderSource === 'POS').length;
          const onlineCount = matchOrders.filter((ord) => ord.orderSource !== 'POS').length;

          customerMap.set(key, {
            _id: `offline-${o._id}`,
            name: o.customer?.name || 'Customer',
            email: o.customer?.email?.includes('@pos.') ? 'Store Counter' : (o.customer?.email || ''),
            phone: o.customer?.phone || '',
            createdAt: o.createdAt,
            orderCount: matchOrders.length,
            posCount,
            onlineCount,
            totalSpent,
            isRegistered: false,
            channel: o.orderSource || 'POS',
          });
        }
      }
    });

    const combinedCustomers = Array.from(customerMap.values());

    return NextResponse.json({ success: true, customers: combinedCustomers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching customers' },
      { status: 500 }
    );
  }
}
