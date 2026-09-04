/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#071A2B',
          dark: '#030E18',
          card: 'rgba(15, 34, 54, 0.75)',
          border: 'rgba(34, 211, 238, 0.15)',
          hover: '#0C263F'
        },
        electric: {
          DEFAULT: '#2563EB',
          glow: 'rgba(37, 99, 235, 0.35)',
          hover: '#1D4ED8'
        },
        cyber: {
          DEFAULT: '#22D3EE',
          glow: 'rgba(34, 211, 238, 0.35)',
          hover: '#06B6D4'
        },
        vibrant: {
          DEFAULT: '#FF7A18',
          hover: '#E06305'
        },
        softwhite: '#F8FAFC',
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          purple: '#8B5CF6'
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'cyan-glow': '0 0 20px rgba(34, 211, 238, 0.3)',
        'blue-glow': '0 0 20px rgba(37, 99, 235, 0.4)',
        'orange-glow': '0 0 20px rgba(255, 122, 24, 0.4)',
        'card-lift': '0 12px 28px rgba(0, 0, 0, 0.45)'
      },
      backdropBlur: {
        'xs': '2px'
      }
    },
  },
  plugins: [],
}
