import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    await connectToDatabase();

    const product = await Product.findOne(
      slug.match(/^[0-9a-fA-F]{24}$/) ? { _id: slug } : { slug }
    );

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const reviews = await Review.find({ product: product._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      ratings: product.ratings,
      numReviews: product.numReviews,
      reviews,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await req.json();
    const { name, rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid rating between 1 and 5 stars' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'Please write a review comment (minimum 5 characters)' },
        { status: 400 }
      );
    }

    const auth = extractAuthUser(req);
    await connectToDatabase();

    const product = await Product.findOne(
      slug.match(/^[0-9a-fA-F]{24}$/) ? { _id: slug } : { slug }
    );

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Create review
    const review = await Review.create({
      product: product._id,
      user: auth ? auth.userId : null,
      name: (name || auth?.name || 'Verified Customer').trim(),
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Recalculate average rating & total reviews
    const allReviews = await Review.find({ product: product._id });
    const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalScore / allReviews.length).toFixed(1));

    product.ratings = avgRating;
    product.numReviews = allReviews.length;
    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully! Thank you for your feedback.',
      ratings: product.ratings,
      numReviews: product.numReviews,
      review,
    });
  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}
