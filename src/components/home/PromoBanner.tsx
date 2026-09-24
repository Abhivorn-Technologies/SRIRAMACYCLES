import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Tag, Sparkles } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white shadow-xl border border-slate-800">
          
          {/* Subtle Background Glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80"
              alt="Promo Cycles"
              fill
              className="object-cover object-right"
            />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-14 max-w-xl flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Tag className="w-3.5 h-3.5 text-rose-400" />
              <span>Special Seasonal Offer</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Get Up To <span className="text-brand-400">25% Off</span> on Selected Cycles
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upgrade your ride today. Use promo code{' '}
              <span className="font-mono font-bold text-white bg-white/15 px-2 py-0.5 rounded border border-white/20">
                SRIRAMA15
              </span>{' '}
              at checkout for instant discounts and free doorstep delivery.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/shop"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm py-3.5 px-7 rounded-2xl flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Shop Sale Items</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
