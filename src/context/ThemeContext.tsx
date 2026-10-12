'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Mode = 'light' | 'dark';
export type ColorThemeId =
  | 'racing-red'
  | 'royal-navy'
  | 'emerald-sport'
  | 'sunset-amber'
  | 'stealth-titanium';

export interface IColorThemeInfo {
  id: ColorThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  vibe: string;
}

export const COLOR_THEMES: IColorThemeInfo[] = [
  {
    id: 'racing-red',
    name: 'Classic Sri Rama',
    tagline: 'Signature Racing Red & Jet Black',
    primaryColor: '#E61A24',
    secondaryColor: '#000000',
    accentColor: '#EF4444',
    vibe: 'Official logo brand colors since 1976. Bold, athletic, high-contrast racing spirit.',
  },
  {
    id: 'royal-navy',
    name: 'Showroom Royal Navy',
    tagline: 'Deep Automotive Navy & Crimson',
    primaryColor: '#2563EB',
    secondaryColor: '#0F172A',
    accentColor: '#E61A24',
    vibe: 'Prestigious automotive showroom aesthetic. Clean, trustworthy, and authoritative.',
  },
  {
    id: 'emerald-sport',
    name: 'Eco Sport Emerald',
    tagline: 'Vibrant Green & Carbon Slate',
    primaryColor: '#059669',
    secondaryColor: '#0F172A',
    accentColor: '#10B981',
    vibe: 'Fresh outdoor cycling energy, health, nature exploration, and environmental purity.',
  },
  {
    id: 'sunset-amber',
    name: 'Golden Speed Amber',
    tagline: 'Warm Sunset Orange & Obsidian',
    primaryColor: '#EA580C',
    secondaryColor: '#000000',
    accentColor: '#F59E0B',
    vibe: 'High-energy rally racing warmth, celebratory festive spirit, and heritage trust.',
  },
  {
    id: 'stealth-titanium',
    name: 'Stealth Titanium',
    tagline: 'Modern Rose Crimson & Titanium Slate',
    primaryColor: '#E11D48',
    secondaryColor: '#1E293B',
    accentColor: '#FB7185',
    vibe: 'Ultra-modern high-tech cycling boutique (like S-Works and Canyon). Sleek and refined.',
  },
];

interface ThemeContextType {
  theme: Mode;
  toggleTheme: () => void;
  setTheme: (theme: Mode) => void;
  colorTheme: ColorThemeId;
  setColorTheme: (colorThemeId: ColorThemeId) => Promise<void>;
  themesList: IColorThemeInfo[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  colorTheme: 'racing-red',
  setColorTheme: async () => {},
  themesList: COLOR_THEMES,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Mode>('light');
  const [colorTheme, setColorThemeState] = useState<ColorThemeId>('racing-red');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Initialize Light/Dark mode
    const storedMode = localStorage.getItem('sr_theme') as Mode | null;
    if (storedMode === 'light' || storedMode === 'dark') {
      setThemeState(storedMode);
      applyMode(storedMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialMode = prefersDark ? 'dark' : 'light';
      setThemeState(initialMode);
      applyMode(initialMode);
    }

    // 2. Initialize Color Theme (first local storage, then sync from server)
    const storedColorTheme = localStorage.getItem('sr_color_theme') as ColorThemeId | null;
    if (storedColorTheme && COLOR_THEMES.some((t) => t.id === storedColorTheme)) {
      setColorThemeState(storedColorTheme);
      applyColorTheme(storedColorTheme);
    } else {
      applyColorTheme('racing-red');
    }

    // Sync from database
    fetch('/api/settings/theme')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.themeId && COLOR_THEMES.some((t) => t.id === data.themeId)) {
          setColorThemeState(data.themeId);
          localStorage.setItem('sr_color_theme', data.themeId);
          applyColorTheme(data.themeId);
        }
      })
      .catch(() => {});
  }, []);

  const applyMode = (m: Mode) => {
    const root = document.documentElement;
    if (m === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const applyColorTheme = (tId: ColorThemeId) => {
    document.documentElement.setAttribute('data-color-theme', tId);
  };

  const setTheme = (newTheme: Mode) => {
    setThemeState(newTheme);
    localStorage.setItem('sr_theme', newTheme);
    applyMode(newTheme);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const setColorTheme = async (newColorTheme: ColorThemeId) => {
    setColorThemeState(newColorTheme);
    localStorage.setItem('sr_color_theme', newColorTheme);
    applyColorTheme(newColorTheme);

    // Save to server
    try {
      await fetch('/api/settings/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId: newColorTheme }),
      });
    } catch (err) {
      // Local fallback continues gracefully
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        colorTheme,
        setColorTheme,
        themesList: COLOR_THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
