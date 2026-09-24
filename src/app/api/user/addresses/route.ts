import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = extractAuthUser(req);
    const searchPhone = req.nextUrl.searchParams.get('phone');

    await connectToDatabase();

    // 1. If auth is present, get addresses from authenticated User
    if (auth && auth.userId) {
      const user = await User.findById(auth.userId).select('addresses');
      if (user && user.addresses && user.addresses.length > 0) {
        return NextResponse.json({
          success: true,
          addresses: user.addresses,
        });
      }
    }

    // 2. If phone param is provided (or if user has a phone), lookup by phone
    const cleanPhone = (searchPhone || '').replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      const phoneRegex = new RegExp(`${cleanPhone.slice(-10)}$`);

      // Check User record by phone
      const userByPhone = await User.findOne({ phone: phoneRegex }).select('addresses');
      if (userByPhone && userByPhone.addresses && userByPhone.addresses.length > 0) {
        return NextResponse.json({
          success: true,
          addresses: userByPhone.addresses,
        });
      }

      // Check previous orders placed with this phone number (Meesho style 2nd order detection)
      const recentOrders = await Order.find({ 'customer.phone': phoneRegex })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('shippingAddress customer');

      if (recentOrders && recentOrders.length > 0) {
        const addresses: any[] = [];
        const seen = new Set<string>();

        for (const ord of recentOrders) {
          const sa = ord.shippingAddress;
          if (sa && sa.street && sa.pincode) {
            const key = `${sa.street.toLowerCase()}_${sa.pincode}`;
            if (!seen.has(key)) {
              seen.add(key);
              addresses.push({
                _id: ord._id.toString(),
                name: sa.name || ord.customer?.name || '',
                phone: sa.phone || ord.customer?.phone || cleanPhone,
                addressType: sa.addressType || 'Home',
                street: sa.street,
                landmark: sa.landmark || '',
                city: sa.city,
                state: sa.state,
                pincode: sa.pincode,
                country: sa.country || 'India',
                isDefault: addresses.length === 0,
              });
            }
          }
        }

        if (addresses.length > 0) {
          return NextResponse.json({
            success: true,
            addresses,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      addresses: [],
    });
  } catch (error: any) {
    console.error('Fetch addresses error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = extractAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, addressType, street, landmark, city, state, pincode, isDefault } = body;

    if (!street || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, message: 'Street, city, state, and pincode are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    user.addresses = user.addresses || [];

    const shouldBeDefault = isDefault || user.addresses.length === 0;

    if (shouldBeDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      name: name || user.name,
      phone: phone || user.phone,
      addressType: addressType || 'Home',
      street: street.trim(),
      landmark: landmark || '',
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      country: 'India',
      isDefault: shouldBeDefault,
    };

    user.addresses.push(newAddress as any);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Address saved successfully',
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error('Add address error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to save address' }, { status: 500 });
  }
}
