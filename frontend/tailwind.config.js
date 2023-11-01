/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{ts,js,tsx,jsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        'amatic': ['Amatic SC, sans-serif'],
        'josefin': ['Josefin Sans, sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      height: {
        '300': '300px'
      }
    },
  },
  plugins: [],
}

