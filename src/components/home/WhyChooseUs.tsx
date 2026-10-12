'use client';

import React from 'react';
import {
  ShieldCheck,
  Truck,
  Wrench,
  Headphones,
  CreditCard,
  Award,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const features = [
    {
      icon: ShieldCheck,
      title: t('why.f1_title'),
      description: t('why.f1_desc'),
    },
    {
      icon: Wrench,
      title: t('why.f2_title'),
      description: t('why.f2_desc'),
    },
    {
      icon: Truck,
      title: t('why.f3_title'),
      description: t('why.f3_desc'),
    },
    {
      icon: Award,
      title: t('why.f4_title'),
      description: t('why.f4_desc'),
    },
    {
      icon: CreditCard,
      title: t('why.f5_title'),
      description: t('why.f5_desc'),
    },
    {
      icon: Headphones,
      title: t('why.f6_title'),
      description: t('why.f6_desc'),
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-900/50 px-3.5 py-1 rounded-full">
            {t('why.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white mt-3">
            {t('why.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            {t('why.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:border-brand-500/60 dark:hover:border-brand-500/60 card-hover-lift flex flex-col gap-4 transition-all duration-300 shadow-2xs hover:shadow-card-hover hover:shadow-brand-600/10"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-brand-200 dark:border-brand-900/60 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2 font-medium">
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
