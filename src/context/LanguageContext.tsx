'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Locale, translations } from '@/lib/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  toggleLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    setLocaleState('en');
    localStorage.setItem('sr_lang', 'en');
    document.documentElement.lang = 'en';
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('sr_lang', newLocale);
    document.documentElement.lang = newLocale;
  };

  const toggleLanguage = () => {
    const next: Locale = locale === 'en' ? 'te' : locale === 'te' ? 'hi' : 'en';
    setLocale(next);
  };

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const entry = translations[key];
      if (entry && entry[locale]) {
        return entry[locale];
      }
      return fallback || entry?.en || key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
