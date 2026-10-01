import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { extractAuthUser } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = extractAuthUser(req, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { id } = params;
    const body = await req.json();

    const banner = await Banner.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!banner) {
      return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Banner updated', banner });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = extractAuthUser(req, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { id } = params;

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error deleting banner' },
      { status: 500 }
    );
  }
}
