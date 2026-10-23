import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOfflineSaleDocument extends Document {
  srNo?: string;
  customerName: string;
  phone: string;
  brand?: string;
  cycleModel: string;
  cycleSize?: string;
  purchaseDate: Date;
  purchaseDateRaw?: string;
  price: number;
  paymentMode: 'Cash' | 'Online' | 'UPI' | 'Card';
  feedback?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OfflineSaleSchema = new Schema(
  {
    srNo: {
      type: String,
      trim: true,
      default: '',
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    cycleModel: {
      type: String,
      required: true,
      trim: true,
    },
    cycleSize: {
      type: String,
      trim: true,
      default: '',
    },
    purchaseDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    purchaseDateRaw: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMode: {
      type: String,
      enum: ['Cash', 'Online', 'UPI', 'Card'],
      default: 'Cash',
    },
    feedback: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound text/search indices for high performance lookups
OfflineSaleSchema.index({
  customerName: 'text',
  phone: 'text',
  cycleModel: 'text',
  brand: 'text',
  srNo: 'text',
});

const OfflineSale: Model<IOfflineSaleDocument> =
  mongoose.models.OfflineSale ||
  mongoose.model<IOfflineSaleDocument>('OfflineSale', OfflineSaleSchema);

export default OfflineSale;
