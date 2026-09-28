'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Tag, Sparkles } from 'lucide-react';

interface ICoupon {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export default function PromoBanner() {
  const [activeCoupon, setActiveCoupon] = useState<ICoupon | null>(null);

  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        const res = await fetch('/api/coupons/active');
        const data = await res.json();
        if (data.success && data.coupons && data.coupons.length > 0) {
          setActiveCoupon(data.coupons[0]);
        }
      } catch (err) {
        // Fallback silently
      }
    };
    fetchActiveCoupons();
  }, []);

  const couponCode = activeCoupon ? activeCoupon.code : 'SRIRAMA15';
  const discountText = activeCoupon
    ? activeCoupon.discountType === 'percentage'
      ? `${activeCoupon.discountValue}% OFF`
      : `₹${activeCoupon.discountValue} OFF`
    : '25% OFF';

  return (
    <section className="py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white shadow-xl border border-slate-800">
          {/* Subtle Background Glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none hidden md:block">
            <Image
              src="/images/categories/road-bikes.jpg"
              alt="Promo Cycles"
              fill
              className="object-cover object-right"
            />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-14 max-w-xl flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 bg-accent-600/20 border border-accent-500/30 text-accent-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Tag className="w-3.5 h-3.5 text-accent-400" />
              <span>Special Store Offer</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Get Up To <span className="text-brand-400">{discountText}</span> on Selected Cycles
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeCoupon?.description || 'Upgrade your ride today. Use promo code'}
              {' '}
              <span className="font-mono font-bold text-white bg-white/15 px-2 py-0.5 rounded border border-white/20">
                {couponCode}
              </span>{' '}
              at checkout for instant savings.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/shop"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm py-3.5 px-7 rounded-2xl flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Shop Now & Apply Code</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
