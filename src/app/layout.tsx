import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} | Bicycles & Auto Spare Parts, Kazipet Hanumakonda`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'Sri Rama Cycle and Auto Spare Parts',
    'Sri Rama Cycles Kazipet',
    'Cycles in Hanumakonda',
    'Auto Spare Parts Kazipet',
    'Ravula Rakesh Kumar',
    'road bikes Telangana',
    'mountain bikes',
    'electric cycles',
    'cycling accessories',
    'buy bicycle online',
  ],
  authors: [{ name: 'Sri Rama Cycle & Auto Spare Parts' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-500 selection:text-white">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <StorefrontLayout>{children}</StorefrontLayout>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
