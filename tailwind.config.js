/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00B4D8',
          dark: '#0096B4',
          light: '#48CAE4',
        },
        background: {
          DEFAULT: '#1A1A1A',
          light: '#2A2A2A',
        }
      }
    },
  },
  plugins: [],
};