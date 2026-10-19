'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Shield, Check, X, Sliders, Settings2 } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'sr_cookie_consent';

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Preference states
  const [preferences, setPreferences] = useState({
    essential: true, // Always true & locked
    functional: true,
    analytics: false,
  });

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!saved) {
        // Delay slightly for smooth page entrance
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (_) {}
  }, []);

  const saveConsent = (prefs: typeof preferences) => {
    try {
      localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({
          ...prefs,
          timestamp: new Date().toISOString(),
          version: '1.0',
        })
      );
    } catch (_) {}
    setVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    const full = { essential: true, functional: true, analytics: true };
    setPreferences(full);
    saveConsent(full);
  };

  const handleRejectNonEssential = () => {
    const min = { essential: true, functional: false, analytics: false };
    setPreferences(min);
    saveConsent(min);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 text-slate-800 dark:text-slate-200 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Main Banner Body */}
          {!showPreferences ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-950 dark:text-white">
                      Your Privacy & Cookie Choices
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Privacy First
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    We use essential cookies to keep your shopping cart and session secure. With your consent, we also use preference cookies to remember your theme and language settings. Learn more in our{' '}
                    <Link href="/privacy-policy" className="text-brand-600 dark:text-brand-400 underline font-semibold hover:text-brand-700">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href="/cookie-policy" className="text-brand-600 dark:text-brand-400 underline font-semibold hover:text-brand-700">
                      Cookie Policy
                    </Link>.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>

                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Essential Only
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            /* Preferences Customizer */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-brand-600" />
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-950 dark:text-white">
                    Manage Cookie & Data Preferences
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close preferences"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Essential */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-950 dark:text-white">Essential Cookies</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                        Always Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Required for shopping cart, login authentication, and security. Cannot be disabled.
                    </p>
                  </div>
                </div>

                {/* 2. Functional */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-950 dark:text-white">Preferences</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={(e) =>
                            setPreferences((p) => ({ ...p, functional: e.target.checked }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Saves your UI mode (Light/Dark) and Telugu/English language choices across visits.
                    </p>
                  </div>
                </div>

                {/* 3. Analytics */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-950 dark:text-white">Anonymous Analytics</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) =>
                            setPreferences((p) => ({ ...p, analytics: e.target.checked }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Helps us measure site traffic anonymously to improve bicycle catalog loading speeds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Save choices button */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
