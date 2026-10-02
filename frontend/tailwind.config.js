/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch "Warm Clarity" Design System for FinSight Beginners
        "background": "#f8fafc",
        "surface": "#ffffff",
        "surface-bright": "#ffffff",
        "surface-dim": "#f1f5f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8fafc",
        "surface-container": "#f1f5f9",
        "surface-container-high": "#e2e8f0",
        "surface-container-highest": "#cbd5e1",
        "surface-variant": "#e2e8f0",

        // Botanical Emerald & Mint Primary Palette
        "primary": "#0f766e",
        "primary-dim": "#115e59",
        "primary-container": "#ccfbf1",
        "primary-fixed": "#9cf2e8",
        "primary-fixed-dim": "#80d5cb",
        "on-primary": "#ffffff",
        "on-primary-container": "#0f766e",
        "on-primary-fixed": "#00201d",

        // Luminous Mint Teal Secondary Palette
        "secondary": "#14b8a6",
        "secondary-dim": "#0d9488",
        "secondary-container": "#e6fffa",
        "secondary-fixed": "#71f8e4",
        "secondary-fixed-dim": "#4fdbc8",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#006f64",

        // Warm Amber Celebration & Milestone Palette
        "tertiary": "#f59e0b",
        "tertiary-dim": "#d97706",
        "tertiary-container": "#fef3c7",
        "tertiary-fixed": "#ffddb8",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#78350f",

        // Deep Slate Core Ink Typography
        "on-surface": "#0f172a",
        "on-surface-variant": "#475569",
        "on-background": "#0f172a",
        "outline": "#94a3b8",
        "outline-variant": "#e2e8f0",

        // Semantic alerts
        "error": "#ef4444",
        "error-container": "#fee2e2",
        "on-error": "#ffffff",
        "on-error-container": "#991b1b",

        gain: {
          DEFAULT: '#059669',
          bg: '#ecfdf5',
          text: '#065f46',
        },
        drop: {
          DEFAULT: '#e11d48',
          bg: '#fff1f2',
          text: '#9f1239',
        }
      },
      fontFamily: {
        headline: ['Manrope', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Manrope', '"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        label: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'stitch-sm': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'stitch': '0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px -4px rgba(15, 118, 110, 0.05)',
        'stitch-lg': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 12px 24px -6px rgba(15, 118, 110, 0.09)',
        'stitch-xl': '0 20px 32px -8px rgba(15, 23, 42, 0.08), 0 8px 16px -4px rgba(15, 118, 110, 0.06)',
      }
    },
  },
  plugins: [],
}
