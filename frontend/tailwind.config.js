/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Financial Times / Bloomberg Warm Luxury Canvas
        canvas: '#F6F5F2', // Warm parchment / alabaster backdrop
        surface: {
          DEFAULT: '#FFFFFF', // Pure crisp white cards
          subtle: '#FAF8F5',  // Subtle warm secondary panel (Stone 50 tint)
          hover: '#F5F2EB',   // Warm hover state
          muted: '#EFECE6',
        },
        border: {
          DEFAULT: '#E5E0D8', // Warm structural card border
          subtle: '#EDE8E0',
          strong: '#D4CDC0', // High-contrast border
        },
        ink: {
          DEFAULT: '#1C1917', // Deep warm onyx / stone 900 (ultra legible)
          secondary: '#44403C', // Warm body text (Stone 700)
          muted: '#78716C', // Warm tertiary / labels (Stone 500)
          faint: '#A8A29E', // Subtle hints (Stone 400)
        },
        brand: {
          DEFAULT: '#1E3A8A', // Deep institutional navy (Blue 900)
          accent: '#2563EB',  // Royal executive blue (Blue 600)
          light: '#EFF6FF',   // Subtle blue pill background (Blue 50)
          border: '#BFDBFE',  // Light blue border
        },
        profit: {
          DEFAULT: '#065F46', // Deep Wall Street emerald (Emerald 800)
          bg: '#ECFDF5',      // Soft emerald pill
          border: '#A7F3D0',  // Emerald border
        },
        loss: {
          DEFAULT: '#991B1B', // Deep British crimson / oxblood (Red 800)
          bg: '#FEF2F2',      // Soft crimson pill
          border: '#FECACA',  // Crimson border
        },
        warning: {
          DEFAULT: '#92400E', // Deep warm amber (Amber 800)
          bg: '#FFFBEB',      // Soft amber pill
          border: '#FDE68A',  // Amber border
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 10px -2px rgba(28, 25, 23, 0.05), 0 1px 3px rgba(28, 25, 23, 0.03)',
        'card-hover': '0 6px 18px -4px rgba(28, 25, 23, 0.08), 0 2px 6px rgba(28, 25, 23, 0.04)',
      }
    },
  },
  plugins: [],
}
