'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles } from 'lucide-react';

export default function FloatingSocialDock() {
  const { t } = useLanguage();

  return (
    <aside
      id="floating-social-dock"
      aria-label="Floating Social Media Hub"
      className="fixed right-4 sm:right-6 bottom-6 z-[9999] flex flex-col items-end gap-3.5 select-none print:hidden"
    >
      {/* 1. WhatsApp Floating Icon */}
      <div className="relative group flex items-center">
        {/* Tooltip on Desktop hover */}
        <div className="hidden md:flex items-center absolute right-full mr-3 pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
          <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('dock.whatsapp')}</span>
          </div>
        </div>

        <a
          id="floating-whatsapp-btn"
          href="https://wa.me/message/EEJFSOJ7Y3JCD1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Sri Rama Cycles on WhatsApp"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full sm:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl border-2 border-white/80 dark:border-slate-800 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-emerald-500/35 hover:shadow-emerald-500/60 hover:scale-110 active:scale-95"
        >
          <svg
            className="w-6 h-6 fill-current text-white transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>

      {/* 2. Instagram Floating Icon */}
      <div className="relative group flex items-center">
        {/* Tooltip on Desktop hover */}
        <div className="hidden md:flex items-center absolute right-full mr-3 pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
          <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>{t('dock.instagram')}</span>
          </div>
        </div>

        <a
          id="floating-instagram-btn"
          href="https://www.instagram.com/sriramacycle_1976?xtok=MWh2NjFwcmRseWVhZw=="
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Sri Rama Cycles on Instagram"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full sm:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl border-2 border-white/80 dark:border-slate-800 bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] hover:opacity-95 text-white shadow-pink-500/35 hover:shadow-pink-500/60 hover:scale-110 active:scale-95"
        >
          <svg
            className="w-6 h-6 fill-current text-white transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </div>

      {/* 3. YouTube Floating Icon */}
      <div className="relative group flex items-center">
        {/* Tooltip on Desktop hover */}
        <div className="hidden md:flex items-center absolute right-full mr-3 pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
          <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>{t('dock.youtube')}</span>
          </div>
        </div>

        <a
          id="floating-youtube-btn"
          href="https://www.youtube.com/@sriramacycleandautospareparts"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Sri Rama Cycles on YouTube"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full sm:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl border-2 border-white/80 dark:border-slate-800 bg-[#FF0000] hover:bg-[#E60000] text-white shadow-red-500/35 hover:shadow-red-500/60 hover:scale-110 active:scale-95"
        >
          <svg
            className="w-6 h-6 fill-current text-white transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
