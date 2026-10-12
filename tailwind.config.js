/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
          50: 'var(--brand-50, #fff5f5)',
          100: 'var(--brand-100, #ffe8e8)',
          200: 'var(--brand-200, #ffc9cb)',
          300: 'var(--brand-300, #ffa1a5)',
          400: 'var(--brand-400, #f87171)',
          500: 'var(--brand-500, #ef4444)',
          600: 'var(--brand-600, #E61A24)',
          700: 'var(--brand-700, #c8101c)',
          800: 'var(--brand-800, #9e0d16)',
          900: 'var(--brand-900, #7a0b11)',
          950: 'var(--brand-950, #450508)',
        },
        dark: {
          800: '#18181b',
          900: '#0a0a0a',
          950: '#000000', // Pure Jet Black from Logo 'SRI'
        },
        pastel: {
          sage: '#fff5f5',
          mint: '#ffe8e8',
          lilac: '#f5f5f7',
          peach: '#fff1f2',
          rose: '#ffe8e8',
          sand: '#fafaf9',
        },
        accent: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#E61A24', // Racing Red primary accent
          700: '#c8101c',
          800: '#18181b',
          900: '#000000', // Pure Jet Black
        },
        surface: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f4f4f5',
          300: '#e4e4e7',
          800: '#18181b',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        card: '0 4px 20px -2px rgba(230, 26, 36, 0.08)',
        'card-hover': '0 16px 32px -4px rgba(230, 26, 36, 0.22), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
        float: '0 20px 35px -5px rgba(230, 26, 36, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
        'red-glow': '0 0 25px rgba(230, 26, 36, 0.45)',
      },
    },
  },
  plugins: [],
};
