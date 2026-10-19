import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Cookie,
  Shield,
  Sliders,
  CheckCircle2,
  Lock,
  Eye,
  Info,
  Clock,
  Settings,
} from 'lucide-react';
import { STORE_CONTACT, APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Cookie Policy | Sri Rama Cycle & Auto Spare Parts',
  description:
    'Cookie Policy explaining how Sri Rama Cycle Store uses cookies, session identifiers, and local storage to provide a secure and personalized shopping experience.',
};

export default function CookiePolicyPage() {
  const lastUpdated = 'October 19, 2026';

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold">Cookie Policy</span>
        </nav>

        {/* Header Hero */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
              <Cookie className="w-3.5 h-3.5" />
              Cookie & Tracking Disclosures
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Last Updated: {lastUpdated}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            Cookie Policy
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            This Cookie Policy explains how <strong>{STORE_CONTACT.businessName}</strong> and technical provider Abhivorn Technologies use cookies, local storage objects, and similar web technologies when you browse our website.
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-10">

          {/* 1. What are cookies */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-brand-600" />
              1. What Are Cookies and Local Storage?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Cookies are tiny text files stored on your computer or mobile device by your web browser when you visit a website. In modern web applications, we also use browser <strong>Local Storage</strong>. These technologies help remember your shopping cart items, keep you securely signed in, preserve your theme preference (Light / Dark mode), and ensure website stability.
            </p>
          </section>

          {/* 2. Specific cookies we use */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-600" />
              2. Categories of Cookies Used on This Website
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We classify our cookies and storage keys into the following distinct categories:
            </p>

            <div className="space-y-4">
              {/* Essential */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    A. Strictly Necessary & Essential Cookies (Always Active)
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    Mandatory
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  These cookies are vital for the website to function properly. Without them, core features like user authentication, security protection, and checkout transactions cannot operate.
                </p>
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                        <th className="py-1.5 font-bold">Key / Cookie</th>
                        <th className="py-1.5 font-bold">Purpose</th>
                        <th className="py-1.5 font-bold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="py-2 font-mono text-[11px] text-brand-600">token / auth_token</td>
                        <td className="py-2">Secures your active customer login session</td>
                        <td className="py-2">7 Days</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-[11px] text-brand-600">sr_cart</td>
                        <td className="py-2">Stores products added to your shopping cart</td>
                        <td className="py-2">Persistent</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-[11px] text-brand-600">sr_wishlist</td>
                        <td className="py-2">Stores bicycles and spares saved to your wishlist</td>
                        <td className="py-2">Persistent</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Functional */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    <Settings className="w-4 h-4 text-brand-600" />
                    B. Preference & Functional Cookies
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-400">
                    Optional
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  These keys remember your personal preferences so you do not need to reconfigure them each time you browse:
                </p>
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                        <th className="py-1.5 font-bold">Key / Cookie</th>
                        <th className="py-1.5 font-bold">Purpose</th>
                        <th className="py-1.5 font-bold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="py-2 font-mono text-[11px] text-brand-600">sr_theme</td>
                        <td className="py-2">Stores your preferred UI color mode (Light or Dark)</td>
                        <td className="py-2">1 Year</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-[11px] text-brand-600">sr_lang</td>
                        <td className="py-2">Stores language selection (English / Telugu)</td>
                        <td className="py-2">1 Year</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-[11px] text-brand-600">sr_cookie_consent</td>
                        <td className="py-2">Records your cookie preferences and consent status</td>
                        <td className="py-2">1 Year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    <Eye className="w-4 h-4 text-brand-600" />
                    C. Performance & Analytics Cookies
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Consent-Based
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Help us understand how customers discover our bicycles, which categories are popular (e.g. road cycles vs gear cycles), and monitor page loading performance without directly identifying individual persons.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Managing Preferences */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-600" />
              3. Managing Your Cookie Preferences
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Under the DPDP Act 2023, you have full authority over non-essential tracking technologies:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <li><strong>Via Our Cookie Banner:</strong> When you first visit our site, our consent banner allows you to Accept All, Reject Non-Essential, or customize category permissions.</li>
              <li><strong>Via Your Browser Settings:</strong> You can block or clear cookies at any time through your browser settings (Chrome, Safari, Edge, Firefox). Note that disabling essential cookies may prevent you from logging in or placing orders.</li>
            </ul>
          </section>

          {/* 4. Contact */}
          <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white">
              4. Questions Regarding Cookies
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              If you have any questions regarding our use of cookies or data privacy, please write to our privacy desk at <a href={`mailto:${STORE_CONTACT.supportEmail}`} className="text-brand-600 font-bold">{STORE_CONTACT.supportEmail}</a> or reach out to our Grievance Officer in Kazipet, Hanumakonda.
            </p>
          </section>

        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Related Legal Documents:</span>
          <div className="flex flex-wrap items-center gap-4 font-bold text-brand-600 dark:text-brand-400">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy (DPDP Act)</Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:underline">Refund Policy</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
