'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { IBanner } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

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

export default function HeroBanner({ banners }: IHeroBannerProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides: HeroSlide[] = [
    {
      id: '1',
      badge: t('hero.slide1_badge'),
      title: t('hero.slide1_title'),
      titleHighlight: t('hero.slide1_highlight'),
      subtitle: t('hero.slide1_subtitle'),
      image: '/images/hero/hero-outdoor-coastal.jpg?v=2',
      ctaText: t('hero.slide1_cta'),
      ctaLink: '/shop?category=road-bikes',
      secondaryText: t('hero.slide1_secondary'),
      secondaryLink: '/shop',
      priceTag: t('hero.slide1_price'),
    },
    {
      id: '2',
      badge: t('hero.slide2_badge'),
      title: t('hero.slide2_title'),
      titleHighlight: t('hero.slide2_highlight'),
      subtitle: t('hero.slide2_subtitle'),
      image: '/images/hero/hero-outdoor-mountain.jpg?v=2',
      ctaText: t('hero.slide2_cta'),
      ctaLink: '/shop?category=mountain-bikes',
      secondaryText: t('hero.slide2_secondary'),
      secondaryLink: '/shop?category=cycling-accessories',
      priceTag: t('hero.slide2_price'),
    },
    {
      id: '3',
      badge: t('hero.slide3_badge'),
      title: t('hero.slide3_title'),
      titleHighlight: t('hero.slide3_highlight'),
      subtitle: t('hero.slide3_subtitle'),
      image: '/images/hero/hero-outdoor-waterfront.jpg?v=2',
      ctaText: t('hero.slide3_cta'),
      ctaLink: '/shop?category=disc-brake-cycles',
      secondaryText: t('hero.slide3_secondary'),
      secondaryLink: '/shop?category=ladies-bicycles',
      priceTag: t('hero.slide3_price'),
    },
  ];

  // Synchronized auto-transition every 5.0 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentIndex];

  return (
    <section className="relative w-full bg-gradient-to-b from-white via-slate-50/70 to-white dark:from-black dark:via-zinc-950 dark:to-black overflow-hidden border-b border-slate-200/80 dark:border-zinc-800/80 select-none transition-colors duration-300">
      {/* Subtle Ambient Red Glow */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Synchronized Magical Upward Text (Slow, Soft, Silky Glide) */}
          <div className="lg:col-span-6 flex flex-col items-start gap-5 z-10">
            
            {/* Pill Badge */}
            <div
              key={`badge-${current.id}`}
              className="inline-flex items-center gap-2 bg-brand-50 dark:bg-zinc-900 border border-brand-200/80 dark:border-zinc-800 text-brand-700 dark:text-brand-400 px-4 py-1.5 rounded-full text-xs font-black shadow-xs animate-magical-up"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 animate-pulse" />
              <span>{current.badge}</span>
            </div>

            {/* Headline */}
            <div
              key={`title-${current.id}`}
              className="space-y-1 animate-magical-up-delay-1"
            >
              <h2 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">
                {current.title}
              </h2>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-red-600 dark:from-brand-500 dark:to-red-400">
                  {current.titleHighlight}
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              key={`sub-${current.id}`}
              className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg animate-magical-up-delay-2"
            >
              {current.subtitle}
            </p>

            {/* Starting Price Tag */}
            {current.priceTag && (
              <div
                key={`price-${current.id}`}
                className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs animate-magical-up-delay-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">Starting from</span>
                <span className="text-brand-600 dark:text-brand-400 font-black text-sm">{current.priceTag}</span>
              </div>
            )}

            {/* Action Buttons: Dual-Tone Racing Red Primary + Jet Black Secondary */}
            <div
              key={`cta-${current.id}`}
              className="flex flex-wrap items-center gap-3 pt-2 animate-magical-up-delay-3"
            >
              <Link
                href={current.ctaLink}
                className="bg-brand-600 hover:bg-brand-700 text-white font-black text-sm sm:text-base py-3.5 px-7 rounded-2xl flex items-center gap-2.5 shadow-lg shadow-brand-600/30 transition-all hover:scale-105 active:scale-95 btn-glow"
              >
                <span>{current.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {current.secondaryLink.startsWith('http') ? (
                <a
                  href={current.secondaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-zinc-900 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-100 font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl transition-all shadow-md hover:scale-102 active:scale-95 border border-black/10 dark:border-white/10"
                >
                  {current.secondaryText}
                </a>
              ) : (
                <Link
                  href={current.secondaryLink}
                  className="bg-black hover:bg-zinc-900 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-100 font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl transition-all shadow-md hover:scale-102 active:scale-95 border border-black/10 dark:border-white/10"
                >
                  {current.secondaryText}
                </Link>
              )}
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-zinc-800 w-full max-w-lg">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t('hero.trust_assembled')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t('hero.trust_genuine')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t('hero.trust_showroom')}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Dedicated Bicycle Showcase Card (Slow, Magical 1200ms Dissolve) */}
          <div className="lg:col-span-6 relative group">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[5/4] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              
              {/* Synchronized Cross-Fading Images with Gentle Dissolve & Scale */}
              {slides.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
                      isActive
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-106 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.titleHighlight}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-[1800ms] ease-out"
                    />

                    {/* Clean Gradient Rim for Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Quality Tag */}
                    <div className="absolute bottom-4 left-4 z-20 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-white flex items-center gap-2 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="text-white font-extrabold">{slide.title}</span>
                    </div>
                  </div>
                );
              })}



              {/* Minimal Clean Left/Right Arrow Navigation */}
              <button
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-brand-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-brand-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Sleek Minimal Slide Indicators */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-md">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === currentIndex ? 'w-6 bg-brand-500' : 'w-2 bg-white/40 hover:bg-white/70'
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
