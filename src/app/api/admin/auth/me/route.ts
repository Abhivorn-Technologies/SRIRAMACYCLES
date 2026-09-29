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

    await connectToDatabase();
    const user = await User.findById(authData.userId).select('-password');
    if (!user || !user.isActive || user.role !== 'admin') {
      return NextResponse.json({ success: true, user: null }, { status: 200 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Fetch admin me error:', error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
