/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        cream: '#FAF7F2',
        milk: '#FAF5EE',
        blush: '#D4A085',
        rose: '#E3B8A4',
        charcoal: '#1C1C1C',
        sand: '#8E8A82',
      },
    },
  },
  plugins: [],
};
