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
import Badge from '../common/Badge';

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
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-brand-200 overflow-hidden card-hover-lift flex flex-col justify-between">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {discountPercent > 0 && (
          <span className="bg-accent-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            Featured
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-brand-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
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
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm ${
          isLiked
            ? 'bg-accent-50 text-accent-600 border border-accent-200'
            : 'bg-white/90 text-slate-500 hover:text-accent-600 hover:bg-white border border-slate-100'
        }`}
        aria-label="Wishlist"
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-accent-600' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4">
            <button
              onClick={() => onQuickView(product)}
              className="w-full bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 backdrop-blur-sm shadow-md transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand and Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
            <span>{product.brand}</span>
            {product.categoryName && (
              <span className="text-slate-400 font-normal">{product.categoryName}</span>
            )}
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-brand-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="mt-1.5 flex items-center gap-2">
            <RatingStars rating={product.ratings || 4.8} size="sm" showNumber />
            {product.numReviews > 0 && (
              <span className="text-[11px] text-slate-400">({product.numReviews})</span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-brand-700">
                {formatPrice(displayPrice)}
              </span>
              {product.salePrice && product.salePrice > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.stock > 0 ? (
              <span className="text-[10px] text-brand-600 font-semibold flex items-center gap-0.5 mt-0.5">
                <Check className="w-3 h-3 text-brand-600" /> In Stock
              </span>
            ) : (
              <span className="text-[10px] text-accent-600 font-semibold mt-0.5">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="h-9 px-3.5 bg-brand-600 hover:bg-accent-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
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
