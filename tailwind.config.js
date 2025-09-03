import flowbiteReact from "flowbite-react/plugin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ".flowbite-react\\class-list.json"
  ],
  
  theme: {
    extend: {
      animation: {
        fadeInUp: 'fadeInUp 1s ease-out',
        logoSlide: 'logoSlide 1s ease-out',
        nameSlide: 'nameSlide 1s ease-out',
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.4s ease-out',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        logoSlide: {
          '0%': { transform: 'translateY(30px)' },
          '100%': { transform: 'translateY(0)' },
        },
        nameSlide: {
          '0%': { transform: 'translateY(30px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      colors:{
         'main-color' : '#141317',
        "second-gray" : "#808080",
        "second-color" : "#efeeea"
      },
      screens : {
        'min-w' : '1000px'

      }
    },
  },
  plugins: [flowbiteReact],
}