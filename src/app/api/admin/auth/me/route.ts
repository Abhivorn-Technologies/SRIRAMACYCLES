import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authData = extractAuthUser(req, 'admin');
    if (!authData || authData.role !== 'admin') {
      return NextResponse.json({ success: true, user: null }, { status: 200 });
    }

    // Fallback mode: if userId is the fallback ID, trust the JWT directly
    if (authData.userId === 'fallback_admin_id') {
      return NextResponse.json({
        success: true,
        user: {
          _id: 'fallback_admin_id',
          name: authData.name || 'Sri Rama Administrator',
          email: authData.email || 'admin@sriramacycles.com',
          role: 'admin',
          phone: '9849232323',
          isActive: true,
          addresses: [],
        },
      });
    }

    // Normal mode: verify against DB
    try {
      await connectToDatabase();
      const user = await User.findById(authData.userId).select('-password');
      if (!user || !user.isActive || user.role !== 'admin') {
        return NextResponse.json({ success: true, user: null }, { status: 200 });
      }
      return NextResponse.json({ success: true, user });
    } catch (dbError: any) {
      console.error('Fetch admin me DB error (DB unreachable):', dbError);
      // If DB is down but JWT is valid admin token, trust the JWT
      return NextResponse.json({
        success: true,
        user: {
          _id: authData.userId,
          name: authData.name || 'Administrator',
          email: authData.email,
          role: 'admin',
          isActive: true,
          addresses: [],
        },
      });
    }
  } catch (error: any) {
    console.error('Fetch admin me error:', error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
