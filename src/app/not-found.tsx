import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, ShoppingBag, Phone } from 'lucide-react';
import { STORE_CONTACT } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        {/* 404 Visual Pill */}
        <span className="text-xs font-black tracking-widest text-brand-600 uppercase bg-brand-50 border border-brand-200/60 px-3 py-1 rounded-full mb-4">
          Error 404 • Page Not Found
        </span>

        <h1 className="text-7xl font-black text-slate-900 tracking-tight mb-3">
          4<span className="text-brand-600">0</span>4
        </h1>

        <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
          Looks Like You Took an Off-Road Detour!
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
          The cycle or page you are looking for might have been moved, renamed, or is temporarily out of service.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md shadow-brand-600/20 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Cycles</span>
          </Link>
        </div>

        {/* Contact Help */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 w-full flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>Need quick assistance?</span>
          <a
            href={STORE_CONTACT.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 font-bold hover:underline inline-flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" /> Chat with Store
          </a>
        </div>
      </div>
    </div>
  );
}
