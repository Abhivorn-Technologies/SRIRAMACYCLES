'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/store/ProductCard';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-white">
        <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-6">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 mb-8">
          You haven't saved any cycles or gear yet. Explore the shop and tap the heart icon on products you love.
        </p>
        <Link
          href="/shop"
          className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm py-3.5 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-brand-600/20 transition-all active:scale-95"
        >
          <span>Discover Bicycles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Saved Wishlist ({wishlist.length})
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Products you have marked to purchase or track
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Wishlist
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
