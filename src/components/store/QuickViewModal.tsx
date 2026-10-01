'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Heart, ShoppingBag, Check, ShieldCheck, Truck, Zap } from 'lucide-react';
import { IProduct } from '@/types';
import { formatPrice, calculateDiscountPercent } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import RatingStars from './RatingStars';

interface IQuickViewModalProps {
  product: IProduct | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: IQuickViewModalProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.variants?.[0]?.size || '');
  const [selectedColor, setSelectedColor] = useState(product?.variants?.find((v) => v.color)?.color || '');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isLiked = isInWishlist(product._id);
  const discountPercent = calculateDiscountPercent(product.price, product.salePrice);
  const displayPrice =
    product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery */}
        <div className="md:w-1/2 p-6 flex flex-col gap-3 bg-slate-50">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-200/80">
            {images.length > 0 && (
              <Image
                src={images[selectedImage] || images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx ? 'border-brand-600 ring-2 ring-brand-100' : 'border-slate-200'
                  }`}
                >
                  <Image src={img} alt="thumb" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
              <span>{product.brand}</span>
              <span className="text-slate-400 font-normal">SKU: {product.sku || 'N/A'}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 leading-snug">{product.name}</h2>

            <div className="mt-2 flex items-center gap-2">
              <RatingStars rating={product.ratings} size="sm" showNumber />
              <span className="text-xs text-slate-400">({product.numReviews} reviews)</span>
            </div>

            {/* Price & Stock */}
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(displayPrice)}
                </span>
                {product.salePrice && product.salePrice > 0 && (
                  <span className="text-base text-slate-400 line-through font-medium">
                    {formatPrice(product.price)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-2 py-0.5 rounded-full">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {product.stock > 0 ? (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  product.stock <= 5 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {product.stock <= 5 ? `Only ${product.stock} Left` : 'In Stock'}
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Color Variants if available */}
            {product.variants && product.variants.some((v) => v.color) && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Select Color:
                  </label>
                  {selectedColor && (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200">
                      {selectedColor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))).map((color, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedColor(color as string)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedColor === color
                          ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-300'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Variants if available */}
            {product.variants && product.variants.some((v) => v.size) && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Frame / Wheel Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants
                    .filter((v) => v.size)
                    .map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(v.size || '')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          selectedSize === v.size
                            ? 'border-brand-600 bg-brand-50 text-brand-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="mt-6 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-600 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => product.stock ? Math.min(product.stock, q + 1) : q + 1)}
                    disabled={typeof product.stock === 'number' && quantity >= product.stock}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, quantity, selectedSize, selectedColor);
                    onClose();
                  }}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                    isLiked
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Direct Instant Buy Now */}
              <button
                onClick={() => {
                  const chosenImage = images[selectedImage] || images[0] || '';
                  const buyNowPayload = {
                    product,
                    quantity,
                    selectedSize,
                    selectedColor,
                    image: chosenImage,
                  };
                  try {
                    sessionStorage.setItem('srirama_buy_now', JSON.stringify(buyNowPayload));
                  } catch (e) {
                    console.error('Failed to store buyNow item:', e);
                  }
                  onClose();
                  router.push('/checkout?buyNow=1');
                }}
                disabled={product.stock <= 0}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 text-white text-xs sm:text-sm font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 transition-all active:scale-98 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Instant Buy Now</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4"
            >
              View Full Product Specifications &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
