import { heroui } from "@heroui/react";


/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-blue': '#0A3D62',
        'steel-gray': '#4B4B4B',
        'accent-orange': '#F39C12',
        primary: '#0A3D62',
        secondary: '#4B4B4B',
        accent: '#F39C12',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), require("daisyui")], // Add DaisyUI here


};


