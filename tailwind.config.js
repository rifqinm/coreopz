/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#69e1d2',
        secondary: '#ffd237',
        tertiary: '#ffa555',
        quaternary: '#f55a5a',
      },
    },
  },
  plugins: [],
};
