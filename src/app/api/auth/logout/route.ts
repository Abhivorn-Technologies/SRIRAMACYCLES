import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');

  const response = NextResponse.json({
    success: true,
    message: role ? `Logged out from ${role} session` : 'Logged out successfully',
  });

  if (role === 'admin') {
    // Delete ONLY admin session cookie, preserving customer session
    response.cookies.set('admin_token', '', { path: '/', maxAge: 0, expires: new Date(0) });
  } else if (role === 'customer') {
    // Delete ONLY customer session cookies, preserving admin session
    response.cookies.set('customer_token', '', { path: '/', maxAge: 0, expires: new Date(0) });
    response.cookies.set('auth_token', '', { path: '/', maxAge: 0, expires: new Date(0) });
    response.cookies.set('token', '', { path: '/', maxAge: 0, expires: new Date(0) });
  } else {
    // Delete all session cookies if not specified
    response.cookies.set('admin_token', '', { path: '/', maxAge: 0, expires: new Date(0) });
    response.cookies.set('customer_token', '', { path: '/', maxAge: 0, expires: new Date(0) });
    response.cookies.set('auth_token', '', { path: '/', maxAge: 0, expires: new Date(0) });
    response.cookies.set('token', '', { path: '/', maxAge: 0, expires: new Date(0) });
  }

  return response;
}
