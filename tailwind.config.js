/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'devanagari': ['Noto Sans Devanagari', 'sans-serif'],
      },
      colors: {
        rose: {
          50: '#fef7f7',
          100: '#fdeaea',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f36565',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
};