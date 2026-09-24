import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  const cookieOptions = { path: '/' };
  response.cookies.delete('auth_token');
  response.cookies.delete('admin_token');
  response.cookies.delete('customer_token');
  response.cookies.delete('token');
  return response;
}
