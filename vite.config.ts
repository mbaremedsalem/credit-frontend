import flowbiteReact from "flowbite-react/plugin/vite";

/** @type {import('tailwindcss').Config} */
export default {
//   server: {
//     host: '10.99.1.2', // or true for 0.0.0.0
//     port: 5100, // optional
//   }
// ,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },

  plugins: [flowbiteReact()],
}