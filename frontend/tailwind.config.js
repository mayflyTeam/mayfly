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
        'dm-sans': ['DM Sans, sans-serif'],
        'manrope': ['Manrope, sans-serif'],
        'prompt': ['Prompt, sans-serif'],
        'public-sans': ['Public Sans, sans-serif'],
        'righteous': ['Righteous, sans-serif'],
        'space-grotesk': ['Space Grotesk, sans-serif'],
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

