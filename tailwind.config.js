/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0C0C0C',
        chalk: '#D7E2EA',
        signal: '#D9FF4A',
        ember: '#FF7A1A',
        cyanline: '#58E6FF',
        orchid: '#C68CFF',
      },
      boxShadow: {
        glow: '0 0 80px rgba(217, 255, 74, 0.18)',
        panel: '0 24px 80px rgba(0, 0, 0, 0.34)',
      },
    },
  },
  plugins: [],
}
