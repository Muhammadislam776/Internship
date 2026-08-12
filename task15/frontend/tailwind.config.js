/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#071A2B",
        navyDark: "#0B253A",
        navyCard: "rgba(11, 37, 58, 0.65)",
        electric: "#2563EB",
        cyanGlow: "#22D3EE",
        orangeVibrant: "#FF7A18",
        orangeSoft: "#FFB86B",
        mutedText: "#9FB0C2",
        glassWhite: "rgba(255,255,255,0.08)",
        glassBorder: "rgba(34, 211, 238, 0.15)",
        successGreen: "#22C55E",
        warningYellow: "#F59E0B",
        dangerRed: "#EF4444"
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.4)',
        'glow-orange': '0 0 25px -5px rgba(255, 122, 24, 0.4)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
