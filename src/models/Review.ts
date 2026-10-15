import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReviewDocument extends Document {
  product?: mongoose.Types.ObjectId | string | null;
  productName?: string;
  orderNumber?: string;
  order?: mongoose.Types.ObjectId | string | null;
  user?: mongoose.Types.ObjectId | string | null;
  name: string;
  email?: string;
  phone?: string;
  rating: number;
  comment: string;
  reviewContext: 'order_placed' | 'order_received' | 'product' | 'general';
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    productName: {
      type: String,
      default: '',
      trim: true,
    },
    orderNumber: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    reviewContext: {
      type: String,
      enum: ['order_placed', 'order_received', 'product', 'general'],
      default: 'order_placed',
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review: Model<IReviewDocument> =
  mongoose.models.Review || mongoose.model<IReviewDocument>('Review', ReviewSchema);

export default Review;
