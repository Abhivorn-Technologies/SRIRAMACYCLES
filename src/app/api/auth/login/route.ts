import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password, requiredRole } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    const identifier = (email || '').trim();
    const cleanPhone = identifier.replace(/\D/g, '');

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        ...(cleanPhone.length >= 10 ? [{ phone: cleanPhone }] : []),
      ],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email/mobile number or password' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (requiredRole && requiredRole === 'admin' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied: Admin credentials required' },
        { status: 403 }
      );
    }

    const isAdminUser = user.role === 'admin';
    const sessionMaxAge = isAdminUser ? 60 * 60 : 7 * 24 * 60 * 60; // 1 hour for admin, 7 days for customer

    const token = signToken(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
      isAdminUser ? '1h' : '7d'
    );

    const response = NextResponse.json(
      {
        success: true,
        message: 'Signed in successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses || [],
        },
      },
      { status: 200 }
    );

    if (isAdminUser) {
      // Admin console session ONLY - does NOT log into customer storefront
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: sessionMaxAge,
      });
    } else {
      // Customer storefront session
      response.cookies.set('customer_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: sessionMaxAge,
      });
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: sessionMaxAge,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
