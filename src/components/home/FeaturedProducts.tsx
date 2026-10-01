'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { IProduct } from '@/types';
import ProductCard from '../store/ProductCard';
import QuickViewModal from '../store/QuickViewModal';

interface IFeaturedProductsProps {
  products: IProduct[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  buttonText?: string;
  limit?: number;
}

export default function FeaturedProducts({
  products,
  title = 'Featured Bicycles & Gear',
  subtitle = 'Handpicked for high endurance, precision handling, and speed',
  viewAllLink = '/shop',
  buttonText,
  limit = 8,
}: IFeaturedProductsProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);

  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, limit);

  // Dynamically resolve product-filter based button text
  const resolvedButtonText =
    buttonText ||
    (viewAllLink.includes('featured=true')
      ? 'View All Featured Cycles'
      : viewAllLink.includes('bestSeller=true')
      ? 'View All Best Sellers'
      : viewAllLink.includes('category=')
      ? `View All ${title}`
      : `Explore All ${title}`);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-accent-600 uppercase tracking-widest">
              Performance Fleet
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mt-1">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>
          </div>
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group"
          >
            <span>{resolvedButtonText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Product Grid (Capped strictly to 8 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Bottom CTA to explore all filtered products */}
        <div className="mt-12 text-center">
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2.5 bg-white hover:bg-brand-50 border-2 border-brand-200 hover:border-brand-500 text-slate-900 hover:text-brand-700 text-xs sm:text-sm font-extrabold px-7 py-3.5 rounded-xl shadow-xs transition-all active:scale-95 group"
          >
            <span>{resolvedButtonText} ({products.length > limit ? `${products.length}+` : products.length} Models)</span>
            <ArrowRight className="w-4 h-4 text-brand-600 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}
