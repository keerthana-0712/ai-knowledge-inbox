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
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
