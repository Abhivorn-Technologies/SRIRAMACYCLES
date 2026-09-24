import mongoose, { Schema, Document, Model } from 'mongoose';
import { IBanner } from '@/types';

export interface IBannerDocument extends Omit<IBanner, '_id'>, Document {}

const BannerSchema = new Schema<IBannerDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    tag: { type: String, default: '' },
    image: { type: String, required: true },
    ctaText: { type: String, default: 'Shop Now' },
    ctaLink: { type: String, default: '/shop' },
    position: { type: String, enum: ['hero', 'promo', 'middle'], default: 'hero' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Banner: Model<IBannerDocument> =
  mongoose.models.Banner || mongoose.model<IBannerDocument>('Banner', BannerSchema);

export default Banner;
