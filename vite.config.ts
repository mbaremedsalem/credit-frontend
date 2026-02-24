// import flowbiteReact from "flowbite-react/plugin/vite";

// /** @type {import('tailwindcss').Config} */
// export default {

//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   server : {
//     port : 2026,
//     host : '10.99.1.2'
//   },

//   plugins: [flowbiteReact()],
// }






// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  plugins: [react(), flowbiteReact()],
  // server: {
  //   port: 2026,
  //   host: '10.99.1.2',
  // },
 build: {
  minify: 'esbuild',
  sourcemap: false,
  chunkSizeWarningLimit: 1200,
},
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      'antd',
      '@tanstack/react-query',
      'axios',
      'notistack',
      'framer-motion'
    ],
  },
});