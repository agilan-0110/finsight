/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F8FAFC', // Crisp light background (Slate 50)
        surface: {
          DEFAULT: '#FFFFFF', // Pure white card surfaces
          subtle: '#F1F5F9',  // Subtle secondary panel (Slate 100)
          hover: '#F8FAFC',
          muted: '#E2E8F0',
        },
        border: {
          DEFAULT: '#E2E8F0', // Primary clean border (Slate 200)
          subtle: '#F1F5F9',
          strong: '#CBD5E1', // Structural border (Slate 300)
        },
        ink: {
          DEFAULT: '#0F172A', // High contrast primary text (Slate 900)
          secondary: '#334155', // Secondary body text (Slate 700)
          muted: '#64748B', // Tertiary / labels (Slate 500)
          faint: '#94A3B8', // Very light hints (Slate 400)
        },
        brand: {
          DEFAULT: '#1E3A8A', // Deep institutional navy (Blue 900)
          accent: '#2563EB',  // Royal executive blue (Blue 600)
          light: '#EFF6FF',   // Subtle blue pill background (Blue 50)
          border: '#BFDBFE',  // Light blue border (Blue 200)
        },
        profit: {
          DEFAULT: '#047857', // Deep, accessible emerald (Emerald 700)
          bg: '#ECFDF5',      // Soft emerald pill (Emerald 50)
          border: '#A7F3D0',  // Emerald border (Emerald 200)
        },
        loss: {
          DEFAULT: '#B91C1C', // Deep, accessible crimson (Red 700)
          bg: '#FEF2F2',      // Soft crimson pill (Red 50)
          border: '#FECACA',  // Crimson border (Red 200)
        },
        warning: {
          DEFAULT: '#B45309', // Deep amber (Amber 700)
          bg: '#FFFBEB',      // Soft amber pill (Amber 50)
          border: '#FDE68A',  // Amber border (Amber 200)
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xxs': '0.6875rem', // 11px
      }
    },
  },
  plugins: [],
}
