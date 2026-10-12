'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Palette, Check, Sparkles, ExternalLink, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useTheme, COLOR_THEMES, ColorThemeId } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';

export default function AdminThemeManagerPage() {
  const { colorTheme, setColorTheme, theme, toggleTheme } = useTheme();
  const { success } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSelectTheme = async (themeId: ColorThemeId, themeName: string) => {
    setSaving(true);
    await setColorTheme(themeId);
    setSaving(false);
    success(`Applied "${themeName}" theme to the entire website!`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 px-3 py-1 rounded-full text-xs font-black mb-2 shadow-xs">
            <Palette className="w-3.5 h-3.5 text-brand-600" />
            <span>Store Theme Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Website Color Themes & Branding
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose a curated, simple and beautiful theme for your store. Any theme selected here updates the entire customer website and admin panel in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black px-4 py-2.5 rounded-xl shadow-xs transition-all hover:scale-102"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/theme-prototypes"
            target="_blank"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Compare All Prototypes</span>
          </Link>
        </div>
      </div>

      {/* Grid of 5 Theme Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {COLOR_THEMES.map((t) => {
          const isActive = colorTheme === t.id;
          return (
            <div
              key={t.id}
              className={`relative rounded-3xl p-6 transition-all duration-300 border-2 flex flex-col justify-between gap-5 bg-white shadow-sm hover:shadow-xl ${
                isActive
                  ? 'border-brand-600 ring-4 ring-brand-600/15 scale-[1.01]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Top Banner */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full shadow-inner"
                      style={{ backgroundColor: t.primaryColor }}
                    />
                    <span
                      className="w-4 h-4 rounded-full shadow-inner"
                      style={{ backgroundColor: t.secondaryColor }}
                    />
                    <span
                      className="w-4 h-4 rounded-full shadow-inner"
                      style={{ backgroundColor: t.accentColor }}
                    />
                  </div>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-300 text-brand-700 text-[11px] font-black px-3 py-1 rounded-full shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-brand-600" />
                      <span>Active Theme</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400">Available</span>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 tracking-tight">{t.name}</h3>
                <p className="text-xs font-extrabold text-brand-700 mt-0.5">{t.tagline}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.vibe}</p>
              </div>

              {/* Mini Interactive Preview Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                  Live Component Preview
                </div>
                
                {/* Simulated Product Tag & Price */}
                <div className="flex items-center justify-between text-xs font-bold">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold"
                    style={{
                      backgroundColor: `${t.primaryColor}15`,
                      color: t.primaryColor,
                      border: `1px solid ${t.primaryColor}30`,
                    }}
                  >
                    Flagship MTB
                  </span>
                  <span className="font-black text-slate-900">₹8,499</span>
                </div>

                {/* Simulated Action Button */}
                <button
                  type="button"
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: t.primaryColor }}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Sample CTA Button</span>
                </button>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isActive || saving}
                onClick={() => handleSelectTheme(t.id, t.name)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'bg-slate-100 text-slate-400 cursor-default'
                    : 'bg-slate-950 hover:bg-black text-white shadow-md active:scale-95 cursor-pointer hover:shadow-lg'
                }`}
              >
                {isActive ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Currently Applied</span>
                  </>
                ) : (
                  <>
                    <Palette className="w-4 h-4" />
                    <span>Apply This Theme</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
