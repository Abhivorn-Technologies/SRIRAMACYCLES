'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { IProduct } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
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
  title,
  subtitle,
  viewAllLink = '/shop',
  buttonText,
  limit = 8,
}: IFeaturedProductsProps) {
  const { t } = useLanguage();
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);

  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, limit);
  const resolvedTitle = title || t('featured.title');
  const resolvedSubtitle = subtitle || t('featured.subtitle');
  const resolvedButtonText = buttonText || t('featured.view_all_btn');

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-900/50 px-3 py-1 rounded-full">
              {t('featured.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {resolvedTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{resolvedSubtitle}</p>
          </div>
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors group"
          >
            <span>{resolvedButtonText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
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
            className="inline-flex items-center gap-2.5 bg-white dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-slate-800 border-2 border-brand-200 dark:border-brand-900 hover:border-brand-500 dark:hover:border-brand-500 text-slate-900 dark:text-white hover:text-brand-700 dark:hover:text-brand-300 text-xs sm:text-sm font-extrabold px-7 py-3.5 rounded-xl shadow-xs transition-all active:scale-95 group"
          >
            <span>{resolvedButtonText} ({products.length > limit ? `${products.length}+` : products.length} Models)</span>
            <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400 group-hover:translate-x-1.5 transition-transform" />
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
