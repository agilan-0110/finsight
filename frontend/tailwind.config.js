/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact Stitch Material-Dynamic Design System Palette
        "background": "#fcf8f9",
        "surface": "#fcf8f9",
        "surface-bright": "#fcf8f9",
        "surface-dim": "#dbd9dd",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3f4",
        "surface-container": "#f0edef",
        "surface-container-high": "#eae7ea",
        "surface-container-highest": "#e4e2e5",
        "surface-variant": "#e4e2e5",

        "primary": "#585f6b",
        "primary-dim": "#4c535f",
        "primary-container": "#dde2f2",
        "primary-fixed": "#dde2f2",
        "primary-fixed-dim": "#ced4e4",
        "on-primary": "#f6f7ff",
        "on-primary-container": "#4c525e",
        "on-primary-fixed": "#393f4c",

        "secondary": "#5d5f65",
        "secondary-dim": "#515359",
        "secondary-container": "#e1e2e9",
        "secondary-fixed": "#e1e2e9",
        "secondary-fixed-dim": "#d3d4db",
        "on-secondary": "#f8f8ff",
        "on-secondary-container": "#505257",

        "tertiary": "#5d5d78",
        "tertiary-dim": "#51516c",
        "tertiary-container": "#d9d7f8",
        "tertiary-fixed": "#d9d7f8",
        "on-tertiary": "#fbf7ff",
        "on-tertiary-container": "#4a4a65",

        "on-surface": "#323235",
        "on-surface-variant": "#5f5f61",
        "on-background": "#323235",
        "outline": "#7b7a7d",
        "outline-variant": "#b3b1b4",

        "error": "#9f403d",
        "error-container": "#fe8983",
        "on-error": "#fff7f6",
        "on-error-container": "#752121",

        // High contrast semantic utilities
        gain: {
          DEFAULT: '#059669',
          bg: '#e1e2e9',
          text: '#2e5b4b',
        },
        drop: {
          DEFAULT: '#9f403d',
          bg: '#f6e4e3',
          text: '#752121',
        }
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['"Public Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'stitch-sm': '0 1px 2px 0 rgba(50, 50, 53, 0.05)',
        'stitch': '0 1px 3px 0 rgba(50, 50, 53, 0.08), 0 1px 2px -1px rgba(50, 50, 53, 0.04)',
        'stitch-lg': '0 10px 15px -3px rgba(50, 50, 53, 0.08), 0 4px 6px -4px rgba(50, 50, 53, 0.04)',
      }
    },
  },
  plugins: [],
}
