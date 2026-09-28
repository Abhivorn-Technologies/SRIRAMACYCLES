'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';

export default function CartPage() {
  const {
    cart,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    appliedCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [activeOffers, setActiveOffers] = useState<Array<{ code: string; discountType: string; discountValue: number }>>([]);

  React.useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch('/api/coupons/active');
        const data = await res.json();
        if (data.success && data.coupons) {
          setActiveOffers(data.coupons);
        }
      } catch (err) {}
    };
    fetchOffers();
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const ok = await applyCoupon(couponInput.trim());
      if (ok) {
        setCouponInput('');
      }
    }
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountRemainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-white">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 mb-8">
          Explore our premium range of road bikes, mountain machines, hybrid cycles, and accessories to start your adventure.
        </p>
        <Link
          href="/shop"
          className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm py-3.5 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-brand-600/20 transition-all active:scale-95"
        >
          <span>Explore Srirama Shop</span>
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
              Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your items and proceed to secure checkout
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Free Shipping Progress Alert */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 mb-8 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-brand-600" />
              {amountRemainingForFreeShipping === 0 ? (
                <span className="text-emerald-600 font-bold">
                  🎉 Congratulations! You unlocked Free Delivery!
                </span>
              ) : (
                <span>
                  Add {formatPrice(amountRemainingForFreeShipping)} more to qualify for{' '}
                  <strong className="text-brand-600">FREE Delivery</strong>
                </span>
              )}
            </span>
            <span>{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cart.map((item, idx) => {
              const unitPrice =
                item.product.salePrice && item.product.salePrice > 0
                  ? item.product.salePrice
                  : item.product.price;
              const itemTotal = unitPrice * item.quantity;
              const image =
                item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';

              return (
                <div
                  key={`${item.product._id}-${item.selectedSize}-${idx}`}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  {/* Thumbnail & Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                      <Image
                        src={image}
                        alt={item.product.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-brand-600 uppercase">
                        {item.product.brand}
                      </span>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      {item.selectedSize && (
                        <span className="text-xs text-slate-500 mt-0.5">
                          Size: <strong>{item.selectedSize}</strong>
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-900 sm:hidden mt-1">
                        {formatPrice(unitPrice)} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            item.quantity - 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-sm font-black text-slate-900">
                        {formatPrice(itemTotal)}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-slate-400">
                          {formatPrice(unitPrice)} x {item.quantity}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.product._id, item.selectedSize, item.selectedColor)
                      }
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping Link */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1.5"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Order Summary
              </h2>

              {/* Coupon Code Section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Have a Coupon / Promo Code?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      {appliedCoupon} applied (-{formatPrice(discount)})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Available Offers Created from Admin */}
                    {activeOffers.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Available Offers:</span>
                        {activeOffers.map((offer) => (
                          <button
                            key={offer.code}
                            type="button"
                            onClick={() => applyCoupon(offer.code)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold bg-brand-50 border border-brand-200/80 text-brand-700 hover:bg-brand-100 hover:border-brand-300 px-2 py-0.5 rounded-lg transition-colors"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-brand-600" />
                            <span>{offer.code}</span>
                            <span className="text-slate-500 font-normal">
                              ({offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`})
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                  <span>Grand Total</span>
                  <span className="text-brand-600">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 transition-all active:scale-95 text-center"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Security Guarantee Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Safe & Encrypted 256-bit SSL Checkout with doorstep warranty card.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
