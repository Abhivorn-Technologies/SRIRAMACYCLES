'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { IProduct } from '@/types';
import { formatPrice, calculateDiscountPercent } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import RatingStars from './RatingStars';

interface IProductCardProps {
  product: IProduct;
  onQuickView?: (product: IProduct) => void;
}

export default function ProductCard({ product, onQuickView }: IProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t } = useLanguage();

  const isLiked = isInWishlist(product._id);
  const discountPercent = calculateDiscountPercent(product.price, product.salePrice);
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';
  const displayPrice =
    product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-brand-200/70 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 overflow-hidden card-hover-lift flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl">
      {/* Top Badges */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-gradient-to-r from-brand-600 via-red-600 to-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md shadow-brand-600/30 tracking-wider">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-slate-950 dark:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg shadow-sm border border-slate-800 dark:border-slate-700">
            Featured
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg shadow-sm">
            New
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md active:scale-90 ${
          isLiked
            ? 'bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 scale-110'
            : 'bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700 hover:scale-110'
        }`}
        aria-label="Wishlist"
        title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-200 ${
            isLiked ? 'fill-brand-600 text-brand-600 dark:fill-brand-400 dark:text-brand-400 scale-110' : ''
          }`}
        />
      </button>

      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-900/5 dark:bg-slate-800/40 overflow-hidden image-zoom-container">
        <Link href={`/product/${product.slug}`} className="block relative w-full h-full">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>

        {/* Quick View CTA */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-3.5 flex justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out px-4 z-20">
            <button
              onClick={() => onQuickView(product)}
              className="w-full bg-slate-950/90 hover:bg-slate-950 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 backdrop-blur-md shadow-lg border border-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-brand-400" />
              <span>{t('btn.view_details')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Category Tag */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
            <span className="text-brand-700 dark:text-brand-400 font-bold uppercase tracking-wider text-[10px] bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md border border-brand-200/50 dark:border-brand-900/50">
              {product.brand}
            </span>
            {product.categoryName && (
              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">{product.categoryName}</span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block group/title">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover/title:text-brand-600 dark:group-hover/title:text-brand-400 transition-colors leading-snug tracking-tight">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={product.ratings || 4.8} size="sm" showNumber />
            {product.numReviews > 0 && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">({product.numReviews})</span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-950 dark:text-white tracking-tight">
                {formatPrice(displayPrice)}
              </span>
              {product.salePrice && product.salePrice > 0 && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.stock > 0 ? (
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {t('product.in_stock')}
              </span>
            ) : (
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold mt-0.5">{t('product.out_of_stock')}</span>
            )}
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="h-9 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all shadow-md hover:shadow-brand-600/30 active:scale-95 btn-glow shrink-0 cursor-pointer"
            aria-label={t('btn.add_to_cart')}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('btn.add_to_cart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
