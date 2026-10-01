import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bike,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Wrench,
  Clock,
} from 'lucide-react';
import { APP_NAME, STORE_CONTACT } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-700 pt-14 pb-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 border-b border-slate-200/90">
          
          <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-500 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-950">Doorstep Delivery</h4>
              <p className="text-[11px] text-slate-600 font-medium">Charges applicable on orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-500 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-950">95% Pre-Assembled</h4>
              <p className="text-[11px] text-slate-600 font-medium">Ready to ride with free toolkit</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-500 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-950">100% Genuine Guarantee</h4>
              <p className="text-[11px] text-slate-600 font-medium">Original cycle & auto spare parts</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-500 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-950">7-Day Easy Support</h4>
              <p className="text-[11px] text-slate-600 font-medium">Hassle-free exchange & service</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 py-12 border-b border-slate-200/90">
          
          {/* Column 1: Brand & Store Description */}
          <div className="lg:col-span-4 flex flex-col items-start text-left gap-4">
            <Link href="/" className="flex items-center group -mt-4 sm:-mt-6">
              <div className="relative overflow-hidden transition-transform duration-300 group-hover:scale-105 py-1">
                <Image
                  src="/SRI RAMA logo 3.png"
                  alt="Sri Rama Cycle Store & Auto Spares"
                  width={380}
                  height={115}
                  priority
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-md"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-sm">
              <strong className="text-slate-950 font-black">{STORE_CONTACT.businessName}</strong> (Prop. {STORE_CONTACT.proprietor}) - Hanumakonda&apos;s leading showroom for premium bicycles, road cycles, MTBs, standard & geared cycles, genuine auto spares, and precision tuning.
            </p>
          </div>

          {/* Column 2: Quick Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-4 border-b-2 border-brand-600 pb-1 w-fit">
              Cycle Categories
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-700 font-medium">
              <li>
                <Link href="/shop?category=road-bikes" className="hover:text-brand-600 transition-colors">
                  Road & Racing Cycles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mountain-bikes" className="hover:text-brand-600 transition-colors">
                  Mountain Cycles (MTB)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=ladies-bicycles" className="hover:text-brand-600 transition-colors">
                  Ladies Cycles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=junior-bikes" className="hover:text-brand-600 transition-colors">
                  Junior Cycles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kids-bikes" className="hover:text-brand-600 transition-colors">
                  Kids Cycles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=disc-brake-cycles" className="hover:text-brand-600 transition-colors">
                  Disc Brake Cycles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=standard-cycles" className="hover:text-brand-600 transition-colors">
                  Standard Cycles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cycling-accessories" className="hover:text-brand-600 transition-colors font-black text-brand-600">
                  All Spare Items Available
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-4 border-b-2 border-brand-600 pb-1 w-fit">
              Customer Care
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-700 font-medium">
              <li>
                <Link href="/track-order" className="hover:text-brand-600 transition-colors font-bold text-brand-600">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-brand-600 transition-colors">
                  My Orders & Profile
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-brand-600 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 transition-colors">
                  About Sri Rama
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 (Last Column): Store Location & Timings */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-4 border-b-2 border-brand-600 pb-1 w-fit">
              Store Contact & Timings
            </h4>

            <div className="flex flex-col gap-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span className="leading-snug font-medium text-slate-800">{STORE_CONTACT.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                <a
                  href={`tel:${STORE_CONTACT.rawPhone}`}
                  className="font-extrabold text-slate-950 hover:text-brand-600 transition-colors"
                >
                  {STORE_CONTACT.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-slate-800 font-medium">{STORE_CONTACT.supportEmail}</span>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div className="flex flex-col text-slate-800 leading-tight gap-1 font-medium">
                  <span>Mon – Sat: 9:00 AM – 8:30 PM</span>
                  <span className="text-brand-700 font-bold">Sunday: 9:00 AM – 1:00 PM only</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Developer Credit */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <p className="text-center sm:text-left font-medium">
              © {new Date().getFullYear()}{' '}
              <strong className="text-slate-950 font-bold">{STORE_CONTACT.businessName}</strong>, Kazipet, Hanumakonda. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 bg-white px-4 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
            <span className="text-slate-500 text-[11px] font-medium">Developed by</span>
            <a
              href="https://abhivorn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-red-600 tracking-wide hover:opacity-90 transition-opacity"
            >
              Abhivorn Technologies
            </a>
            <span className="text-slate-400 text-xs font-semibold">&</span>
            <a
              href="https://digilevelup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 tracking-wide hover:opacity-90 transition-opacity"
            >
              DigiLevelUp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
