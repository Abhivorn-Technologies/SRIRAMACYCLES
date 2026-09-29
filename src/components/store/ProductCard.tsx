'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { IProduct } from '@/types';
import { formatPrice, calculateDiscountPercent } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import RatingStars from './RatingStars';

interface IProductCardProps {
  product: IProduct;
  onQuickView?: (product: IProduct) => void;
}

export default function ProductCard({ product, onQuickView }: IProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isLiked = isInWishlist(product._id);
  const discountPercent = calculateDiscountPercent(product.price, product.salePrice);
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';
  const displayPrice =
    product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-brand-300 overflow-hidden card-hover-lift flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-xl">
      
      {/* Top Badges with subtle Floating Animation */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-gradient-to-r from-accent-600 to-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md tracking-wider">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg shadow-sm">
            Featured
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-brand-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg shadow-sm">
            New
          </span>
        )}
      </div>

      {/* Wishlist Button with Heart Beat Pop Effect */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md active:scale-90 ${
          isLiked
            ? 'bg-accent-50 text-accent-600 border border-accent-200 scale-110'
            : 'bg-white/85 text-slate-500 hover:text-accent-600 hover:bg-white border border-slate-200/60 hover:scale-110'
        }`}
        aria-label="Wishlist"
        title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 transition-transform duration-200 ${isLiked ? 'fill-accent-600 scale-110' : ''}`} />
      </button>

      {/* Product Image Container with Zoom Effect */}
      <div className="relative aspect-[4/3] w-full bg-slate-900/5 overflow-hidden image-zoom-container">
        <Link href={`/product/${product.slug}`} className="block relative w-full h-full">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          {/* Subtle Hover Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>

        {/* Floating Quick View CTA Slide Up */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-3.5 flex justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out px-4 z-20">
            <button
              onClick={() => onQuickView(product)}
              className="w-full bg-slate-950/90 hover:bg-slate-950 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 backdrop-blur-md shadow-lg border border-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-brand-400" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Category Tag */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
            <span className="text-brand-700 font-bold uppercase tracking-wider text-[10px] bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/50">
              {product.brand}
            </span>
            {product.categoryName && (
              <span className="text-slate-400 text-[11px] font-medium">{product.categoryName}</span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block group/title">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 group-hover/title:text-brand-600 transition-colors leading-snug tracking-tight">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={product.ratings || 4.8} size="sm" showNumber />
            {product.numReviews > 0 && (
              <span className="text-[11px] text-slate-400 font-medium">({product.numReviews})</span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                {formatPrice(displayPrice)}
              </span>
              {product.salePrice && product.salePrice > 0 && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.stock > 0 ? (
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
                <Check className="w-3 h-3 text-emerald-600" /> In Stock
              </span>
            ) : (
              <span className="text-[10px] text-rose-600 font-bold mt-0.5">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart CTA with Hover Lift */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="h-9 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all shadow-md hover:shadow-brand-600/30 active:scale-95 btn-glow shrink-0 cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

    </div>
  );
}
