/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080d1a',
        ink2: '#0c1220',
        ink3: '#101828',
        gold: '#c8a84b',
        'gold-light': '#e2c87a',
        'gold-pale': '#f5e9c0',
        cream: '#e8e0ce',
        cream2: '#b8a88a',
        cream3: '#7a6e58',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
