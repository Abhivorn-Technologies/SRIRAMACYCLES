export const APP_NAME = 'Sri Rama Cycle & Auto Spare Parts';
export const APP_SHORT_NAME = 'Sri Rama Cycle & Auto Spare Parts';
export const ESTABLISHED_YEAR = '1976';
export const APP_TAGLINE = 'Since 1976 | Premium Cycles, Auto Spare Parts & Pro Service';
export const APP_DESCRIPTION =
  'Sri Rama Cycle and Auto Spare Parts (Kazipet, Hanumakonda) - Leading store since 1976 for premium road cycles, mountain cycles, standard cycles, disc brake cycles, auto spare parts, and expert service.';

export const CURRENCY_SYMBOL = '₹';
export const FREE_SHIPPING_THRESHOLD = 0; // 100% Free shipping on all orders
export const STANDARD_SHIPPING_COST = 0; // Completely free delivery
export const TAX_RATE = 0; // Prices are inclusive of GST

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/shop' },
  { label: 'Road Cycles', href: '/shop?category=road-bikes' },
  { label: 'Mountain Cycles', href: '/shop?category=mountain-bikes' },
  { label: 'Ladies Cycles', href: '/shop?category=ladies-bicycles' },
  { label: 'Disc Brake Cycles', href: '/shop?category=disc-brake-cycles' },
  { label: 'Standard Cycles', href: '/shop?category=standard-cycles' },
  { label: 'Accessories & Spares', href: '/shop?category=cycling-accessories' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export const ORDER_STATUSES = [
  'Placed',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
] as const;

export const PAYMENT_METHODS = [
  { id: 'COD', name: 'Cash on Delivery', description: 'Pay cash upon doorstep arrival' },
  { id: 'UPI', name: 'UPI & QR Payment', description: 'Instant Google Pay, PhonePe, Paytm' },
  { id: 'CARD', name: 'Credit / Debit Card', description: 'Visa, MasterCard, RuPay' },
  { id: 'NETBANKING', name: 'Net Banking', description: 'All major Indian banking partners' },
];

export const STORE_CONTACT = {
  businessName: 'SRI RAMA CYCLE AND AUTO SPARE PARTS',
  proprietor: 'Ravula. Rakesh Kumar',
  phone: '+91 72076 53194',
  rawPhone: '7207653194',
  whatsapp: '+91 72076 53194',
  whatsappLink: 'https://wa.me/917207653194',
  supportEmail: 'sreeramacycle@gmail.com',
  address: 'SSS COMPLEX B-3, Mainroad, Kazipet, Hanumakonda (Dist) - 506003, Telangana, India',
  shortAddress: 'SSS COMPLEX B-3, Mainroad, Kazipet, Hanumakonda - 506003',
  googleMapsLink: 'https://maps.google.com/?q=Sri+Rama+Cycle+%26+Auto+Spare+Parts+SSS+COMPLEX+B-3+Mainroad+Kazipet+Hanumakonda+506003',
  hours: 'Mon – Sat: 9:00 AM – 8:30 PM | Sun: 9:00 AM – 1:00 PM',
  weekdaysHours: 'Mon – Sat: 9:00 AM – 8:30 PM',
  sundayHours: 'Sunday: 9:00 AM – 1:00 PM only',
};
