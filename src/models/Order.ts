import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUserAddress, IOrderItem, OrderStatusType, IOrderStatusUpdate } from '@/types';

export interface IOrderDocument extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId | string | null;
  customer: {
    name: string;
    email?: string; // Optional — POS walk-in customers may not have email
    phone: string;
  };
  shippingAddress: IUserAddress;
  items: any[];
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  paymentMethod: 'COD' | 'CARD' | 'UPI' | 'NETBANKING';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: OrderStatusType;
  /** 'ONLINE' for website orders, 'POS' for in-store counter sales */
  orderSource?: 'ONLINE' | 'POS';
  posDetails?: {
    cashierName?: string;
    paymentMode?: string;
    cashReceived?: number;
    changeReturned?: number;
    customDiscount?: number;
    gstInvoiceNumber?: string;
    notes?: string;
  };
  tracking: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery?: Date;
    statusUpdates: IOrderStatusUpdate[];
  };
  paymentDetails?: {
    gateway?: string;
    orderId?: string;
    paymentId?: string;
    signature?: string;
    paidAt?: Date;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  variant: {
    size: { type: String, default: '' },
    color: { type: String, default: '' },
  },
});

const StatusUpdateSchema = new Schema({
  status: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: false, default: '' }, // Optional — POS walk-in customers have no email
      phone: { type: String, required: true },
    },
    shippingAddress: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      addressType: { type: String, default: 'Home' },
      street: { type: String, required: true },
      landmark: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    items: [OrderItemSchema],
    pricing: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    paymentMethod: {
      type: String,
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: [
        'Placed',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Placed',
    },
    orderSource: {
      type: String,
      enum: ['ONLINE', 'POS'],
      default: 'ONLINE',
    },
    posDetails: {
      cashierName: { type: String, default: 'Store Counter' },
      paymentMode: { type: String, default: 'Cash' },
      cashReceived: { type: Number, default: 0 },
      changeReturned: { type: Number, default: 0 },
      customDiscount: { type: Number, default: 0 },
      gstInvoiceNumber: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    paymentDetails: {
      gateway: { type: String, default: '' },
      orderId: { type: String, default: '' },
      paymentId: { type: String, default: '' },
      signature: { type: String, default: '' },
      paidAt: { type: Date },
    },
    tracking: {
      carrier: { type: String, default: 'Srirama Express Courier' },
      trackingNumber: { type: String, default: '' },
      estimatedDelivery: { type: Date },
      statusUpdates: [StatusUpdateSchema],
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ orderNumber: 1, 'customer.email': 1, 'customer.phone': 1 });

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as any).Order;
}

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default Order;
