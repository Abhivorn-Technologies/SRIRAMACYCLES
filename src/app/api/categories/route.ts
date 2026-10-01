import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { extractAuthUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { SAMPLE_CATEGORIES } from '@/lib/sample-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';
    const query = showAll ? {} : { isActive: true };

    try {
      await connectToDatabase();
      const categories = await Category.find(query)
        .sort({ order: 1, name: 1 })
        .lean();

      if (categories.length > 0) {
        const categoriesWithCount = await Promise.all(
          categories.map(async (cat) => {
            const count = await Product.countDocuments({
              category: cat._id,
              isActive: true,
            });
            return {
              ...cat,
              productCount: count,
            };
          })
        );
        return NextResponse.json({ success: true, categories: categoriesWithCount });
      }
    } catch (dbErr) {
      console.warn('Database categories query failed, returning fallback categories:', dbErr);
    }

    return NextResponse.json({ success: true, categories: SAMPLE_CATEGORIES });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching categories' },
      { status: 500 }
    );
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
    const { name, slug, description, image, icon, order, isActive } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    const category = await Category.create({
      name: name.trim(),
      slug: generatedSlug,
      description: description ? description.trim() : '',
      image: image ? image.trim() : '',
      icon: icon || 'Bike',
      order: order ? Number(order) : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(
      { success: true, message: 'Category created successfully', category },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error creating category' },
      { status: 500 }
    );
  }
}
