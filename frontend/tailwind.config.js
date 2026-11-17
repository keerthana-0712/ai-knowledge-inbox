/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        turium: {
          bg: '#fcfbf9',
          paper: '#ffffff',
          surface: '#f5f4ef',
          warm: '#f0eee6',
          border: '#e4e0d7',
          'border-strong': '#d4cfc3',
          divider: '#ece8df',
          ink: '#111114',
          body: '#39383c',
          slate: '#555359',
          muted: '#78757d',
          disabled: '#b5b2aa',
          purple: '#6100ff',
          'purple-hover': '#5200db',
          'purple-tint': '#f5f0ff',
          'purple-subtle': '#ece2ff',
          'purple-border': '#d9c6ff',
        },
      },
      fontFamily: {
        display: [
          '"Outfit"',
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        sans: [
          '"Plus Jakarta Sans"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 6px 18px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03)',
        'dropdown': '0 12px 30px -4px rgba(0, 0, 0, 0.09), 0 8px 12px -6px rgba(0, 0, 0, 0.04)',
        'glow-purple': '0 0 25px -4px rgba(97, 0, 255, 0.35)',
      },
    },
  },
  plugins: [],
}
