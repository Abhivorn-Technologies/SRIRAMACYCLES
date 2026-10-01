'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bike,
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
  History,
} from 'lucide-react';
import { STORE_CONTACT, ESTABLISHED_YEAR } from '@/lib/constants';
import ScrollReveal from '@/components/common/ScrollReveal';

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

  const MILESTONES = [
    {
      year: '1976',
      title: 'Store Inception in Kazipet',
      description:
        'Established by the Ravula family in Kazipet, Hanumakonda, bringing reliable bicycles & genuine spare parts to local commuters.',
    },
    {
      year: '1980',
      title: 'Era of Unbroken Generational Trust',
      description:
        'Equipping local families with lifelong fitted cycles through the historic Sri Rama Scheme—proven by loyal customers who preserve their original 1980 bills to this day.',
    },
    {
      year: '2015',
      title: 'Performance & Multi-Speed Cycles',
      description:
        'Introduced precision road racers, hydraulic mountain cycles, and multi-speed geared bicycles.',
    },
    {
      year: '2026',
      title: 'Digital E-Commerce & Doorstep Delivery',
      description:
        'Launched direct online booking and doorstep delivery with 95% pre-assembly and 1-Year Frame Warranty.',
    },
  ];

  const CORE_VALUES = [
    {
      icon: ShieldCheck,
      title: '100% Factory Authentic',
      description:
        'Direct sourcing from certified makers including Shimano, SRAM, RockShox, Tektro, and Kenda with zero counterfeit parts.',
      color: 'bg-brand-50 text-brand-700 border-brand-200 group-hover:bg-brand-600 group-hover:text-white',
    },
    {
      icon: Wrench,
      title: 'Master Technician Tuning',
      description:
        'On-site certified mechanics for precision derailleur tuning, hydraulic line bleeding, wheel truing, and custom cycle builds.',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
    },
    {
      icon: HeartHandshake,
      title: 'Personalized Consultation',
      description:
        'Led by Ravula Rakesh Kumar, we provide transparent sizing recommendations and honest advice tailored to your budget.',
      color: 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Serving Hanumakonda & Telangana Since {ESTABLISHED_YEAR}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
              Sri Rama Cycle & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">Auto Spare Parts</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
              Proprietor: <strong className="text-slate-900 font-extrabold">{STORE_CONTACT.proprietor}</strong> — Kazipet&apos;s premier landmark store for high-performance bicycles, mountain MTBs, classic roadsters, and genuine auto spare parts.
            </p>
          </div>
        </ScrollReveal>

        {/* Store Showcase & Interactive Contact Card */}
        <ScrollReveal direction="up" delayMs={100}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
            
            {/* Left Side: Minimalist Luxury Image Carousel */}
            <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[440px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-950 group select-none flex flex-col justify-between">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/90 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/90 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
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
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full border border-brand-200/60">
                  <Award className="w-3.5 h-3.5 text-brand-600" />
                  <span>50 Years of Excellence</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  Trusted Quality & Genuine Spares
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Located in Kazipet, Sri Rama Cycle & Auto Spare Parts has been the backbone of reliable transportation in Hanumakonda for nearly five decades.
                </p>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We offer a curated lineup of premium carbon road racers, durable mountain MTBs, ladies cycles, and factory-authentic auto spare parts.
                </p>
              </div>

              {/* Sleek Interactive Clickable Contact Buttons */}
              <div className="space-y-3 pt-2">
                
                {/* Clickable Address -> Google Maps */}
                <a
                  href={STORE_CONTACT.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 hover:border-brand-300 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors">Store Location</h4>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-brand-600 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug truncate">
                      {STORE_CONTACT.shortAddress}
                    </p>
                  </div>
                </a>

                {/* Clickable Phone Number */}
                <a
                  href={`tel:${STORE_CONTACT.rawPhone}`}
                  className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Direct Store Phone</h4>
                    <p className="text-xs font-extrabold text-emerald-800 tracking-wide mt-0.5">
                      {STORE_CONTACT.phone}
                    </p>
                  </div>
                </a>

                {/* Store Operating Hours */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium px-1 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{STORE_CONTACT.hours}</span>
                </div>

              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Key Statistics Bar */}
        <ScrollReveal direction="up" delayMs={100}>
          <div className="bg-slate-950 rounded-3xl p-8 sm:p-12 text-white grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 shadow-xl relative overflow-hidden">
            <div className="text-center relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-brand-400">10,000+</span>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">Satisfied Cyclists</p>
            </div>
            <div className="text-center relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">100%</span>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">Genuine Spare Parts</p>
            </div>
            <div className="text-center relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-amber-400">1 Year</span>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">Frame Warranty</p>
            </div>
            <div className="text-center relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-purple-400">1976</span>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">Established Year</p>
            </div>
          </div>
        </ScrollReveal>

        {/* The Generational Trust Story: 1980 vs 2026 Customer Proof */}
        <ScrollReveal direction="up" delayMs={100}>
          <div className="mb-20 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/80 rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-amber-200/90 shadow-2xl shadow-amber-900/5 relative overflow-hidden text-slate-900">
            {/* Ambient warm gold glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Authentic Story Narrative */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>50 Years of Excellence & Generational Trust</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Cycles Built to Last Decades.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-amber-600 to-brand-700">
                    Trust That Spans Generations.
                  </span>
                </h2>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  <p>
                    Since 1976, <strong className="text-slate-900 font-bold">Sri Rama Cycle & Auto Spare Parts</strong> has been anchored on an uncompromising standard: <strong className="text-slate-900 font-bold">delivering genuine build quality, honest advice, and bicycles engineered to outlast generations</strong>. Every cycle assembled in our Kazipet workshop receives rigorous technical checks, ensuring lifelong safety, performance, and riding comfort.
                  </p>
                  <p>
                    For five decades, countless families across Telangana have built their cycling memories with us. Parents who bought their first roadster cycle at our Station Road store in the 1970s and 1980s continue returning today with their children and grandchildren, knowing that our commitment to authentic parts and heartfelt service never wavers.
                  </p>
                  <p className="text-slate-800 font-medium">
                    A tangible testament to this enduring excellence was recently celebrated when a customer who originally received a cycle under our scheme in <strong className="text-amber-900 font-bold">1980</strong> returned in <strong className="text-emerald-900 font-bold">2026</strong> — traveling <strong className="text-brand-800 font-bold underline decoration-amber-400 decoration-2 underline-offset-2">140+ km all the way from Hyderabad</strong> to purchase his family&apos;s next bicycle. He brought his <strong className="text-slate-900 font-bold">preserved 46-year-old receipt</strong> alongside his new invoice — one authentic proof of the thousands of generational bonds forged at Sri Rama Cycles.
                  </p>
                </div>

                {/* Customer Voice / Legacy Philosophy Box */}
                <div className="relative bg-white/95 border-l-4 border-l-amber-500 border-y border-r border-amber-200/80 rounded-2xl p-5 shadow-sm">
                  <Quote className="w-8 h-8 text-amber-300/40 absolute top-3.5 right-3.5" />
                  <p className="text-xs sm:text-sm italic text-slate-800 font-medium leading-relaxed relative z-10">
                    &ldquo;A bicycle is more than transport — it is a milestone in every family&apos;s life. When customers who rode our cycles in the 1980s bring their grandchildren back to our store decades later, it is the ultimate affirmation of our honesty, craftsmanship, and service.&rdquo;
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs border-t border-amber-100 pt-2.5">
                    <span className="font-extrabold text-slate-900 tracking-wide">The Sri Rama Cycles Legacy</span>
                    <span className="text-amber-800 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">Serving Cyclists with Honesty Since 1976</span>
                  </div>
                </div>

                {/* 3 Core Pillars of Generational Excellence */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="flex items-center gap-2 bg-white/90 border border-amber-200/80 rounded-xl p-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">46+ Yrs Family Loyalty</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/90 border border-amber-200/80 rounded-xl p-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">100% Genuine Spares</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/90 border border-amber-200/80 rounded-xl p-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">Archival Customer Proof</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Side-by-Side Bills Interactive Showcase */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md">
                    Archival Living Proof • 1980 vs. 2026
                  </span>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    One preserved real-world story among thousands of families who remain loyal over 4+ decades.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: 1980s Vintage Scheme Bill */}
                  <div
                    onClick={() => setSelectedBillModal('old')}
                    className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-white p-3 transition-all duration-300 hover:border-amber-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/15 flex flex-col justify-between shadow-md"
                  >
                    <div className="flex items-center justify-between pb-2 px-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                        1980 Archival Record
                      </span>
                      <ZoomIn className="w-4 h-4 text-amber-600 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-amber-50/50 border border-amber-200/70 shadow-inner">
                      <Image
                        src="/images/about/historic-1980-bill.png"
                        alt="1980s Sri Rama Cycle Scheme Card for A. P. Venkateshwarlu"
                        fill
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="pt-2 px-1">
                      <p className="text-xs font-black text-slate-900 truncate">Preserved 1980 Scheme Receipt</p>
                      <p className="text-[11px] text-amber-800 font-bold">First Cycle Purchased in 1980 • ₹425</p>
                    </div>
                  </div>

                  {/* Card 2: 2026 Modern Tax Bill */}
                  <div
                    onClick={() => setSelectedBillModal('new')}
                    className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-emerald-300/80 bg-white p-3 transition-all duration-300 hover:border-emerald-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/15 flex flex-col justify-between shadow-md"
                  >
                    <div className="flex items-center justify-between pb-2 px-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                        2026 Generational Return
                      </span>
                      <ZoomIn className="w-4 h-4 text-emerald-600 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-emerald-50/50 border border-emerald-200/70 shadow-inner">
                      <Image
                        src="/images/about/current-2026-bill.png"
                        alt="2026 Sri Rama Cycle Store Bill for A. P. Venkateshwarlu"
                        fill
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="pt-2 px-1">
                      <p className="text-xs font-black text-slate-900 truncate">Returned Decades Later in 2026</p>
                      <p className="text-[11px] text-emerald-800 font-bold">Traveled from Hyderabad • ₹3,200</p>
                    </div>
                  </div>
                </div>

                {/* Compare Button */}
                <button
                  onClick={() => setSelectedBillModal('compare')}
                  className="w-full bg-gradient-to-r from-amber-500 via-brand-600 to-amber-600 hover:from-amber-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  <Receipt className="w-4 h-4 text-white" />
                  <span>Inspect Archival Proof of Loyalty (1980 vs. 2026)</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Milestone Timeline */}
        <div className="mb-20">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Our Heritage</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                5 Decades of Milestones
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MILESTONES.map((item, idx) => (
              <ScrollReveal key={idx} direction="up" delayMs={idx * 100}>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-300 card-hover-lift flex flex-col gap-3 relative h-full">
                  <span className="text-xs font-black text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full w-fit">
                    {item.year}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Core Pillars */}
        <div className="mb-20">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Why Trust Srirama</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Our Core Principles
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <ScrollReveal key={idx} direction="up" delayMs={idx * 120}>
                  <div className="group bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs card-hover-lift flex flex-col gap-4 h-full transition-all duration-300">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs transition-all duration-300 group-hover:scale-110 ${val.color}`}>
                      <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{val.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2">{val.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Call to Action Card */}
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Ready to Upgrade Your Ride?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                Browse our catalog of premium road, mountain, and standard cycles or contact our Kazipet store directly for instant phone & WhatsApp guidance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/shop"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 btn-glow"
              >
                <span>Explore Shop</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={STORE_CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Store</span>
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
            className="relative bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border-2 border-amber-200/90 flex flex-col gap-4 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto text-slate-900"
          >
            {/* Header with Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  Archival Proof of Generational Loyalty: 1980 to 2026
                </h3>
                <span className="text-[11px] text-amber-800 font-semibold">
                  A tangible 46-year record demonstrating why generations of families return to Sri Rama Cycles
                </span>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                <button
                  onClick={() => setSelectedBillModal('compare')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedBillModal === 'compare' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => setSelectedBillModal('old')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedBillModal === 'old' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1980 Receipt
                </button>
                <button
                  onClick={() => setSelectedBillModal('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedBillModal === 'new' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2026 Bill
                </button>
                <button
                  onClick={() => setSelectedBillModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors ml-1"
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
                <div className="flex flex-col gap-2 bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                      1980 Archival Record (Card #58)
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500">Date: 9/7/80</span>
                  </div>
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white border border-amber-200/60 shadow-inner">
                    <Image
                      src="/images/about/historic-1980-bill.png"
                      alt="1980s Sri Rama Cycle Scheme Card"
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-xs text-slate-700 pt-1">
                    <strong className="text-slate-900 block font-black">Original 1980 Purchase • Station Road Store</strong>
                    <span className="text-[11px] text-amber-800 font-semibold">Customer: A. P. Venkateshwarlu • Cycle Value: ₹425/-</span>
                  </div>
                </div>

                {/* 2026 Bill Preview */}
                <div className="flex flex-col gap-2 bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                      2026 Generational Purchase (Bill #666)
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500">Date: 07/05/2026</span>
                  </div>
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white border border-emerald-200/60 shadow-inner">
                    <Image
                      src="/images/about/current-2026-bill.png"
                      alt="2026 Sri Rama Cycle Store Bill"
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-xs text-slate-700 pt-1">
                    <strong className="text-slate-900 block font-black">Returned 46 Years Later • Traveled from Hyd</strong>
                    <span className="text-[11px] text-emerald-800 font-semibold">Speed-IBC 20&quot; C. Green • Total: ₹3,200/-</span>
                  </div>
                </div>
              </div>
            ) : selectedBillModal === 'old' ? (
              <div className="flex flex-col gap-3">
                <div className="relative aspect-[3/4] max-h-[65vh] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
                  <Image
                    src="/images/about/historic-1980-bill.png"
                    alt="1980s Sri Rama Cycle Scheme Card"
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-contain"
                  />
                </div>
                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 text-xs text-slate-800 flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <strong className="text-amber-900 block font-black">1980 Scheme Card #58 • Station Road, Kazipet</strong>
                    <span className="text-slate-600 text-[11px]">Member: A. P. Venkateshwarlu • Fitted Cycle Value: ₹425.00</span>
                  </div>
                  <button
                    onClick={() => setSelectedBillModal('new')}
                    className="text-brand-600 hover:text-brand-700 font-bold text-xs underline underline-offset-4 self-start sm:self-auto"
                  >
                    View Modern 2026 Bill →
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative aspect-[3/4] max-h-[65vh] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
                  <Image
                    src="/images/about/current-2026-bill.png"
                    alt="2026 Sri Rama Cycle Store Bill"
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-contain"
                  />
                </div>
                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 text-xs text-slate-800 flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <strong className="text-emerald-900 block font-black">2026 Store Invoice #666 • Sri Rama Cycle & Auto Spare Parts</strong>
                    <span className="text-slate-600 text-[11px]">Customer: A. P. Venkateshwarlu (C/o Hyd) • Speed-IBC 20&quot; C. Green • ₹3,200.00</span>
                  </div>
                  <button
                    onClick={() => setSelectedBillModal('old')}
                    className="text-brand-600 hover:text-brand-700 font-bold text-xs underline underline-offset-4 self-start sm:self-auto"
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
