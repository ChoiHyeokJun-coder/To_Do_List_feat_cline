/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ms-blue': '#0078D4',
        'ms-blue-hover': '#106EBE',
        'ms-blue-light': '#E1F5FE',
      },
    },
  },
  plugins: [],
}
