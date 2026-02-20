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
          DEFAULT: '#1A0A2E',
          dark: '#120720',
        },
        purple: {
          accent: '#6B3FA0',
          light: '#EDE5F7',
          deep: '#4A2B70',
        },
        // Keep blue-accent alias pointing to purple for component compatibility
        blue: {
          accent: '#6B3FA0',
          light: '#EDE5F7',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          dark: '#E8E0D4',
        },
        success: '#E2EFDA',
        gray: {
          bg: '#F8F5F0',
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
