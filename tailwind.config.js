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
          50: '#f0f7f4',
          100: '#ddeee7',
          200: '#bcdfd0',
          300: '#92c9b2',
          400: '#68ae91',
          500: '#479275',
          600: '#35775e',
          700: '#2c604d',
          800: '#254d3f',
          900: '#204136',
          950: '#0e241e',
        },
        pastel: {
          sage: '#e8f3ee',
          mint: '#dcfce7',
          lilac: '#f3e8ff',
          peach: '#ffedd5',
          rose: '#ffe4e6',
          sand: '#fdf8f0',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        surface: {
          50: '#fafbfb',
          100: '#f4f6f5',
          200: '#e5eae7',
          300: '#d1dbd5',
          800: '#1e2d27',
          900: '#131e1a',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        card: '0 4px 20px -2px rgba(32, 65, 54, 0.05)',
        'card-hover': '0 12px 28px -3px rgba(53, 119, 94, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        float: '0 20px 35px -5px rgba(53, 119, 94, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
