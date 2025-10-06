/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'starbucks-green': '#00704A',
        'starbucks-light-green': '#00A862',
        'dark-bg': '#0D1117',
        'card-bg': '#161B22'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}