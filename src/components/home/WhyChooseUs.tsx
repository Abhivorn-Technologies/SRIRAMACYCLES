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
    title: '1 Year Frame Warranty',
    description:
      'We stand behind every weld, carbon weave, and alloy structure with official 1-year store warranty coverage.',
    color: 'text-brand-600 bg-brand-50 border-brand-200',
  },
  {
    icon: Wrench,
    title: '95% Assembled & Ready',
    description:
      'Every cycle arrives 95% assembled in heavy-duty impact boxes with complimentary high-grade hex multitool.',
    color: 'text-accent-600 bg-accent-50 border-accent-200',
  },
  {
    icon: Truck,
    title: 'Doorstep Delivery (Charges Applicable)',
    description:
      'Swift and safe insured transport straight to your doorstep. Delivery charges applicable based on location.',
    color: 'text-brand-600 bg-brand-50 border-brand-200',
  },
  {
    icon: Award,
    title: '100% Genuine Components',
    description:
      'Factory authentic Shimano, SRAM, RockShox, Tektro, and Kenda parts sourced directly from global makers.',
    color: 'text-accent-600 bg-accent-50 border-accent-200',
  },
  {
    icon: CreditCard,
    title: 'Flexible & Secure Payment',
    description:
      'Multiple payment avenues: UPI QR, Credit/Debit cards, Net Banking, and zero-risk Cash on Delivery.',
    color: 'text-brand-600 bg-brand-50 border-brand-200',
  },
  {
    icon: Headphones,
    title: 'Master Technician Support',
    description:
      'Dedicated cycling specialists ready to assist with sizing, gear tuning, and maintenance advice 7 days a week.',
    color: 'text-accent-600 bg-accent-50 border-accent-200',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            The Srirama Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mt-2">
            Why Cyclists Choose Srirama Cycles
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered for longevity, safety, and ultimate riding comfort on city roads and wild trails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-brand-200 card-hover-lift flex flex-col gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${feat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
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
