/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
            "primary": "#ffd900",
            "background-dark": "#0f0f0f",
            "surface-dark": "#1a1a1a",
            "border-dark": "#2d2d2d",
            "accent-dark": "#2a2a2a",
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        }
    },
  },
  plugins: [],
}