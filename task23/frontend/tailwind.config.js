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
          dark: '#0B0F19',
          card: '#111827',
          surface: '#1F2937',
          border: '#374151',
          primary: '#6366F1',    // Deep Indigo
          violet: '#8B5CF6',     // Electric Violet
          cyan: '#06B6D4',       // Cyan Accent
          blue: '#3B82F6',       // Blue Accent
          emerald: '#10B981',    // Success
          amber: '#F59E0B',      // Warning
          rose: '#F43F5E'        // Danger / Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'card-flip': 'flip 0.6s ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 1.5s infinite linear'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    },
  },
  plugins: [],
}
