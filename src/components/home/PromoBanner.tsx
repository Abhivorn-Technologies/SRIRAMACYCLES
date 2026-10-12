'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Tag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ICoupon {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export default function PromoBanner() {
  const { t } = useLanguage();
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
    <section className="py-12 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200">
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
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Tag className="w-3.5 h-3.5 text-brand-400" />
              <span>{t('promo.special_offer')}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {t('promo.get_discount')}{' '}
              <span className="text-brand-400">{discountText}</span>{' '}
              {t('promo.selected_cycles')}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeCoupon?.description || t('promo.default_desc')}{' '}
              <span className="font-mono font-bold text-white bg-white/15 px-2 py-0.5 rounded border border-white/20">
                {couponCode}
              </span>{' '}
              {t('promo.checkout_instant')}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/shop"
                className="bg-brand-600 hover:bg-brand-700 text-white font-black text-sm py-3.5 px-7 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-brand-600/30 hover:scale-105 active:scale-95 btn-glow"
              >
                <span>{t('promo.shop_code_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
