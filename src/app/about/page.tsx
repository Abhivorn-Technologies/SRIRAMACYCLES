'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  HeartHandshake,
  Wrench,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Clock,
  Receipt,
  ZoomIn,
  Quote,
  X,
  CheckCircle2,
} from 'lucide-react';
import { STORE_CONTACT, ESTABLISHED_YEAR } from '@/lib/constants';
import ScrollReveal from '@/components/common/ScrollReveal';
import { useLanguage } from '@/context/LanguageContext';

const SHOWCASE_SLIDES = [
  {
    src: '/images/about/workshop.jpg',
    title: 'Sri Rama Master Workshop',
    location: 'Kazipet Showroom & Service Center',
    badge: '★ 4.9 Verified Store',
  },
  {
    src: '/images/about/showroom.jpg',
    title: 'Modern Bicycle Showroom',
    location: '50+ Carbon, MTB & Hybrid Models',
    badge: 'Flagship Store',
  },
  {
    src: '/images/about/spares.jpg',
    title: 'Genuine Spares Division',
    location: 'Authentic Shimano & Auto Parts',
    badge: '100% Factory Sourced',
  },
];

export default function AboutPage() {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedBillModal, setSelectedBillModal] = useState<'old' | 'new' | 'compare' | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? SHOWCASE_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
  };

  const milestones = [
    {
      year: '1976',
      title: t('about.m1976_title'),
      description: t('about.m1976_desc'),
    },
    {
      year: '1980',
      title: t('about.m1980_title'),
      description: t('about.m1980_desc'),
    },
    {
      year: '2015',
      title: t('about.m2015_title'),
      description: t('about.m2015_desc'),
    },
    {
      year: '2026',
      title: t('about.m2026_title'),
      description: t('about.m2026_desc'),
    },
  ];

  const coreValues = [
    {
      icon: ShieldCheck,
      title: t('about.v1_title'),
      description: t('about.v1_desc'),
      color: 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-900 group-hover:bg-brand-600 group-hover:text-white',
    },
    {
      icon: Wrench,
      title: t('about.v2_title'),
      description: t('about.v2_desc'),
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 group-hover:bg-emerald-600 group-hover:text-white',
    },
    {
      icon: HeartHandshake,
      title: t('about.v3_title'),
      description: t('about.v3_desc'),
      color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900 group-hover:bg-amber-600 group-hover:text-white',
    },
  ];

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-10 sm:py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-900/50 text-brand-700 dark:text-brand-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{t('about.serving_since')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              Sri Rama Cycle & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600 dark:from-brand-500 dark:to-red-400">Auto Spare Parts</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              {t('about.proprietor_label')} <strong className="text-slate-900 dark:text-white font-extrabold">{STORE_CONTACT.proprietor}</strong> — {t('about.hero_subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Store Showcase & Interactive Contact Card */}
        <ScrollReveal direction="up" delayMs={100}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
            
            {/* Left Side: Minimalist Luxury Image Carousel */}
            <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[440px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 bg-slate-950 group select-none flex flex-col justify-between">
              {SHOWCASE_SLIDES.map((slide, idx) => {
                const isActive = idx === activeSlide;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.title}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent pointer-events-none" />

                    {/* Clean Bottom Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                      <div className="bg-slate-950/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-lg max-w-sm">
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">{slide.title}</h3>
                        <p className="text-xs text-slate-300 mt-0.5">{slide.location}</p>
                      </div>

                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-md">
                        {slide.badge}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/90 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/90 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Minimalist Line Slide Indicators */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-950/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {SHOWCASE_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === activeSlide ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side: High-End Content & Interactive Contact */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 text-xs font-semibold px-3 py-1 rounded-full border border-brand-200/60 dark:border-brand-900/50">
                  <Award className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>{t('about.50_years')}</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  {t('about.trusted_quality_title')}
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('about.trusted_quality_p1')}
                </p>
                
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('about.trusted_quality_p2')}
                </p>
              </div>

              {/* Interactive Contact Buttons */}
              <div className="space-y-3 pt-2">
                {/* Clickable Address -> Google Maps */}
                <a
                  href={STORE_CONTACT.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-brand-300 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">{t('about.store_location')}</h4>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-brand-600 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug truncate">
                      {STORE_CONTACT.shortAddress}
                    </p>
                  </div>
                </a>

                {/* Clickable Phone Number */}
                <a
                  href={`tel:${STORE_CONTACT.rawPhone}`}
                  className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-300 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{t('about.direct_phone')}</h4>
                    <p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 tracking-wide mt-0.5">
                      {STORE_CONTACT.phone}
                    </p>
                  </div>
                </a>

                {/* Store Operating Hours */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium px-1 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{STORE_CONTACT.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Key Statistics Bar */}
        <ScrollReveal direction="up" delayMs={100}>
          <div className="bg-slate-950 rounded-3xl p-8 sm:p-12 text-white grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="text-center relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-brand-400">10,000+</span>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">{t('about.stats_cyclists')}</p>
            </div>
            <div className="text-center relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">100%</span>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">{t('about.stats_spares')}</p>
            </div>
            <div className="text-center relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-amber-400">1 Year</span>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">{t('about.stats_warranty')}</p>
            </div>
            <div className="text-center relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-purple-400">1976</span>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">{t('about.stats_year')}</p>
            </div>
          </div>
        </ScrollReveal>

        {/* The Generational Trust Story: 1980 vs 2026 Customer Proof */}
        <ScrollReveal direction="up" delayMs={100}>
          <div className="mb-20 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/80 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-amber-200/90 dark:border-amber-900/50 shadow-2xl relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Ambient warm gold glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Authentic Story Narrative */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs">
                  <Award className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>{t('about.generational_trust_badge')}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {t('about.generational_heading_1')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-amber-600 to-brand-700 dark:from-brand-500 dark:via-amber-400 dark:to-brand-400">
                    {t('about.generational_heading_2')}
                  </span>
                </h2>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  <p>{t('about.story_p1')}</p>
                  <p>{t('about.story_p2')}</p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{t('about.story_p3')}</p>
                </div>

                {/* Customer Voice / Legacy Philosophy Box */}
                <div className="relative bg-white/95 dark:bg-slate-900 border-l-4 border-l-amber-500 border-y border-r border-amber-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <Quote className="w-8 h-8 text-amber-300/40 dark:text-amber-600/30 absolute top-3.5 right-3.5" />
                  <p className="text-xs sm:text-sm italic text-slate-800 dark:text-slate-100 font-medium leading-relaxed relative z-10">
                    &ldquo;{t('about.quote_text')}&rdquo;
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs border-t border-amber-100 dark:border-slate-800 pt-2.5">
                    <span className="font-extrabold text-slate-900 dark:text-white tracking-wide">{t('about.quote_author')}</span>
                    <span className="text-amber-800 dark:text-amber-400 font-bold text-[11px] bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/50">
                      {t('about.quote_badge')}
                    </span>
                  </div>
                </div>

                {/* 3 Core Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-xl p-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('about.pillar1')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-xl p-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('about.pillar2')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-xl p-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('about.pillar3')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Side-by-Side Bills Interactive Showcase */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2.5 py-1 rounded-md">
                    {t('about.archival_badge')}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                    {t('about.archival_desc')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: 1980s Vintage Scheme Bill */}
                  <div
                    onClick={() => setSelectedBillModal('old')}
                    className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-amber-300/80 dark:border-amber-800/80 bg-white dark:bg-slate-900 p-3 transition-all duration-300 hover:border-amber-500 hover:scale-[1.02] hover:shadow-xl shadow-md"
                  >
                    <div className="flex items-center justify-between pb-2 px-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-md">
                        1980 Archival Record
                      </span>
                      <ZoomIn className="w-4 h-4 text-amber-600 dark:text-amber-400 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-amber-50/50 dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 shadow-inner">
                      <Image
                        src="/images/about/historic-1980-bill.png"
                        alt="1980s Sri Rama Cycle Scheme Card for A. P. Venkateshwarlu"
                        fill
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="pt-2 px-1">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">{t('about.bill_1980_title')}</p>
                      <p className="text-[11px] text-amber-800 dark:text-amber-400 font-bold">{t('about.bill_1980_sub')}</p>
                    </div>
                  </div>

                  {/* Card 2: 2026 Modern Tax Bill */}
                  <div
                    onClick={() => setSelectedBillModal('new')}
                    className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-emerald-300/80 dark:border-emerald-800/80 bg-white dark:bg-slate-900 p-3 transition-all duration-300 hover:border-emerald-500 hover:scale-[1.02] hover:shadow-xl shadow-md"
                  >
                    <div className="flex items-center justify-between pb-2 px-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                        2026 Generational Return
                      </span>
                      <ZoomIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-emerald-50/50 dark:bg-slate-900 border border-emerald-200/70 dark:border-slate-800 shadow-inner">
                      <Image
                        src="/images/about/current-2026-bill.png"
                        alt="2026 Sri Rama Cycle Store Bill for A. P. Venkateshwarlu"
                        fill
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="pt-2 px-1">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">{t('about.bill_2026_title')}</p>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold">{t('about.bill_2026_sub')}</p>
                    </div>
                  </div>
                </div>

                {/* Compare Button */}
                <button
                  onClick={() => setSelectedBillModal('compare')}
                  className="w-full bg-gradient-to-r from-amber-500 via-brand-600 to-amber-600 hover:from-amber-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-white" />
                  <span>{t('about.inspect_bills_btn')}</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Milestone Timeline */}
        <div className="mb-20">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">{t('about.timeline_badge')}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {t('about.timeline_title')}
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((item, idx) => (
              <ScrollReveal key={idx} direction="up" delayMs={idx * 100}>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-brand-300 dark:hover:border-brand-500 card-hover-lift flex flex-col gap-3 relative h-full">
                  <span className="text-xs font-black text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 px-3 py-1 rounded-full w-fit">
                    {item.year}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Core Pillars */}
        <div className="mb-20">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">{t('about.values_badge')}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {t('about.values_title')}
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <ScrollReveal key={idx} direction="up" delayMs={idx * 120}>
                  <div className="group bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs card-hover-lift flex flex-col gap-4 h-full transition-all duration-300">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs transition-all duration-300 group-hover:scale-110 ${val.color}`}>
                      <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">{val.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">{val.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Call to Action Card */}
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-700/50">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {t('about.cta_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                {t('about.cta_desc')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/shop"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 btn-glow"
              >
                <span>{t('about.cta_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={STORE_CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('about.cta_contact')}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* High-Resolution Dual Vintage & Modern Bill Modal */}
      {selectedBillModal && (
        <div
          onClick={() => setSelectedBillModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border-2 border-amber-200/90 dark:border-slate-800 flex flex-col gap-4 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto text-slate-900 dark:text-slate-100"
          >
            {/* Header with Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                  Archival Proof of Generational Loyalty: 1980 to 2026
                </h3>
                <span className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold">
                  A tangible 46-year record demonstrating why generations of families return to Sri Rama Cycles
                </span>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                <button
                  onClick={() => setSelectedBillModal('compare')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedBillModal === 'compare' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => setSelectedBillModal('old')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedBillModal === 'old' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  1980 Receipt
                </button>
                <button
                  onClick={() => setSelectedBillModal('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedBillModal === 'new' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  2026 Bill
                </button>
                <button
                  onClick={() => setSelectedBillModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-200/60 transition-colors ml-1"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {selectedBillModal === 'compare' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1980 Bill Preview */}
                <div className="flex flex-col gap-2 bg-amber-50/40 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-amber-200/80 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded">
                      1980 Archival Record (Card #58)
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">Date: 9/7/80</span>
                  </div>
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 shadow-inner">
                    <Image
                      src="/images/about/historic-1980-bill.png"
                      alt="1980s Sri Rama Cycle Scheme Card"
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 pt-1">
                    <strong className="text-slate-900 dark:text-white block font-black">Original 1980 Purchase • Station Road Store</strong>
                    <span className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold">Customer: A. P. Venkateshwarlu • Cycle Value: ₹425/-</span>
                  </div>
                </div>

                {/* 2026 Bill Preview */}
                <div className="flex flex-col gap-2 bg-emerald-50/40 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded">
                      2026 Generational Purchase (Bill #666)
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">Date: 07/05/2026</span>
                  </div>
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-emerald-200/60 dark:border-slate-800 shadow-inner">
                    <Image
                      src="/images/about/current-2026-bill.png"
                      alt="2026 Sri Rama Cycle Store Bill"
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 pt-1">
                    <strong className="text-slate-900 dark:text-white block font-black">Returned 46 Years Later • Traveled from Hyd</strong>
                    <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold">Speed-IBC 20&quot; C. Green • Total: ₹3,200/-</span>
                  </div>
                </div>
              </div>
            ) : selectedBillModal === 'old' ? (
              <div className="flex flex-col gap-3">
                <div className="relative aspect-[3/4] max-h-[65vh] w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Image
                    src="/images/about/historic-1980-bill.png"
                    alt="1980s Sri Rama Cycle Scheme Card"
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-contain"
                  />
                </div>
                <div className="bg-amber-50/60 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-amber-200/80 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <strong className="text-amber-900 dark:text-amber-400 block font-black">1980 Scheme Card #58 • Station Road, Kazipet</strong>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">Member: A. P. Venkateshwarlu • Fitted Cycle Value: ₹425.00</span>
                  </div>
                  <button
                    onClick={() => setSelectedBillModal('new')}
                    className="text-brand-600 dark:text-brand-400 hover:text-brand-700 font-bold text-xs underline underline-offset-4 self-start sm:self-auto cursor-pointer"
                  >
                    View Modern 2026 Bill →
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative aspect-[3/4] max-h-[65vh] w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Image
                    src="/images/about/current-2026-bill.png"
                    alt="2026 Sri Rama Cycle Store Bill"
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-contain"
                  />
                </div>
                <div className="bg-emerald-50/60 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <strong className="text-emerald-900 dark:text-emerald-400 block font-black">2026 Store Invoice #666 • Sri Rama Cycle & Auto Spare Parts</strong>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">Customer: A. P. Venkateshwarlu (C/o Hyd) • Speed-IBC 20&quot; C. Green • ₹3,200.00</span>
                  </div>
                  <button
                    onClick={() => setSelectedBillModal('old')}
                    className="text-brand-600 dark:text-brand-400 hover:text-brand-700 font-bold text-xs underline underline-offset-4 self-start sm:self-auto cursor-pointer"
                  >
                    ← View 1980 Historic Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
