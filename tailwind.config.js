module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      colors: {
        primary: "#565A7F",
        secondary: "#697A8D"
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}
