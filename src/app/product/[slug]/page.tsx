'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Zap,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Wrench,
  ChevronRight,
  Share2,
  Star,
  User,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { IProduct } from '@/types';
import { formatPrice, calculateDiscountPercent } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import RatingStars from '@/components/store/RatingStars';
import ProductCard from '@/components/store/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export const dynamic = 'force-dynamic';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { user } = useAuth();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<Array<{ _id: string; name: string; rating: number; comment: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'shipping' | 'reviews'>('specs');

  // Review Form State
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error } = useToast();

  const availableColors = React.useMemo(() => {
    if (!product) return [];
    const fromVariants = (product.variants?.map((v) => v.color).filter(Boolean) as string[]) || [];
    if (fromVariants.length > 0) {
      return Array.from(new Set(fromVariants));
    }
    const colorSpec = product.specifications?.find((s) =>
      s.key?.toLowerCase().includes('color')
    );
    if (colorSpec && colorSpec.value) {
      return colorSpec.value.split(',').map((c) => c.trim()).filter(Boolean);
    }
    return [];
  }, [product]);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          setReviews(data.reviews || []);
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedSize(data.product.variants[0].size || '');
            const firstColor = data.product.variants.find((v: any) => v.color)?.color || '';
            setSelectedColor(firstColor);
          } else {
            const colorSpec = data.product.specifications?.find((s: any) =>
              s.key?.toLowerCase().includes('color')
            );
            if (colorSpec && colorSpec.value) {
              const firstColor = colorSpec.value.split(',')[0]?.trim() || '';
              setSelectedColor(firstColor);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewComment.trim() || reviewComment.trim().length < 5) {
      error('Please enter a review of at least 5 characters');
      return;
    }

    setSubmittingReview(true);

    try {
      const res = await fetch(`/api/products/${slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewName.trim() || user?.name || 'Verified Rider',
          rating: ratingInput,
          comment: reviewComment.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        success('Your review was posted and rating updated!');
        setReviewComment('');
        setReviewName('');
        setRatingInput(5);
        if (product) {
          setProduct({
            ...product,
            ratings: data.ratings,
            numReviews: data.numReviews,
          });
        }
        if (data.review) {
          setReviews((prev) => [data.review, ...prev]);
        }
      } else {
        error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      error('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The cycle you are looking for may have been removed or is temporarily unavailable.
        </p>
        <Link
          href="/shop"
          className="bg-brand-600 text-white text-xs font-bold py-3 px-6 rounded-xl inline-block"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const discountPercent = calculateDiscountPercent(product.price, product.salePrice);
  const displayPrice =
    product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const images = product.images && product.images.length > 0 ? product.images : [];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (product?.images && product.images.length > 0) {
      const lower = color.toLowerCase();
      const matchIdx = product.images.findIndex((img) => {
        const lowerImg = img.toLowerCase();
        if (lower.includes('green') && lowerImg.includes('green')) return true;
        if (lower.includes('yellow') && (lowerImg.includes('yellow') || lowerImg.includes('black-yellow'))) return true;
        if (lower.includes('black') && (lowerImg.includes('black') || lowerImg.includes('black-yellow'))) return true;
        if (lower.includes('blue') && (lowerImg.includes('blue') || lowerImg.includes('main'))) return true;
        if (lower.includes('red') && lowerImg.includes('red')) return true;
        if (lower.includes('orange') && (lowerImg.includes('orange') || lowerImg.includes('yellow'))) return true;
        return false;
      });
      if (matchIdx !== -1) {
        setSelectedImage(matchIdx);
      }
    }
  };

  const handleBuyNow = () => {
    const chosenImage =
      (product.images && product.images[selectedImage]) || product.images?.[0] || '';
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
    // Navigate directly to checkout for ONLY this product without affecting cart
    router.push('/checkout?buyNow=1');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/shop" className="hover:text-slate-900">
            Shop
          </Link>
          {product.categoryName && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link
                href={`/shop?category=${product.categorySlug}`}
                className="hover:text-slate-900"
              >
                {product.categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-[4/3] w-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
              {images.length > 0 && (
                <Image
                  src={images[selectedImage] || images[0]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center"
                />
              )}
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-md">
                  -{discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail selection */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === idx
                        ? 'border-brand-600 ring-4 ring-brand-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Image src={img} alt="thumb" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Meta & Purchase Box */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Brand, SKU & Share */}
              <div className="flex items-center justify-between text-xs text-brand-600 font-bold uppercase tracking-wider mb-2">
                <span>{product.brand}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-normal">SKU: {product.sku || 'N/A'}</span>
                  <button
                    onClick={handleShare}
                    className="text-slate-500 hover:text-slate-900"
                    title="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-3">
                <RatingStars rating={product.ratings} size="md" showNumber />
                <span className="text-xs text-slate-400 font-medium">
                  • {product.numReviews || 18} Verified Rider Reviews
                </span>
              </div>

              {/* Price Row */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-4">
                <span className="text-3xl font-black text-slate-900">
                  {formatPrice(displayPrice)}
                </span>
                {product.salePrice && product.salePrice > 0 && (
                  <span className="text-lg text-slate-400 line-through font-semibold">
                    {formatPrice(product.price)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Tax & Delivery Highlight */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Free Doorstep Delivery
                </span>
                <span className="flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                  Inclusive of GST
                </span>
              </div>

              {/* Stock Status */}
              <div className="mt-4 flex items-center gap-2">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units left)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.shortDescription || product.description}
              </p>

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-900 uppercase">
                      Select Color:
                    </label>
                    {selectedColor && (
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableColors.map((color, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                          selectedColor === color
                            ? 'border-amber-500 bg-amber-50/80 text-amber-950 shadow-xs ring-2 ring-amber-300'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-amber-200 shrink-0" />
                        <span>{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Frame / Wheel Sizes */}
              {product.variants && product.variants.some((v) => v.size) && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-900 uppercase">
                      Select Size:
                    </label>
                    <span className="text-[11px] text-brand-600 font-semibold cursor-pointer">
                      Size Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants
                      .filter((v) => v.size)
                      .map((v, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSize(v.size || '')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            selectedSize === v.size
                              ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {v.size}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector & CTAs */}
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1.5">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white text-slate-700 font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) =>
                          product.stock ? Math.min(product.stock, q + 1) : q + 1
                        )
                      }
                      disabled={typeof product.stock === 'number' && quantity >= product.stock}
                      className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(product, quantity, selectedSize, selectedColor)}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                      isLiked
                        ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Instant Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 text-white text-sm font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  Instant Buy Now
                </button>
              </div>

              {/* Service Highlights */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <Truck className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Free Doorstep Delivery</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <Wrench className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>95% Pre-Assembled</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Lifetime Warranty</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                  <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>7-Day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Information Tabs */}
        <div className="mt-16 border-t border-slate-200 pt-10">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-sm font-bold pb-2 transition-colors border-b-2 -mb-4 ${
                activeTab === 'specs'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`text-sm font-bold pb-2 transition-colors border-b-2 -mb-4 ${
                activeTab === 'desc'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Full Description
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`text-sm font-bold pb-2 transition-colors border-b-2 -mb-4 ${
                activeTab === 'shipping'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Delivery & Assembly
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-bold pb-2 transition-colors border-b-2 -mb-4 flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Customer Reviews</span>
              <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full text-xs font-bold">
                ★ {product.ratings || '4.8'} ({product.numReviews || reviews.length})
              </span>
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'specs' && (
              <div className="max-w-4xl bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody>
                    {product.specifications && product.specifications.length > 0 ? (
                      product.specifications.map((spec, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}
                        >
                          <td className="p-3.5 sm:p-4 font-bold text-slate-800 w-1/3 border-b border-slate-100">
                            {spec.key}
                          </td>
                          <td className="p-3.5 sm:p-4 text-slate-600 border-b border-slate-100">
                            {spec.value}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-6 text-slate-500">Standard factory specifications apply.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'desc' && (
              <div className="max-w-3xl text-sm text-slate-700 leading-relaxed space-y-4">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">95% Pre-Assembled Delivery</h4>
                  <p>
                    Every cycle is thoroughly tuned and checked by our certified master technicians
                    before dispatch. It is packed with protective foam in a heavy-duty carton. You only
                    need to attach the front wheel, handlebar, pedals, and saddle using the complimentary
                    multi-tool kit provided.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Transit Protection & Tracking</h4>
                  <p>
                    Shipments are 100% insured against loss or transit damage. Once shipped, you will
                    receive instant SMS/Email updates with real-time GPS tracking.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Overall Rating Card & Form */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* Rating Summary Card */}
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 text-center">
                    <span className="text-4xl font-black text-slate-900 block mb-1">
                      {product.ratings || '4.8'}
                    </span>
                    <div className="flex justify-center mb-1">
                      <RatingStars rating={product.ratings || 4.8} size="lg" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Based on {product.numReviews || reviews.length || 1} verified customer ratings
                    </p>
                  </div>

                  {/* Write a Review Form */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-4 h-4 text-brand-600" />
                      <h3 className="font-bold text-sm text-slate-900">Write a Customer Review</h3>
                    </div>

                    <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3.5">
                      {/* Star Rating Picker */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Your Rating *
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingInput(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  (hoverRating || ratingInput) >= star
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-slate-600 ml-2">
                            {ratingInput} of 5 Stars
                          </span>
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder={user?.name || 'Enter your name'}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-600"
                        />
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Your Review & Riding Experience *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="How is the frame, gears, comfort, and ride quality?"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-brand-600 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-75 text-white text-xs font-bold py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        {submittingReview ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Submit Review & Rating</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right: Reviews List */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight">
                    Verified Rider Feedback ({reviews.length})
                  </h3>

                  {reviews.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-slate-50 border border-dashed border-slate-200 text-center flex flex-col items-center">
                      <Star className="w-8 h-8 text-amber-300 mb-2" />
                      <p className="text-xs font-bold text-slate-800">Be the first to review this cycle!</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Share your experience to help fellow cycling enthusiasts choose the right ride.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {reviews.map((rev) => (
                        <div
                          key={rev._id}
                          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-bold text-xs flex items-center justify-center">
                                {rev.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-xs text-slate-900">{rev.name}</h4>
                                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                                  ✓ Verified Rider
                                </span>
                              </div>
                            </div>
                            <RatingStars rating={rev.rating} size="sm" />
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed mt-1">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
