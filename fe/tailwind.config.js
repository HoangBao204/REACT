module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
   extend: {
      fontFamily: {
        sans: ['Calibri', 'sans-serif'], // Thiết lập font mặc định là Calibri
      },},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
