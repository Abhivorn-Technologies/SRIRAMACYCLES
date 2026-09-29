'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
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
    image: '/images/categories/mountain-bikes.jpg',
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
  const [isFading, setIsFading] = useState(false);

  // Dynamic image transition every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % CLEAN_SLIDES.length);
        setIsFading(false);
      }, 300);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? CLEAN_SLIDES.length - 1 : prev - 1));
      setIsFading(false);
    }, 200);
  };

  const handleNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % CLEAN_SLIDES.length);
      setIsFading(false);
    }, 200);
  };

  const current = CLEAN_SLIDES[currentIndex];

  return (
    <section className="relative bg-gradient-to-b from-white via-brand-50/20 to-white overflow-hidden border-b border-slate-200/60 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column with Smooth Fade & Slide */}
          <div className="lg:col-span-6 flex flex-col items-start gap-5 z-10">
            
            {/* Pill Badge */}
            <div
              className={`inline-flex items-center gap-2 bg-accent-50 border border-accent-200/80 text-accent-700 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-2xs transition-all duration-500 ${
                isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-600 animate-pulse" />
              <span>{current.badge}</span>
            </div>

            {/* Headline */}
            <div
              className={`space-y-1 transition-all duration-500 ${
                isFading ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                {current.title}
              </h2>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.15]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600">
                  {current.titleHighlight}
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className={`text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg transition-all duration-500 ${
                isFading ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
              }`}
            >
              {current.subtitle}
            </p>

            {/* Action Buttons */}
            <div
              className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-500 ${
                isFading ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
              }`}
            >
              <Link
                href={current.ctaLink}
                className="bg-accent-600 hover:bg-accent-700 text-white font-extrabold text-sm sm:text-base py-3.5 px-7 rounded-2xl flex items-center gap-2.5 shadow-lg shadow-accent-600/25 transition-all hover:scale-105 active:scale-95 btn-glow"
              >
                <span>{current.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {current.secondaryLink.startsWith('http') ? (
                <a
                  href={current.secondaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200/80 font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl transition-all shadow-2xs hover:scale-102 active:scale-95"
                >
                  {current.secondaryText}
                </a>
              ) : (
                <Link
                  href={current.secondaryLink}
                  className="bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200/80 font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl transition-all shadow-2xs hover:scale-102 active:scale-95"
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

          {/* Right Image Showcase: Ultra-Clean 3-Second Cross-Fade Animation */}
          <div className="lg:col-span-6 relative group">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-950">
              
              {/* All Image Layers for Smooth 3-Second Cross-Fade */}
              {CLEAN_SLIDES.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      isActive
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.titleHighlight}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />

                    {/* Gradient Rim Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Price Badge */}
                    {slide.priceTag && (
                      <div className="absolute bottom-5 left-5 z-20 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/15 text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="text-amber-300 font-extrabold">{slide.priceTag}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Minimal Clean Left/Right Arrow Navigation (Visible on Hover) */}
              <button
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Sleek Minimal Slide Indicators (Top Right Lines) */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-slate-950/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {CLEAN_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsFading(true);
                      setTimeout(() => {
                        setCurrentIndex(idx);
                        setIsFading(false);
                      }, 200);
                    }}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
