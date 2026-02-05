/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uzuhb': 'rgba(255,255,255,0.1)',
      },
      fontFamily: {
        'innovator': ['"Innovator Grotesk"', 'sans-serif'],
        'diatype': ['"ABC Diatype Mono"', 'monospace'],
        'sf': ['"SF Pro"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
