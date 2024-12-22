/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'Amrit': '1400px',
        'Piyush' : '1200px',
        'Swyam' : '700px',
      },
      colors: {
        customGreen: '#BFF098',
        customBlue: '#6FD6FF',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
