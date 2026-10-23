import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Brand from '@/models/Brand';
import { extractAuthUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

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

    const updateData: any = {};
    if (body.name) {
      updateData.name = String(body.name).trim();
      updateData.slug = body.slug ? slugify(body.slug) : slugify(updateData.name);

      // Check unique collision with other brands
      const collision = await Brand.findOne({
        _id: { $ne: id },
        $or: [
          { name: { $regex: `^${updateData.name}$`, $options: 'i' } },
          { slug: updateData.slug },
        ],
      });

      if (collision) {
        return NextResponse.json(
          { success: false, message: `Brand "${updateData.name}" already exists` },
          { status: 400 }
        );
      }
    }

    if (body.description !== undefined) updateData.description = String(body.description).trim();
    if (body.logo !== undefined) updateData.logo = String(body.logo).trim();
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.order !== undefined) updateData.order = Number(body.order) || 0;

    const brand = await Brand.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!brand) {
      return NextResponse.json({ success: false, message: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Brand updated successfully',
      brand,
    });
  } catch (error: any) {
    console.error('Error updating brand:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'A brand with this name or slug already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating brand' },
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

    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      return NextResponse.json({ success: false, message: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Brand "${brand.name}" deleted successfully`,
    });
  } catch (error: any) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error deleting brand' },
      { status: 500 }
    );
  }
}
