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
          DEFAULT: '#1a1a2e',
          deep: '#1a1a2e',
          mid: '#16213e',
          dark: '#0f3460',
        },
        purple: {
          accent: '#6B3FA0',
          light: '#E8D5F5',
        },
        blue: {
          accent: '#6B3FA0',
          light: '#E8D5F5',
        },
        cream: {
          DEFAULT: '#F8F5F0',
          light: '#FDF9F3',
        },
        green: {
          trust: '#E2EFDA',
        },
        gold: {
          premium: '#C9A84C',
          light: '#F5EFD7',
        },
        success: '#E2EFDA',
        gray: {
          bg: '#F8F5F0',
          text: '#1A1A1A',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        'h1-desktop': ['clamp(48px, 5vw, 72px)', { lineHeight: '1.1', fontWeight: '800' }],
        'h1-mobile': ['36px', { lineHeight: '1.15', fontWeight: '800' }],
        'h2-desktop': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2-mobile': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3-desktop': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3-mobile': ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        body: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        section: '7.5rem',          /* 120px desktop */
        'section-mobile': '4rem',   /* 64px mobile */
      },
      maxWidth: {
        content: '1280px',
      },
      borderRadius: {
        DEFAULT: '16px',
        hero: '24px',
        sm: '8px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 12px 28px -4px rgba(107, 63, 160, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
