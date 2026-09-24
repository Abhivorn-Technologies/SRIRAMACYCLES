import React from 'react';
import Link from 'next/link';
import {
  Bike,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Wrench,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageCircle,
  Clock,
} from 'lucide-react';
import { APP_NAME, STORE_CONTACT } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-700 pt-14 pb-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 border-b border-slate-200/90">
          
          <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-300 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Free & Fast Delivery</h4>
              <p className="text-[11px] text-slate-500">On all cycles & orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">95% Pre-Assembled</h4>
              <p className="text-[11px] text-slate-500">Ready to ride with free toolkit</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">100% Genuine Guarantee</h4>
              <p className="text-[11px] text-slate-500">Original cycle & auto spare parts</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">7-Day Easy Support</h4>
              <p className="text-[11px] text-slate-500">Hassle-free exchange & service</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-12 border-b border-slate-200/90">
          
          {/* Brand & Store Info Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
                <Bike className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase leading-none">
                  SRI RAMA <span className="text-brand-600 font-extrabold">CYCLES</span>
                </span>
                <span className="text-[9px] tracking-wider text-slate-500 uppercase font-bold mt-0.5">
                  Cycle & Auto Spare Parts
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              <strong className="text-slate-900">{STORE_CONTACT.businessName}</strong> (Prop. {STORE_CONTACT.proprietor}) - Hanumakonda&apos;s leading showroom for premium bicycles, road racers, MTBs, smart electric bikes, genuine auto spares, and precision tuning.
            </p>

            <div className="flex flex-col gap-2.5 text-xs text-slate-600 mt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{STORE_CONTACT.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                <a
                  href={`tel:${STORE_CONTACT.rawPhone}`}
                  className="font-bold text-slate-900 hover:text-brand-600 transition-colors"
                >
                  {STORE_CONTACT.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-slate-600">{STORE_CONTACT.supportEmail}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-slate-600">{STORE_CONTACT.hours}</span>
              </div>
            </div>

            {/* Direct WhatsApp Contact Pill */}
            <div className="pt-2">
              <a
                href={STORE_CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with us on WhatsApp ({STORE_CONTACT.rawPhone})</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Cycle Categories
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li>
                <Link href="/shop?category=road-bikes" className="hover:text-brand-600 transition-colors">
                  Road & Racing Bikes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mountain-bikes" className="hover:text-brand-600 transition-colors">
                  Mountain Bikes (MTB)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hybrid-city-bikes" className="hover:text-brand-600 transition-colors">
                  Hybrid & City Commuters
                </Link>
              </li>
              <li>
                <Link href="/shop?category=electric-bikes" className="hover:text-brand-600 transition-colors">
                  Electric Cycles (E-Bikes)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kids-bikes" className="hover:text-brand-600 transition-colors">
                  Kids & Junior Bikes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cycling-accessories" className="hover:text-brand-600 transition-colors font-semibold text-brand-700">
                  Auto Spare Parts & Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li>
                <Link href="/track-order" className="hover:text-brand-600 transition-colors font-medium">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 transition-colors">
                  About Our Store
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-brand-600 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-brand-600 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-400 hover:text-brand-600 transition-colors text-[11px]">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Community */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Connect With Us
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visit our Kazipet store or reach out on social media for new models and spares.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white hover:bg-brand-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200 shadow-2xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white hover:bg-brand-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200 shadow-2xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white hover:bg-brand-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200 shadow-2xs"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white hover:bg-brand-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200 shadow-2xs"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Developer Credit */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()}{' '}
            <strong className="text-slate-800 font-bold">{STORE_CONTACT.businessName}</strong>, Kazipet, Hanumakonda. All rights reserved.
          </p>

          <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
            <span className="text-slate-500 text-[11px] font-medium">Developed by</span>
            <span className="font-extrabold text-xs text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal-600 to-emerald-600 tracking-wide hover:opacity-90 transition-opacity">
              Abhivorn Technologies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
