/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
