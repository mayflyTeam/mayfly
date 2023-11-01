import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{html,js,jsx,ts,tsx}',
    './src/**/*.{html,js,jsx,ts,tsx}',
    './index.html'
  ],
  theme: {
    extend: {
      height: {
        custom: "60px",
        wide: "120px"
      },
      fontFamily: {
        amatica: ['Amatic SC'],
      },
      borderRadius: {
        'egg': '50% 50% 50% 50% / 65% 65% 35% 35%',
      },
    },
  },
  plugins: [],
} satisfies Config

