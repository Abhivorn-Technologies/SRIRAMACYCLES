import mongoose, { Schema, Document, Model } from 'mongoose';
import { ISpecification, IVariant } from '@/types';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  brand: string;
  category: mongoose.Types.ObjectId | string;
  categorySlug?: string;
  categoryName?: string;
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
  images: string[];
  shortDescription?: string;
  description: string;
  specifications: ISpecification[];
  variants?: IVariant[];
  isFeatured: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isActive: boolean;
  ratings: number;
  numReviews: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SpecificationSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const VariantSchema = new Schema({
  size: { type: String, default: '' },
  color: { type: String, default: '' },
  sku: { type: String, default: '' },
  stock: { type: Number, default: 0 },
});

const ProductSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      default: 'Srirama Cycles',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    categorySlug: {
      type: String,
      default: '',
    },
    categoryName: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide regular price'],
      min: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
    images: {
      type: [String],
      validate: [
        (val: string[]) => val.length > 0,
        'Please provide at least one product image',
      ],
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    specifications: [SpecificationSchema],
    variants: [VariantSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratings: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 'text', brand: 'text', shortDescription: 'text', tags: 'text' });

const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);

export default Product;
