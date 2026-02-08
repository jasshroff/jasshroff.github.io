/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf7e6',
          100: '#f6ecbf',
          200: '#efdf8f',
          300: '#e5cd5c',
          400: '#dec03d',
          500: '#d4aa1e', // Primary Gold
          600: '#b38814',
          700: '#8e6611',
          800: '#755113',
          900: '#644415',
          950: '#3a2408',
        },
        dark: {
          900: '#1a1a1a', // Dark background
          800: '#2d2d2d',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // For headings
      }
    },
  },
  plugins: [],
}
