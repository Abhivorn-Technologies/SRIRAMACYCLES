import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const orderNumber = searchParams.get('orderNumber');
    const ratingFilter = searchParams.get('rating');
    const search = searchParams.get('search');

    if (isAdmin) {
      const auth = extractAuthUser(req, 'admin');
      if (!auth || auth.role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Unauthorized: Admin access required' },
          { status: 403 }
        );
      }

      const query: any = {};
      if (ratingFilter && ratingFilter !== 'all') {
        query.rating = Number(ratingFilter);
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { name: regex },
          { orderNumber: regex },
          { comment: regex },
          { email: regex },
          { phone: regex },
          { productName: regex },
        ];
      }

      const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();

      // Compute statistics dynamically for admin dashboard
      const allReviews = await Review.find().lean();
      const totalReviews = allReviews.length;
      const averageRating =
        totalReviews > 0
          ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
          : 0;
      const fiveStarCount = allReviews.filter((r) => r.rating === 5).length;
      const satisfactionRate =
        totalReviews > 0 ? Math.round((fiveStarCount / totalReviews) * 100) : 0;
      const verifiedCount = allReviews.filter((r) => r.orderNumber || r.order).length;
      const verifiedRate =
        totalReviews > 0 ? Math.round((verifiedCount / totalReviews) * 100) : 0;
      const pendingReviewsCount = allReviews.filter((r) => !r.isApproved).length;

      return NextResponse.json({
        success: true,
        reviews,
        stats: {
          totalReviews,
          averageRating,
          fiveStarCount,
          satisfactionRate,
          verifiedRate,
          verifiedCount,
          pendingReviewsCount,
        },
      });
    }

    // Public or order-specific query (e.g. check if order already has review)
    if (orderNumber) {
      const existingReview = await Review.findOne({
        orderNumber: orderNumber.trim(),
      }).lean();
      return NextResponse.json({
        success: true,
        hasReviewed: !!existingReview,
        review: existingReview || null,
      });
    }

    // General public approved reviews
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      orderNumber,
      name,
      email,
      phone,
      rating,
      comment,
      reviewContext = 'order_placed',
      productId,
      productName,
    } = body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return NextResponse.json(
        { success: false, message: 'Please select a star rating between 1 and 5' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: 'Please share your review message (minimum 3 characters)' },
        { status: 400 }
      );
    }

    let customerName = (name || '').trim();
    let customerEmail = (email || '').trim();
    let customerPhone = (phone || '').trim();
    let linkedOrder: any = null;
    let resolvedProductName = (productName || '').trim();

    // Look up order if orderNumber is supplied
    if (orderNumber && orderNumber.trim()) {
      linkedOrder = await Order.findOne({ orderNumber: orderNumber.trim() });
      if (linkedOrder) {
        if (!customerName && linkedOrder.customer?.name) {
          customerName = linkedOrder.customer.name;
        }
        if (!customerEmail && linkedOrder.customer?.email) {
          customerEmail = linkedOrder.customer.email;
        }
        if (!customerPhone && linkedOrder.customer?.phone) {
          customerPhone = linkedOrder.customer.phone;
        }
        if (!resolvedProductName && Array.isArray(linkedOrder.items) && linkedOrder.items.length > 0) {
          resolvedProductName = linkedOrder.items.map((it: any) => it.name).join(', ');
        }
      }
    }

    if (!customerName) {
      customerName = 'Valued Customer';
    }

    const review = await Review.create({
      orderNumber: (orderNumber || '').trim(),
      order: linkedOrder ? linkedOrder._id : null,
      product: productId || null,
      productName: resolvedProductName,
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      rating: Number(rating),
      comment: comment.trim(),
      reviewContext,
      isApproved: true,
    });

    // If linked to a product, update product aggregate rating
    if (productId) {
      try {
        const prod = await Product.findById(productId);
        if (prod) {
          const productReviews = await Review.find({ product: productId, isApproved: true });
          const totalScore = productReviews.reduce((sum, r) => sum + r.rating, 0);
          prod.ratings = Number((totalScore / productReviews.length).toFixed(1));
          prod.numReviews = productReviews.length;
          await prod.save();
        }
      } catch (prodErr) {
        console.warn('Could not update product rating:', prodErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your review has been submitted successfully.',
        review,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}
