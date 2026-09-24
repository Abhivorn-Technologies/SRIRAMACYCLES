'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white text-center flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          {/* Decorative background blurs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />

          <span className="text-xs font-bold text-brand-300 uppercase tracking-widest mb-2">
            The Srirama Cycling Community
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight max-w-xl">
            Get 10% Off Your First Ride & Exclusive Community Perks
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2 mb-8">
            Subscribe for early bird access to new cycle drops, maintenance tips, and cycling route guides.
          </p>

          {subscribed ? (
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-sm font-semibold animate-in zoom-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Thank you for subscribing! Your discount coupon is RIDE10.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-md relative z-10"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md active:scale-95"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4 text-brand-600" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
