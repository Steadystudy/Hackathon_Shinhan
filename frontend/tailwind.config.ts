import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/feature/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        '80vw': '80vw',
        '90vw': '90vw',
      },
      height: {
        '25vh': '25vh',
        '70vh': '70vh',
        '80vh': '80vh',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        blue100: '#7AC6F8',
        blue200: '#11B2F7',
        blue300: '#1890FF',
        background: '#F8F8F8',
        gray100: '#EBEBEB',
        orange100: '#F5A814',
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  important: true,
};
export default config;
