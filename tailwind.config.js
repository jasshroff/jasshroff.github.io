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
        maroon: {
          50: '#fdf3f5',
          100: '#fbe5e9',
          200: '#f6c5cf',
          300: '#ef9ba9',
          400: '#e3687e',
          500: '#d23a56',
          600: '#b8213e',
          700: '#9b1730',
          800: '#82162b',
          900: '#5c0011', // Deep Royal Maroon
          950: '#3a000a', // Ultra Dark Maroon
        },
        dark: {
          900: '#1a1a1a', // Legacy Dark background
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
