import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bike, ShieldCheck, Award, HeartHandshake, Compass, Wrench, MapPin, Phone } from 'lucide-react';
import { STORE_CONTACT } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Since 1976 • Kazipet & Hanumakonda Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-2 leading-tight">
            {STORE_CONTACT.businessName}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
            Led by <strong className="text-slate-900">{STORE_CONTACT.proprietor}</strong>, Sri Rama Cycle and Auto Spare Parts is the most trusted destination in Hanumakonda district for premium bicycles, road racers, mountain MTBs, electric cycles, auto spare parts, and precision service.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <Image
              src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80"
              alt="Cycling Workshop & Spares"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full w-fit">
              <Bike className="w-4 h-4" />
              <span>Dedicated Quality & Genuine Parts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trusted Craftsmanship & Reliable Auto Spares
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Located at <strong>{STORE_CONTACT.shortAddress}</strong>, we have earned the trust of thousands of riders, commuters, and vehicle owners across Telangana. We supply top-grade cycles ranging from carbon road racers to durable junior bicycles and smart electric commuters.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In addition to our flagship cycling range, we house an extensive inventory of genuine auto spare parts, precision tools, lubricants, tyres, and safety accessories, backed by expert on-site mechanics and personalized consultation.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-100 px-3.5 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>Kazipet, Hanumakonda (506003)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-100 px-3.5 py-2 rounded-xl">
                <Phone className="w-4 h-4 text-brand-600" />
                <span>{STORE_CONTACT.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="bg-slate-950 rounded-3xl p-8 sm:p-12 text-white grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-black text-brand-400">10,000+</span>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Happy Riders & Clients</p>
          </div>
          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400">100%</span>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Genuine Spare Parts</p>
          </div>
          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-black text-amber-400">1 Year</span>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Frame Warranty Guarantee</p>
          </div>
          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-black text-purple-400">#1</span>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Cycle & Auto Store in Kazipet</p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Our Core Principles</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">100% Genuine Quality</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every cycle, gear set, and auto spare part is sourced directly from certified original manufacturers.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Expert Repair & Fitting</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Experienced technicians for complete bike assembly, hydraulic brake bleeding, gear tuning, and auto parts replacement.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Customer First Support</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Friendly, honest advice from Ravula Rakesh Kumar and team to help you choose the exact bike or spare part you need.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm py-3.5 px-8 rounded-xl shadow-md transition-all active:scale-95"
          >
            Explore Cycle Catalog
          </Link>
          <a
            href={STORE_CONTACT.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 px-8 rounded-xl shadow-md transition-all active:scale-95"
          >
            WhatsApp Enquiries (7207653194)
          </a>
        </div>
      </div>
    </div>
  );
}
