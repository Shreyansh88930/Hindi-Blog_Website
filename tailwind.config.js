/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
      'spin-slow': 'spin 1.2s linear infinite',
        'wiggle-slow': 'wiggle 2s ease-in-out infinite',
        'fade-in-slow': 'fadeIn 2.5s ease-in forwards',
        'fade': 'fadeIn 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'like-pulse': 'like-pulse 0.6s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'like-pulse': { // Added keyframes
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
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
    },
  },
  blur: {
      25: '25px',
      50: '50px',
  },
  plugins: [require('@tailwindcss/line-clamp')],
};