/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Minimal Luxury Light Mode Theme
        canvas: '#F8FAFC', // Slate 50 clean light background
        surface: {
          DEFAULT: '#FFFFFF', // Pure white card surfaces
          subtle: '#F1F5F9',  // Slate 100 subtle secondary backgrounds
          hover: '#E2E8F0',   // Slate 200 hover state
          muted: '#CBD5E1',   // Slate 300 muted elements
        },
        border: {
          DEFAULT: '#E2E8F0', // Slate 200 crisp card borders
          subtle: '#F1F5F9',  // Slate 100 dividers
          strong: '#CBD5E1',  // Slate 300 high contrast borders
        },
        ink: {
          DEFAULT: '#0F172A', // Slate 900 high-contrast primary text (crisp for readability)
          secondary: '#334155', // Slate 700 body text
          muted: '#64748B', // Slate 500 secondary labels
          faint: '#94A3B8', // Slate 400 subtle placeholders
        },
        brand: {
          DEFAULT: '#1E293B', // Slate 800 executive primary
          accent: '#4F46E5',  // Indigo 600 AI accent
          light: '#EEF2FF',   // Indigo 50 light badge
          border: '#C7D2FE',  // Indigo 200 border
        },
        profit: {
          DEFAULT: '#059669', // Emerald 600 crisp gain
          bg: '#ECFDF5',      // Emerald 50 soft pill
          border: '#A7F3D0',  // Emerald 200 border
        },
        loss: {
          DEFAULT: '#E11D48', // Rose 600 crisp loss
          bg: '#FFF1F2',      // Rose 50 soft pill
          border: '#FECDD3',  // Rose 200 border
        },
        warning: {
          DEFAULT: '#D97706', // Amber 600 alert
          bg: '#FFFBEB',      // Amber 50 soft pill
          border: '#FDE68A',  // Amber 200 border
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'elevated': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
