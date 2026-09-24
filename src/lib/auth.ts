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
  const expiresIn = customExpiry || (payload.role === 'admin' ? '1h' : '7d');
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
    // 1. Check cookies (NextRequest.cookies or raw header)
    let token = '';
    const nextReq = request as any;
    const url = nextReq.nextUrl?.pathname || nextReq.url || '';
    const isAdminRoute = preferredRole === 'admin' || url.includes('/api/admin') || url.includes('/admin');

    if (isAdminRoute) {
      token = nextReq.cookies?.get?.('admin_token')?.value;
    } else {
      token = nextReq.cookies?.get?.('customer_token')?.value ||
              nextReq.cookies?.get?.('auth_token')?.value ||
              nextReq.cookies?.get?.('token')?.value;
    }

    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
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
      if (isAdminRoute) {
        token = cookies.admin_token;
      } else {
        token = cookies.customer_token || cookies.auth_token || cookies.token;
      }
    }

    // 2. Check Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) return null;
    const decoded = verifyToken(token);
    if (!decoded) return null;

    // Enforce role separation:
    // If route is NOT an admin route, reject admin tokens so admin sessions never hijack customer data
    if (!isAdminRoute && decoded.role === 'admin') {
      return null;
    }

    // If route IS an admin route, require admin role
    if (isAdminRoute && decoded.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch (err) {
    return null;
  }
}

export const verifyAuth = extractAuthUser;

