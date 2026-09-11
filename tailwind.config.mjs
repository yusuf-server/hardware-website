/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Impact', 'Arial Black', 'sans-serif'],
        syne: ['Impact', 'Arial Black', 'sans-serif'],
      },
      colors: {
        'dark-bg': '#06080d',
        'dark-card': '#0d131e',
      },
    },
  },
  plugins: [],
}
