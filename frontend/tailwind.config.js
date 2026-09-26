/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0B0F17', // Deep Canvas Background
          900: '#111827',
          850: '#161F30', // Surface Card
          800: '#1E293B', // Elevated Hover Card
          750: '#223049', // Primary Border
          700: '#334155', // Muted Border
          600: '#475569',
          400: '#94A3B8', // Subdued labels
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',  // Pure Ice White Text
        },
        profit: {
          DEFAULT: '#10B981', // Emerald 500
          light: '#34D399',
          dark: '#059669',
          bg: 'rgba(16, 185, 129, 0.12)',
        },
        loss: {
          DEFAULT: '#EF4444', // Crimson 500
          light: '#F87171',
          dark: '#DC2626',
          bg: 'rgba(239, 68, 68, 0.12)',
        },
        warning: {
          DEFAULT: '#F59E0B', // Amber 500
          light: '#FBBF24',
          bg: 'rgba(245, 158, 11, 0.12)',
        },
        accent: {
          DEFAULT: '#38BDF8', // Cyan 400
          blue: '#3B82F6',
          dark: '#0284C7',
          bg: 'rgba(56, 189, 248, 0.12)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
