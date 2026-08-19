/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",
          "blue-dark": "#1E40AF",
          "blue-light": "#EFF6FF",
          "blue-subtle": "#DBEAFE",
          orange: "#F97316",
          "orange-hover": "#EA580C",
          "orange-light": "#FFF7ED",
          "orange-subtle": "#FFEDD5",
          bg: "#F8FAFC",
          card: "#FFFFFF",
          text: "#0F172A",
          muted: "#64748B"
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(37, 99, 235, 0.08)',
        'float': '0 20px 40px -15px rgba(249, 115, 22, 0.15)',
        'glow-blue': '0 0 25px rgba(37, 99, 235, 0.25)',
        'glow-orange': '0 0 25px rgba(249, 115, 22, 0.25)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        checkmark: {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
          '70%': { transform: 'scale(1.2) rotate(0deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        }
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'slide-left': 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'checkmark': 'checkmark 0.5s ease-out forwards'
      }
    },
  },
  plugins: [],
}
