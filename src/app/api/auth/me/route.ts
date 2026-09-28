import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const roleParam = req.nextUrl.searchParams.get('role') as 'admin' | 'customer' | null;
    
    // Storefront requests by default should check customer session, not admin session
    const authData = extractAuthUser(req, roleParam || 'customer');
    if (!authData) {
      return NextResponse.json({ success: true, user: null }, { status: 200 });
    }

    // If storefront request, do not return admin user as a customer
    if (!roleParam && authData.role === 'admin') {
      return NextResponse.json({ success: true, user: null }, { status: 200 });
    }

    await connectToDatabase();
    const user = await User.findById(authData.userId).select('-password');
    if (!user || !user.isActive) {
      return NextResponse.json({ success: true, user: null }, { status: 200 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Fetch me error:', error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
