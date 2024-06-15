/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "primary": "#0A0A0B",
        "secondary": "#181819",
        "tertiary": "#28292B",
      },
      borderColor: {
        "primary": "#181819",
        "secondary": "#28292B",
      }
    },
  },
  plugins: [],
}

