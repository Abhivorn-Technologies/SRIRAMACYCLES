import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  RotateCcw,
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  HelpCircle,
  PackageX,
  CreditCard,
} from 'lucide-react';
import { STORE_CONTACT, APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Shipping, Return & Refund Policy | Sri Rama Cycle & Auto Spare Parts',
  description:
    'Official Shipping, Cancellation, Return, and Refund Policy for Sri Rama Cycle & Auto Spare Parts, Kazipet, Hanumakonda.',
};

export default function RefundPolicyPage() {
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
          <span className="text-slate-900 dark:text-white font-semibold">Refund & Shipping Policy</span>
        </nav>

        {/* Header Hero */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
              <RotateCcw className="w-3.5 h-3.5" />
              Customer Protection
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Last Updated: {lastUpdated}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            Shipping, Cancellation & Refund Policy
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            At <strong>{STORE_CONTACT.businessName}</strong>, we are committed to delivering premium bicycles and genuine auto spare parts with complete customer transparency. This policy outlines our procedures for shipping, doorstep delivery, order cancellation, returns, and refunds.
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-10">

          {/* 1. Shipping & Delivery */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" />
              1. Shipping Timelines & Doorstep Delivery
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We process orders swiftly from our flagship hub in Kazipet, Hanumakonda:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Local Tri-Cities (Kazipet, Hanumakonda, Warangal):</strong>
                <span>Orders are dispatched within 24–48 hours, fully assembled and calibrated by our technician. Delivery is completed within 2–4 business days.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">State & Regional Shipping (Telangana / Andhra Pradesh):</strong>
                <span>Dispatched within 2 business days via freight courier. Estimated delivery is 3–7 business days depending on pincode accessibility.</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              * Tracking information is automatically provided through your account and via SMS/WhatsApp once the consignment is shipped.
            </p>
          </section>

          {/* 2. Cancellation Policy */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <PackageX className="w-5 h-5 text-brand-600" />
              2. Order Cancellation Policy
            </h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Cancellation Before Dispatch:</strong> You may cancel your order at no charge before the cycle or spare parts have been dispatched from our workshop. A 100% full refund will be processed immediately back to the original payment method.
              </p>
              <p>
                <strong>Cancellation After Dispatch:</strong> Once an order is in transit or out for delivery, cancellations are subject to two-way freight deduction costs incurred with logistics partners.
              </p>
            </div>
          </section>

          {/* 3. Return & Replacement Policy */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-brand-600" />
              3. Returns & Replacements (7-Day Window)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We offer a <strong>7-Day Replacement Policy</strong> for bicycles and spare parts under the following eligible conditions:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Product arrived damaged, defective, or with missing components during transit.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Wrong item, size, color, or incorrect auto spare part delivered versus the confirmed order.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Manufacturing flaw identified during unboxing/assembly prior to regular outdoor road use.</span>
              </li>
            </ul>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Important Notice on Returns:</strong> Please record an unboxing video or take clear photos of any damaged packaging upon delivery. Returned cycles must be in unused condition with all original tags, user manuals, warranty cards, and tools intact.
              </div>
            </div>
          </section>

          {/* 4. Refund Process & Timelines */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-600" />
              4. Refund Processing & Timelines
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Once the returned product is received and inspected at our Kazipet store, your refund will be initiated:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm space-y-2">
              <p><strong>Prepaid Orders (UPI, Cards, Net Banking):</strong> Refunds are credited automatically via Razorpay to your original bank account or card within <strong>5 to 7 business days</strong>.</p>
              <p><strong>Cash on Delivery (COD) Orders:</strong> Refunds will be transferred via NEFT/IMPS or UPI to your verified bank account once banking details are provided to our support team.</p>
            </div>
          </section>

          {/* 5. Non-Returnable Items */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white">
              5. Non-Returnable Items
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The following categories cannot be returned once delivered:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
              <li>Cycles that have been ridden outdoors or show tire wear, scratches, or altered modifications.</li>
              <li>Consumable bicycle fluids (lubricants, grease, chain cleaners) once the seal has been opened.</li>
              <li>Electrical or customized components with broken security seals.</li>
            </ul>
          </section>

          {/* 6. Contact for Claims */}
          <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-600" />
              6. Initiating a Return or Refund Claim
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To request an order cancellation, replacement, or refund, contact our customer support team with your Order ID:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm space-y-1">
              <p><strong>Helpline:</strong> <a href={`tel:${STORE_CONTACT.rawPhone}`} className="text-brand-600 font-bold">{STORE_CONTACT.phone}</a></p>
              <p><strong>WhatsApp Support:</strong> <a href={STORE_CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-brand-600 font-bold">Chat on WhatsApp</a></p>
              <p><strong>Email:</strong> <a href={`mailto:${STORE_CONTACT.supportEmail}`} className="text-brand-600 font-bold">{STORE_CONTACT.supportEmail}</a></p>
            </div>
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
            <Link href="/cookie-policy" className="hover:underline">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
