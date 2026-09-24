import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position');

    const query: any = { isActive: true };
    if (position) query.position = position;

    const banners = await Banner.find(query).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching banners' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = extractAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.image) {
      return NextResponse.json(
        { success: false, message: 'Banner title and image are required' },
        { status: 400 }
      );
    }

    const banner = await Banner.create(body);
    return NextResponse.json(
      { success: true, message: 'Banner created successfully', banner },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error creating banner' },
      { status: 500 }
    );
  }
}
