export interface IUserAddress {
  _id?: string;
  name?: string;
  phone?: string;
  addressType?: 'Home' | 'Work' | 'Other' | string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses?: IUserAddress[];
  wishlist?: string[] | IProduct[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface IVariant {
  size?: string;
  color?: string;
  sku?: string;
  stock?: number;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: ICategory | string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface IOrderItem {
  product: string | IProduct;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface IOrderStatusUpdate {
  status: string;
  message: string;
  timestamp: string | Date;
}

export type OrderStatusType =
  | 'Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface IOrder {
  _id: string;
  orderNumber: string;
  user?: string | IUser;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: IUserAddress;
  items: IOrderItem[];
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  paymentMethod: 'COD' | 'CARD' | 'UPI' | 'NETBANKING' | 'CASH' | 'POS_CARD' | 'POS_UPI' | 'SPLIT';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: OrderStatusType;
  orderSource?: 'ONLINE' | 'POS';
  posDetails?: {
    cashierName?: string;
    paymentMode?: 'Cash' | 'UPI' | 'Card' | 'Split';
    cashReceived?: number;
    changeReturned?: number;
    customDiscount?: number;
    gstInvoiceNumber?: string;
    notes?: string;
  };
  tracking: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery?: string | Date;
    statusUpdates: IOrderStatusUpdate[];
  };
  paymentDetails?: {
    gateway?: string;
    orderId?: string;
    paymentId?: string;
    signature?: string;
    paidAt?: string | Date;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBanner {
  _id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  position: 'hero' | 'promo' | 'middle';
  order: number;
  isActive: boolean;
}

export interface IEnquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface IReview {
  _id: string;
  product: string;
  user?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}
