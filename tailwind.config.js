/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          dark: '#0A1520',
        },
        blue: {
          accent: '#2D6A9F',
          light: '#BDD7EE',
        },
        success: '#E2EFDA',
        gray: {
          bg: '#F9FAFB',
          text: '#1A1A1A',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1-desktop': ['48px', { lineHeight: '1.15', fontWeight: '700' }],
        'h1-mobile': ['36px', { lineHeight: '1.15', fontWeight: '700' }],
        'h2-desktop': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2-mobile': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3-desktop': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3-mobile': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        // 8px base unit
        section: '5rem', // 80px for desktop section padding
        'section-mobile': '3rem', // 48px for mobile section padding
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
