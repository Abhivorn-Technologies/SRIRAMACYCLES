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
    response.cookies.delete('admin_token');
  } else if (role === 'customer') {
    // Delete ONLY customer session cookies, preserving admin session
    response.cookies.delete('customer_token');
    response.cookies.delete('auth_token');
    response.cookies.delete('token');
  } else {
    // Delete all session cookies if not specified
    response.cookies.delete('admin_token');
    response.cookies.delete('customer_token');
    response.cookies.delete('auth_token');
    response.cookies.delete('token');
  }

  return response;
}
