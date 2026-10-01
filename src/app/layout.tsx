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
    default: `${APP_NAME} | Cycles & Auto Spare Parts, Kazipet Hanumakonda`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'Sri Rama Cycle and Auto Spare Parts',
    'Sri Rama Cycles Kazipet',
    'Cycles in Hanumakonda',
    'Auto Spare Parts Kazipet',
    'Ravula Rakesh Kumar',
    'road cycles Telangana',
    'mountain cycles',
    'standard cycles',
    'disc brake cycles',
    'cycling accessories',
    'buy cycle online',
  ],
  authors: [{ name: 'Sri Rama Cycle & Auto Spare Parts' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    type: 'website',
    images: [
      {
        url: '/SRI RAMA logo 3.png',
        width: 1200,
        height: 630,
        alt: 'Sri Rama Cycle Store & Auto Spares Logo',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-500 selection:text-white" suppressHydrationWarning>
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
