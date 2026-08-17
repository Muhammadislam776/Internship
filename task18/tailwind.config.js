/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#071A2B',
        blue: '#2563EB',
        cyan: '#22D3EE',
        orange: '#FF7A18',
        soft: '#F8FAFC',
        emerald: '#22C55E',
        red: '#EF4444',
        amber: '#F59E0B',
        slate: '#172033',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
