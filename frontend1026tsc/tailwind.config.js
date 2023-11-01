import { defaultTheme } from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        custom: "80px"
      },
      fontFamily: {
        // sans: ['"Amatic SC"', ...defaultTheme.fontFamily.sans],
        amatica: ['"Amatic SC"'],
      },
      borderRadius: {
        'egg': '50% 50% 50% 50% / 65% 65% 35% 35%',
      },
    },
     
  },
}
