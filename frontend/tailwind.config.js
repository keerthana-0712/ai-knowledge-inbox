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
        turium: {
          black: '#050507',
          surface: '#090a0f',
          card: '#0f1117',
          'card-hover': '#141720',
          border: '#1c1f2b',
          'border-subtle': 'rgba(255, 255, 255, 0.07)',
          purple: '#6100ff',
          'purple-hover': '#5200db',
          'purple-muted': 'rgba(97, 0, 255, 0.12)',
          'purple-border': 'rgba(97, 0, 255, 0.24)',
          text: '#f4f4f6',
          muted: '#8e929f',
          subtle: '#5a5e6d',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
