import mongoose, { Schema, Document, Model } from 'mongoose';
import { IBrand } from '@/types';

export interface IBrandDocument extends Omit<IBrand, '_id'>, Document {}

const BrandSchema = new Schema<IBrandDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide brand name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Brand: Model<IBrandDocument> =
  mongoose.models.Brand || mongoose.model<IBrandDocument>('Brand', BrandSchema);

export default Brand;
