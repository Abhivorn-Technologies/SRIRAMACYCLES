'use client';

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
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 pt-14 pb-10 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 border-b border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center gap-3.5 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-brand-500 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/40 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-950 dark:text-slate-100">
                {t('trust.delivery_title')}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                {t('trust.delivery_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-brand-500 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/40 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-950 dark:text-slate-100">
                {t('trust.assembled_title')}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                {t('trust.assembled_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-brand-500 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/40 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-950 dark:text-slate-100">
                {t('trust.genuine_title')}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                {t('trust.genuine_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-brand-500 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/40 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-950 dark:text-slate-100">
                {t('trust.support_title')}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                {t('trust.support_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 py-12 border-b border-slate-200/90 dark:border-slate-800">
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

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-sm">
              <strong className="text-slate-950 dark:text-white font-black">{STORE_CONTACT.businessName}</strong> (Prop. {STORE_CONTACT.proprietor}) - {t('footer.about_desc')}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={STORE_CONTACT.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all shadow-sm hover:scale-110"
                aria-label="YouTube Channel"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href={STORE_CONTACT.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white flex items-center justify-center transition-all shadow-sm hover:scale-110"
                aria-label="Instagram Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href={STORE_CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition-all shadow-sm hover:scale-110"
                aria-label="WhatsApp Chat"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black text-slate-950 dark:text-slate-100 uppercase tracking-wider mb-4 border-b-2 border-brand-600 pb-1 w-fit">
              {t('footer.cycle_categories')}
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-400 font-medium">
              <li>
                <Link href="/shop?category=road-bikes" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('cat.road_bikes')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mountain-bikes" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('cat.mountain_bikes')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=ladies-bicycles" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('cat.ladies_bicycles')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=junior-bikes" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('cat.junior_bikes')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kids-bikes" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('cat.kids_bikes')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=disc-brake-cycles" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('cat.disc_brake_cycles')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=standard-cycles" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('cat.standard_cycles')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cycling-accessories" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-black text-brand-600 dark:text-brand-400">
                  {t('cat.accessories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black text-slate-950 dark:text-slate-100 uppercase tracking-wider mb-4 border-b-2 border-brand-600 pb-1 w-fit">
              {t('footer.customer_care')}
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-400 font-medium">
              <li>
                <Link href="/track-order" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-bold text-brand-600 dark:text-brand-400">
                  {t('nav.track_order')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('nav.my_orders')}
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('nav.wishlist')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <Link href="/privacy-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Store Location & Timings */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black text-slate-950 dark:text-slate-100 uppercase tracking-wider mb-4 border-b-2 border-brand-600 pb-1 w-fit">
              {t('footer.store_contact')}
            </h4>

            <div className="flex flex-col gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span className="leading-snug font-medium text-slate-800 dark:text-slate-200">{STORE_CONTACT.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                <a
                  href={`tel:${STORE_CONTACT.rawPhone}`}
                  className="font-extrabold text-slate-950 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  {STORE_CONTACT.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">{STORE_CONTACT.supportEmail}</span>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div className="flex flex-col text-slate-800 dark:text-slate-200 leading-tight gap-1 font-medium">
                  <span>{t('footer.timings_weekday')}</span>
                  <span className="text-brand-700 dark:text-brand-400 font-bold">{t('footer.timings_sunday')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Compliance Links Bar */}
        <div className="py-4 border-b border-slate-200/90 dark:border-slate-800 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Link href="/privacy-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <Link href="/terms-and-conditions" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Terms & Conditions
          </Link>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <Link href="/refund-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Refund & Cancellation Policy
          </Link>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <Link href="/cookie-policy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Cookie Policy
          </Link>
        </div>

        {/* Bottom copyright & Developer Credit */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <p className="text-center sm:text-left font-medium">
              © {new Date().getFullYear()}{' '}
              <strong className="text-slate-950 dark:text-white font-bold">{STORE_CONTACT.businessName}</strong>, Kazipet, Hanumakonda. {t('footer.rights_reserved')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 bg-white dark:bg-slate-900 px-4 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">{t('footer.developed_by')}</span>
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
