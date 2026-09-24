import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Review from '@/models/Review';
import { extractAuthUser } from '@/lib/auth';
import { SAMPLE_PRODUCTS } from '@/lib/sample-data';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    try {
      await connectToDatabase();

      let product = await Product.findOne({ slug })
        .populate('category', 'name slug')
        .lean();

      if (!product && slug.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(slug)
          .populate('category', 'name slug')
          .lean();
      }

      if (product) {
        const relatedProducts = await Product.find({
          category: (product.category as any)?._id || product.category,
          _id: { $ne: product._id },
          isActive: true,
        })
          .limit(4)
          .lean();

        const reviews = await Review.find({ product: product._id })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

        return NextResponse.json({
          success: true,
          product,
          relatedProducts,
          reviews,
        });
      }
    } catch (dbErr) {
      console.warn('DB query failed, checking sample data:', dbErr);
    }

    // Fallback to sample item
    const sample = SAMPLE_PRODUCTS.find((p) => p.slug === slug || p._id === slug);
    if (sample) {
      const related = SAMPLE_PRODUCTS.filter((p) => p._id !== sample._id).slice(0, 4);
      return NextResponse.json({
        success: true,
        product: sample,
        relatedProducts: related,
        reviews: [],
      });
    }

    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = extractAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { slug } = params;
    const updateData = await req.json();

    if (updateData.category) {
      const cat = await Category.findById(updateData.category);
      if (cat) {
        updateData.categorySlug = cat.slug;
        updateData.categoryName = cat.name;
      }
    }

    const product = await Product.findOneAndUpdate(
      slug.match(/^[0-9a-fA-F]{24}$/) ? { _id: slug } : { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found to update' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = extractAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { slug } = params;

    const query = slug.match(/^[0-9a-fA-F]{24}$/) ? { _id: slug } : { slug };
    const product = await Product.findOneAndDelete(query);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error deleting product' },
      { status: 500 }
    );
  }
}
