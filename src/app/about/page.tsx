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
      year: '1995',
      title: 'Auto Spare Parts Expansion',
      description:
        'Expanded operations into comprehensive auto spare parts, lubricants, tyres, and precision mechanic tools.',
    },
    {
      year: '2015',
      title: 'Performance & Electric Cycles',
      description:
        'Introduced carbon aero road racers, hydraulic mountain bikes, and modern eco-friendly electric bicycles.',
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
        'On-site certified mechanics for precision derailleur tuning, hydraulic line bleeding, wheel truing, and custom bike builds.',
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
              Proprietor: <strong className="text-slate-900 font-extrabold">{STORE_CONTACT.proprietor}</strong> — Kazipet&apos;s premier landmark store for high-performance bicycles, mountain MTBs, electric commuters, and genuine auto spare parts.
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
                Browse our catalog of premium road, MTB, and electric cycles or contact our Kazipet store directly for instant phone & WhatsApp guidance.
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
    </div>
  );
}
