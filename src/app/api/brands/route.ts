import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Brand from '@/models/Brand';
import { extractAuthUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const DEFAULT_BRANDS = [
  'Gang',
  'Zeus',
  'Ralco',
  'Rajanik',
  'Vallabha',
  'Speed',
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';
    const query = showAll ? {} : { isActive: true };

    await connectToDatabase();

    // Check count and seed default brands if collection is empty
    const count = await Brand.countDocuments();
    if (count === 0) {
      const seedData = DEFAULT_BRANDS.map((name, index) => ({
        name,
        slug: slugify(name),
        description: `${name} Bicycles & Spares`,
        isActive: true,
        order: index + 1,
      }));
      await Brand.insertMany(seedData);
    }

    const brands = await Brand.find(query).sort({ order: 1, name: 1 }).lean();

    return NextResponse.json({
      success: true,
      brands,
    });
  } catch (error: any) {
    console.error('Error fetching brands:', error);
    // Fallback if DB connection issue
    return NextResponse.json({
      success: true,
      brands: DEFAULT_BRANDS.map((name, index) => ({
        _id: `fallback-${index}`,
        name,
        slug: slugify(name),
        description: `${name} Bicycles`,
        isActive: true,
        order: index + 1,
      })),
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = extractAuthUser(req, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Brand name is required' },
        { status: 400 }
      );
    }

    const slug = body.slug ? slugify(body.slug) : slugify(name);

    // Check for duplicate name
    const existing = await Brand.findOne({
      $or: [{ name: { $regex: `^${name}$`, $options: 'i' } }, { slug }],
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: `Brand "${name}" already exists` },
        { status: 400 }
      );
    }

    const newBrand = await Brand.create({
      name,
      slug,
      description: String(body.description || '').trim(),
      logo: String(body.logo || '').trim(),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      order: Number(body.order) || 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Brand created successfully',
      brand: newBrand,
    });
  } catch (error: any) {
    console.error('Error creating brand:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'A brand with this name or slug already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create brand' },
      { status: 500 }
    );
  }
}
