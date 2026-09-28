'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { IBanner } from '@/types';
import { STORE_CONTACT } from '@/lib/constants';

interface IHeroBannerProps {
  banners?: IBanner[];
}

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
  priceTag?: string;
}

const CLEAN_SLIDES: HeroSlide[] = [
  {
    id: '1',
    badge: '✨ 2026 Pro Series',
    title: 'Ride with Passion.',
    titleHighlight: 'Engineered for Pure Speed.',
    subtitle:
      'Ultra-light carbon frames, Shimano 105 gearing, and aerodynamic precision for riders who demand excellence.',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=85',
    ctaText: 'Explore Bikes',
    ctaLink: '/shop?category=road-bikes',
    secondaryText: 'Shop All Cycles',
    secondaryLink: '/shop',
    priceTag: 'Starting from ₹19,999',
  },
  {
    id: '2',
    badge: '🏔️ Trail Dominance',
    title: 'Conquer the Rough.',
    titleHighlight: 'Built for Untamed Adventures.',
    subtitle:
      'Heavy-duty RockShox suspension, hydraulic disc brakes, and rugged geometry ready for every mountain trail.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=85',
    ctaText: 'Shop Mountain Bikes',
    ctaLink: '/shop?category=mountain-bikes',
    secondaryText: 'Explore Gear',
    secondaryLink: '/shop?category=cycling-accessories',
    priceTag: 'Trail MTBs from ₹24,999',
  },
  {
    id: '3',
    badge: '🚲 Premium Range',
    title: 'Ladies & Disc Brake Cycles.',
    titleHighlight: 'Maximum Comfort & Stopping Power.',
    subtitle:
      'High-performance mechanical & hydraulic disc brakes, ergonomic step-through frames, and effortless daily riding.',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1200&q=85',
    ctaText: 'Shop Disc Brake Cycles',
    ctaLink: '/shop?category=disc-brake-cycles',
    secondaryText: 'View Ladies Cycles',
    secondaryLink: '/shop?category=ladies-bicycles',
    priceTag: 'Bicycles from ₹7,999',
  },
  {
    id: '4',
    badge: '🔧 Kazipet Flagship',
    title: 'Sri Rama Cycle & Spares.',
    titleHighlight: '100% Genuine Auto Parts.',
    subtitle:
      'Official store in Hanumakonda for premium bicycles, original auto spare parts, expert repair, and tuning.',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=1200&q=85',
    ctaText: 'Contact Store',
    ctaLink: '/contact',
    secondaryText: 'WhatsApp Enquiry',
    secondaryLink: STORE_CONTACT.whatsappLink,
    priceTag: 'Kazipet Hub, Hanumakonda',
  },
];

export default function HeroBanner({ banners }: IHeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 5.5s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CLEAN_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = CLEAN_SLIDES[currentIndex];

  return (
    <section
      className="relative bg-gradient-to-b from-white via-brand-50/40 to-white overflow-hidden border-b border-slate-200/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 flex flex-col items-start gap-5 z-10">
            
            {/* Clean Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-accent-50 border border-accent-200/80 text-accent-700 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-accent-600" />
              <span>{current.badge}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                {current.title}
              </h2>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.15]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600">
                  {current.titleHighlight}
                </span>
              </h1>
            </div>

            {/* Clean Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
              {current.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={current.ctaLink}
                className="bg-accent-600 hover:bg-accent-700 text-white font-bold text-sm sm:text-base py-3.5 px-7 rounded-2xl flex items-center gap-2.5 shadow-md shadow-accent-600/25 transition-all hover:scale-102 active:scale-98"
              >
                <span>{current.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {current.secondaryLink.startsWith('http') ? (
                <a
                  href={current.secondaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl transition-all shadow-xs"
                >
                  {current.secondaryText}
                </a>
              ) : (
                <Link
                  href={current.secondaryLink}
                  className="bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl transition-all shadow-xs"
                >
                  {current.secondaryText}
                </Link>
              )}
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-200/80 w-full">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span className="font-semibold text-slate-700">95% Pre-Assembled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span className="font-semibold text-slate-700">100% Genuine Parts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span className="font-semibold text-slate-700">Kazipet Showroom</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-white">
              <Image
                src={current.image}
                alt={current.titleHighlight}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-all duration-700 hover:scale-105"
              />

              {/* Subtle Gradient Rim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Price Pill */}
              {current.priceTag && (
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-slate-200 text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-600 animate-pulse" />
                  <span className="text-accent-700 font-extrabold">{current.priceTag}</span>
                </div>
              )}
            </div>

            {/* Minimal Slide Selector Dots & Navigation */}
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-2">
                {CLEAN_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === i
                        ? 'w-7 bg-brand-600'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (prev) => (prev - 1 + CLEAN_SLIDES.length) % CLEAN_SLIDES.length
                    )
                  }
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-brand-500 text-slate-600 hover:text-brand-600 flex items-center justify-center shadow-xs transition-colors"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % CLEAN_SLIDES.length)
                  }
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-brand-500 text-slate-600 hover:text-brand-600 flex items-center justify-center shadow-xs transition-colors"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
