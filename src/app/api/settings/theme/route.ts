import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Setting from '@/models/Setting';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const setting = await Setting.findOne({ key: 'color_theme' }).lean();
    const themeId = setting?.value || 'racing-red';
    return NextResponse.json({ success: true, themeId });
  } catch (error: any) {
    return NextResponse.json({ success: true, themeId: 'racing-red' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { themeId } = body;

    const validThemes = ['racing-red', 'royal-navy', 'emerald-sport', 'sunset-amber', 'stealth-titanium'];
    if (!themeId || !validThemes.includes(themeId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid theme specified' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await Setting.findOneAndUpdate(
      { key: 'color_theme' },
      { value: themeId },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, themeId });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update theme' },
      { status: 500 }
    );
  }
}
