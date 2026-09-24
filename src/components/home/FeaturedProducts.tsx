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
}

export default function FeaturedProducts({
  products,
  title = 'Featured Bicycles & Gear',
  subtitle = 'Handpicked for high endurance, precision handling, and speed',
  viewAllLink = '/shop',
}: IFeaturedProductsProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Performance Fleet
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mt-1">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>
          </div>
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
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
