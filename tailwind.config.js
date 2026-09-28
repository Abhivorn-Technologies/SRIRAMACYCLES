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
          50: '#f0f7f2',
          100: '#dceee1',
          200: '#bddcc6',
          300: '#92c2a1',
          400: '#61a376',
          500: '#3f8656',
          600: '#205A28', // Primary Green
          700: '#1c4a22',
          800: '#183c1e',
          900: '#14321b',
          950: '#0b1a0e',
        },
        pastel: {
          sage: '#eaf3ec',
          mint: '#dcfce7',
          lilac: '#f3e8ff',
          peach: '#ffedd5',
          rose: '#ffe4e6',
          sand: '#fdf8f0',
        },
        accent: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#e1343c',
          600: '#C72B32', // Secondary Red
          700: '#a71f25',
          800: '#8b1c21',
          900: '#741c20',
        },
        surface: {
          50: '#f8faf8',
          100: '#f1f5f2',
          200: '#e2eae4',
          300: '#cddbd1',
          800: '#1b2c20',
          900: '#111e15',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        card: '0 4px 20px -2px rgba(32, 90, 40, 0.06)',
        'card-hover': '0 12px 28px -3px rgba(32, 90, 40, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        float: '0 20px 35px -5px rgba(32, 90, 40, 0.18), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
