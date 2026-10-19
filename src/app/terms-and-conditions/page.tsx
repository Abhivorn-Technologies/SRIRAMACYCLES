import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  FileCheck,
  ShieldAlert,
  Scale,
  Truck,
  CreditCard,
  RotateCcw,
  Bike,
  Building,
  HelpCircle,
} from 'lucide-react';
import { STORE_CONTACT, APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Sri Rama Cycle & Auto Spare Parts',
  description:
    'Terms and Conditions for purchasing bicycles, auto spare parts, and accessories from Sri Rama Cycle Store, Kazipet, Hanumakonda.',
};

export default function TermsAndConditionsPage() {
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
          <span className="text-slate-900 dark:text-white font-semibold">Terms & Conditions</span>
        </nav>

        {/* Header Hero */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
              <Scale className="w-3.5 h-3.5" />
              Legal Agreement
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Last Updated: {lastUpdated}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            Terms and Conditions of Service
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Welcome to the official digital platform of <strong>{STORE_CONTACT.businessName}</strong> (Prop. {STORE_CONTACT.proprietor}), established in 1976 in Kazipet, Hanumakonda, Telangana. These Terms and Conditions govern your use of our website, product purchases, cycle assembly, and delivery services.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-10">

          {/* 1. Acceptance */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-brand-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              By accessing, browsing, or purchasing from this website, you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions, our <Link href="/privacy-policy" className="text-brand-600 underline font-semibold">Privacy Policy</Link>, and our <Link href="/refund-policy" className="text-brand-600 underline font-semibold">Refund & Cancellation Policy</Link>. If you do not agree, please refrain from using this website.
            </p>
          </section>

          {/* 2. Eligibility & Account Responsibilities */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-600" />
              2. User Eligibility & Account Registration
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              You must be at least 18 years of age and competent to enter into a legally binding contract under the Indian Contract Act, 1872. When registering an account:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <li>You agree to provide accurate, true, and complete information during registration and checkout.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials and password.</li>
              <li>You accept responsibility for all activities that occur under your account.</li>
            </ul>
          </section>

          {/* 3. Product Catalog & Pricing */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Bike className="w-5 h-5 text-brand-600" />
              3. Products, Specifications & Pricing
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We make every effort to display accurate specifications, colors, frame sizes, and pricing for road cycles, mountain cycles, disc brake cycles, ladies cycles, and auto spare parts. However:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <li>Minor variations in color, decals, or tire tread may occur depending on screen displays and manufacturer updates.</li>
              <li>All prices are quoted in Indian Rupees (₹) and are inclusive of applicable GST taxes.</li>
              <li>We reserve the right to correct pricing errors and cancel orders placed under erroneously listed prices.</li>
            </ul>
          </section>

          {/* 4. Payment Terms */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-600" />
              4. Payment Methods & Security
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We support secure online payments via <strong>Razorpay</strong> (UPI, Credit/Debit cards, Net Banking) as well as <strong>Cash on Delivery (COD)</strong> for select pincodes:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <li>For prepaid orders, funds are processed through RBI-authorized payment gateways complying with PCI-DSS protocols.</li>
              <li>For Cash on Delivery orders, exact payment must be tendered to the delivery agent upon receipt of the cycle or spare parts.</li>
            </ul>
          </section>

          {/* 5. Assembly & Delivery */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" />
              5. Cycle Assembly & Delivery Terms
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Unlike generic box shipments, Sri Rama Cycle Store takes pride in our 48+ years of bicycle engineering:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <li><strong>Local Doorstep Delivery:</strong> Cycles delivered within the Hanumakonda, Kazipet, and Warangal tri-cities are typically pre-assembled and tuned by our certified technicians.</li>
              <li><strong>Transit Box Shipments:</strong> For distant or freight orders, bicycles are shipped in 85% - 90% assembled condition inside high-grade protective packaging. Minor assembly (pedals, handlebar alignment, front wheel) may be required.</li>
              <li>Customers must inspect the package upon arrival and report any transit damage within 24 hours.</li>
            </ul>
          </section>

          {/* 6. Warranty */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-brand-600" />
              6. Warranty & Servicing
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              All new bicycles carry original brand manufacturer warranties against frame defects and manufacturing flaws. Consumable parts (tubes, tires, brake pads, gear wires) are subject to normal wear and tear and are not covered under standard manufacturer warranty. In-store free service tune-ups are provided at our Kazipet workshop as outlined in your store invoice.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-600" />
              7. Limitation of Liability
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To the maximum extent permitted by applicable Indian law, {STORE_CONTACT.businessName} shall not be liable for any indirect, punitive, or consequential damages resulting from the use or inability to use the products purchased. Cycling involves inherent physical risks; users must always wear appropriate protective gear (helmets, lights) and observe Indian traffic rules.
            </p>
          </section>

          {/* 8. Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-600" />
              8. Intellectual Property
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              All content on this website, including logos, store branding, product photographs, text, graphics, and code, is the property of {STORE_CONTACT.businessName}, protected under Indian Copyright and Trademark laws. Unauthorized reproduction is strictly prohibited.
            </p>
          </section>

          {/* 9. Governing Law & Jurisdiction */}
          <section className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white">
              9. Governing Law & Dispute Resolution
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes, claims, or legal proceedings arising out of or related to our website or purchases shall be subject to the exclusive jurisdiction of the competent courts in <strong>Hanumakonda / Warangal, Telangana, India</strong>.
            </p>
          </section>

          {/* 10. Contact Us */}
          <section className="space-y-2 pt-2">
            <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-600" />
              10. Inquiries and Clarifications
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              For any questions regarding these Terms, please contact our store helpline at <a href={`tel:${STORE_CONTACT.rawPhone}`} className="text-brand-600 font-bold">{STORE_CONTACT.phone}</a> or write to <a href={`mailto:${STORE_CONTACT.supportEmail}`} className="text-brand-600 font-bold">{STORE_CONTACT.supportEmail}</a>.
            </p>
          </section>

        </div>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Related Legal Documents:</span>
          <div className="flex flex-wrap items-center gap-4 font-bold text-brand-600 dark:text-brand-400">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy (DPDP Act)</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:underline">Refund & Cancellation</Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:underline">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
