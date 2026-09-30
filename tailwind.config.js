/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#E61A24', // Official Racing Red from SRI RAMA Logo
          700: '#dc2626',
          800: '#b91c1c',
          900: '#991b1b',
          950: '#450a0a',
        },
        dark: {
          800: '#18181b',
          900: '#0f172a',
          950: '#09090b', // Sleek Obsidian Black from Logo
        },
        pastel: {
          sage: '#fef2f2',
          mint: '#fff1f2',
          lilac: '#f3e8ff',
          peach: '#ffedd5',
          rose: '#ffe4e6',
          sand: '#fafaf9',
        },
        accent: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#0f172a', // Obsidian Dark Accent
          700: '#09090b',
          800: '#020617',
          900: '#000000',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          800: '#18181b',
          900: '#09090b',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        card: '0 4px 20px -2px rgba(230, 26, 36, 0.08)',
        'card-hover': '0 16px 32px -4px rgba(230, 26, 36, 0.18), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        float: '0 20px 35px -5px rgba(230, 26, 36, 0.22), 0 10px 10px -5px rgba(0, 0, 0, 0.06)',
        'red-glow': '0 0 25px rgba(230, 26, 36, 0.35)',
      },
    },
  },
  plugins: [],
};
