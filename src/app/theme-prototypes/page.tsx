'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palette, Check, ArrowRight, ShoppingBag, Heart, Star, Sparkles, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { useTheme, COLOR_THEMES, ColorThemeId } from '@/context/ThemeContext';

export default function ThemePrototypesPage() {
  const { colorTheme, setColorTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-brand-600 px-4 py-1.5 rounded-full text-xs font-black shadow-xs mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client Prototype Presentation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
          Sri Rama Cycles — Theme Prototypes
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
          Curated theme designs for your client including <strong>Theme 2: Soft &amp; Warm</strong> (now applied live), <strong>Theme 1: Clean &amp; Modern</strong>, and <strong>Theme 3: Dark Minimal</strong>. Click &ldquo;Activate Live Preview&rdquo; on any card to switch the entire website instantly!
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 underline flex items-center gap-1"
          >
            <span>Go to Live Homepage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            href="/admin/theme"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
          >
            Manage in Admin Panel
          </Link>
        </div>
      </div>

      {/* Prototype Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {COLOR_THEMES.map((themeOption, idx) => {
          const isActive = colorTheme === themeOption.id;
          return (
            <div
              key={themeOption.id}
              className={`rounded-3xl bg-white border-2 shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isActive
                  ? 'border-slate-950 ring-4 ring-slate-950/15 scale-[1.02]'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xl'
              }`}
            >
              {/* Header Strip with Swatches */}
              <div
                className="p-5 text-white"
                style={{
                  background: `linear-gradient(135deg, ${themeOption.primaryColor} 0%, ${themeOption.secondaryColor} 100%)`,
                }}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                    Option {idx + 1}
                  </span>
                  {isActive && (
                    <span className="bg-white text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 shadow-sm">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Active
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black tracking-tight">{themeOption.name}</h3>
                <p className="text-xs opacity-90 font-medium mt-0.5">{themeOption.tagline}</p>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-full shadow-inner border border-black/10"
                        style={{ backgroundColor: themeOption.primaryColor }}
                        title="Primary Color"
                      />
                      <span
                        className="w-5 h-5 rounded-full shadow-inner border border-black/10"
                        style={{ backgroundColor: themeOption.secondaryColor }}
                        title="Secondary Color"
                      />
                      <span
                        className="w-5 h-5 rounded-full shadow-inner border border-black/10"
                        style={{ backgroundColor: themeOption.accentColor }}
                        title="Accent Color"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {themeOption.primaryColor}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {themeOption.vibe}
                  </p>
                </div>

                {/* Simulated Mini Product Card in this Theme */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span
                      className="px-2 py-0.5 rounded-md font-extrabold uppercase text-[10px]"
                      style={{
                        backgroundColor: `${themeOption.primaryColor}15`,
                        color: themeOption.primaryColor,
                        border: `1px solid ${themeOption.primaryColor}30`,
                      }}
                    >
                      Geared Cycle
                    </span>
                    <span className="text-slate-900 font-black">₹9,999</span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 line-clamp-1">
                    Gang Linear IBC 24T Multi-Speed
                  </p>

                  <button
                    type="button"
                    onClick={() => setColorTheme(themeOption.id)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                    style={{ backgroundColor: themeOption.primaryColor }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Sample Button</span>
                  </button>
                </div>

                {/* Activation CTA Button */}
                <button
                  type="button"
                  onClick={() => setColorTheme(themeOption.id)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-slate-950 hover:bg-black text-white shadow-md active:scale-95 cursor-pointer'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Live on Website</span>
                    </>
                  ) : (
                    <>
                      <Palette className="w-4 h-4" />
                      <span>Activate Live Preview</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
