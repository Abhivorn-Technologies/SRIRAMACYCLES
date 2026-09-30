import React from 'react';
import {
  ShieldCheck,
  Truck,
  Wrench,
  Headphones,
  CreditCard,
  Award,
} from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: '1 Year Store Frame Warranty',
    description:
      'We stand behind every frame, carbon weave, and alloy structure with official 1-year store warranty coverage in Kazipet.',
    color: 'text-brand-600 bg-brand-50 border-brand-200 group-hover:bg-brand-600 group-hover:text-white',
  },
  {
    icon: Wrench,
    title: '95% Assembled & Ready',
    description:
      'Every cycle arrives 95% pre-assembled in heavy-duty impact boxes with complimentary high-grade hex multitool.',
    color: 'text-brand-600 bg-brand-50 border-brand-200 group-hover:bg-brand-600 group-hover:text-white',
  },
  {
    icon: Truck,
    title: 'Doorstep Delivery Available',
    description:
      'Swift and safe insured transport straight to your doorstep. Delivery charges applicable based on your pincode.',
    color: 'text-brand-600 bg-brand-50 border-brand-200 group-hover:bg-brand-600 group-hover:text-white',
  },
  {
    icon: Award,
    title: '100% Genuine Components',
    description:
      'Factory authentic Shimano, SRAM, RockShox, Tektro, and Kenda parts sourced directly from authorized distributors.',
    color: 'text-brand-600 bg-brand-50 border-brand-200 group-hover:bg-brand-600 group-hover:text-white',
  },
  {
    icon: CreditCard,
    title: 'Flexible & Secure Payment',
    description:
      'Multiple payment avenues: PhonePe, GPay UPI QR, Credit/Debit cards, Net Banking, and Cash on Delivery.',
    color: 'text-brand-600 bg-brand-50 border-brand-200 group-hover:bg-brand-600 group-hover:text-white',
  },
  {
    icon: Headphones,
    title: 'Master Technician Support',
    description:
      'Dedicated cycling specialists ready to assist with sizing, gear tuning, and maintenance advice 7 days a week.',
    color: 'text-brand-600 bg-brand-50 border-brand-200 group-hover:bg-brand-600 group-hover:text-white',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/60 px-3.5 py-1 rounded-full">
            The Sri Rama Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 mt-3">
            Why Cyclists Choose Sri Rama Cycles
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Engineered for longevity, safety, and ultimate riding comfort on city roads and wild trails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group p-6 sm:p-7 rounded-3xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-brand-500/60 card-hover-lift flex flex-col gap-4 transition-all duration-300 shadow-2xs hover:shadow-card-hover hover:shadow-brand-600/10"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs transition-all duration-300 group-hover:scale-110 ${feat.color}`}
                >
                  <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-brand-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
