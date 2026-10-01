import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { extractAuthUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { SAMPLE_PRODUCTS } from '@/lib/sample-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const isFeatured = searchParams.get('featured');
    const isBestSeller = searchParams.get('bestSeller');
    const isNewArrival = searchParams.get('newArrival');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const showAll = searchParams.get('all') === 'true';
    const activeFilter = searchParams.get('isActive');

    try {
      await connectToDatabase();

      const query: any = {};
      if (activeFilter === 'true') {
        query.isActive = true;
      } else if (activeFilter === 'false') {
        query.isActive = false;
      } else if (!showAll) {
        query.isActive = true;
      }

      if (category) {
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          query.categorySlug = category;
        }
      }

      if (brand) {
        query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (inStock === 'true') {
        query.stock = { $gt: 0 };
      }

      if (isFeatured === 'true') query.isFeatured = true;
      if (isBestSeller === 'true') query.isBestSeller = true;
      if (isNewArrival === 'true') query.isNewArrival = true;

      let sortOptions: any = { createdAt: -1 };
      if (sort === 'price-asc') sortOptions = { price: 1 };
      else if (sort === 'price-desc') sortOptions = { price: -1 };
      else if (sort === 'popular' || sort === 'best-selling')
        sortOptions = { ratings: -1, numReviews: -1 };
      else if (sort === 'newest') sortOptions = { createdAt: -1 };

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        Product.find(query)
          .populate('category', 'name slug')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(query),
      ]);

      const brands = await Product.distinct('brand', { isActive: true });
      return NextResponse.json({
        success: true,
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.max(1, Math.ceil(total / limit)),
        },
        availableBrands: brands.filter(Boolean),
      });
    } catch (dbErr) {
      console.warn('Database query failed, returning rich fallback catalog:', dbErr);
    }

    // Fallback to rich sample dataset so products are always visible
    let filtered = [...SAMPLE_PRODUCTS];

    if (category) {
      filtered = filtered.filter((p) => p.categorySlug === category);
    }
    if (brand) {
      filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
      );
    }
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }
    if (inStock === 'true') {
      filtered = filtered.filter((p) => p.stock > 0);
    }
    if (isFeatured === 'true') {
      filtered = filtered.filter((p) => p.isFeatured);
    }
    if (isBestSeller === 'true') {
      filtered = filtered.filter((p) => p.isBestSeller);
    }
    if (isNewArrival === 'true') {
      filtered = filtered.filter((p) => p.isNewArrival);
    }

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'popular') {
      filtered.sort((a, b) => b.ratings - a.ratings);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);
    const availableBrands = Array.from(new Set(SAMPLE_PRODUCTS.map((p) => p.brand)));

    return NextResponse.json({
      success: true,
      products: paginated,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      availableBrands,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching products' },
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
    const data = await req.json();

    if (!data.name || !data.price || !data.category) {
      return NextResponse.json(
        { success: false, message: 'Product name, price, and category are required' },
        { status: 400 }
      );
    }

    let slug = data.slug ? slugify(data.slug) : slugify(data.name);
    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    const cat = await Category.findById(data.category);

    const product = await Product.create({
      ...data,
      slug,
      categorySlug: cat?.slug || '',
      categoryName: cat?.name || '',
      sku: data.sku || `SRC-${Date.now().toString().slice(-6)}`,
    });

    return NextResponse.json(
      { success: true, message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error creating product' },
      { status: 500 }
    );
  }
}
