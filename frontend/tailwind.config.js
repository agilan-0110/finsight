/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch "Quiet Prudence" Design System
        background: "#fbf8fc",
        surface: "#ffffff",
        "surface-bright": "#fbf8fc",
        "surface-dim": "#f0edf1",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f2f7",
        "surface-container": "#f0edf1",
        "surface-container-high": "#eae7eb",
        "surface-container-highest": "#e4e1e6",
        "surface-variant": "#e4e1e6",

        // Quiet Pine / Emerald Accent
        primary: "#0f766e",
        "primary-dim": "#0d655f",
        "primary-container": "#005c55",
        "on-primary": "#ffffff",
        "on-primary-container": "#a3faef",

        // Muted Secondary Slate
        secondary: "#5e5e67",
        "secondary-dim": "#46464f",
        "secondary-container": "#e0dee9",
        "on-secondary": "#ffffff",

        // Core Ink Typography & Borders
        "on-surface": "#1b1b1e",
        "on-surface-variant": "#52525b",
        outline: "#6e7977",
        "outline-variant": "#e5e7eb",

        // Alert accents
        tertiary: "#d97706",
        error: "#dc2626",
        "error-container": "#fee2e2",

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
        headline: ['"Hanken Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Hanken Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Hanken Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        label: ['"Hanken Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'stitch-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'stitch': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'stitch-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 10px 20px -3px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
