import flowbiteReact from "flowbite-react/plugin/vite";

/** @type {import('tailwindcss').Config} */
export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // server : {
  //   port : 2025,
  //   host : '10.99.1.2'
  // },

  plugins: [flowbiteReact()],
}