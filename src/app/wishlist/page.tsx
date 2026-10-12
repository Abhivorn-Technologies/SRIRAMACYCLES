'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/store/ProductCard';
import { useLanguage } from '@/context/LanguageContext';

export default function WishlistPage() {
  const { t } = useLanguage();
  const { wishlist, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-white dark:bg-slate-950 transition-colors duration-200">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-400 mb-6">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('wishlist.empty_title')}</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-2 mb-8">
          {t('wishlist.empty_desc')}
        </p>
        <Link
          href="/shop"
          className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm py-3.5 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-brand-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <span>{t('wishlist.discover_btn')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('wishlist.title')} ({wishlist.length})
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('wishlist.subtitle')}
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-800 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t('wishlist.clear_btn')}
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

