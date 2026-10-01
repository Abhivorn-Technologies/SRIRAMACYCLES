import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'srirama_cycles_super_secure_jwt_secret_key_2026_x';

export interface ITokenPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload: ITokenPayload, customExpiry?: string): string {
  const expiresIn = customExpiry || '7d';
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): ITokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as ITokenPayload;
  } catch (error) {
    return null;
  }
}

export function extractAuthUser(
  request: NextRequest | Request,
  preferredRole?: 'admin' | 'customer'
): ITokenPayload | null {
  try {
    const nextReq = request as any;
    const url = (nextReq.nextUrl?.pathname || nextReq.url || '').toLowerCase();
    const referer = (request.headers.get('referer') || '').toLowerCase();

    // 1. Extract tokens from NextRequest.cookies or raw Cookie header
    let adminToken = nextReq.cookies?.get?.('admin_token')?.value;
    let customerToken =
      nextReq.cookies?.get?.('customer_token')?.value ||
      nextReq.cookies?.get?.('auth_token')?.value;

    if (!adminToken || !customerToken) {
      const cookieHeader = request.headers.get('cookie') || '';
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader
            .split(';')
            .map((c) => c.trim())
            .filter(Boolean)
            .map((c) => {
              const [k, ...v] = c.split('=');
              return [k, decodeURIComponent(v.join('='))];
            })
        );
        if (!adminToken) adminToken = cookies.admin_token;
        if (!customerToken) customerToken = cookies.customer_token || cookies.auth_token;
      }
    }

    // 2. Check Authorization header
    let bearerToken = '';
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      bearerToken = authHeader.split(' ')[1];
    }

    // Determine if this is an admin request context
    const isAdminContext =
      preferredRole === 'admin' ||
      url.includes('/api/admin') ||
      url.includes('/admin') ||
      referer.includes('/admin');

    let token = '';

    if (preferredRole === 'admin') {
      token = adminToken || bearerToken;
    } else if (preferredRole === 'customer') {
      token = customerToken || bearerToken;
    } else if (isAdminContext) {
      // In admin context, prioritize admin_token
      token = adminToken || bearerToken || customerToken;
    } else {
      // In general storefront context, prioritize customer_token, with admin_token as fallback
      token = customerToken || bearerToken || adminToken;
    }

    if (!token) return null;
    const decoded = verifyToken(token);
    if (!decoded) return null;

    // Enforce role separation when requested
    if (preferredRole === 'admin' && decoded.role !== 'admin') {
      return null;
    }
    if (preferredRole === 'customer' && decoded.role !== 'customer') {
      return null;
    }
    if (isAdminContext && decoded.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch (err) {
    return null;
  }
}

export const verifyAuth = extractAuthUser;

