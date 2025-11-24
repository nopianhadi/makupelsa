/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', /* transparent-gray */
        input: 'var(--color-input)', /* transparent-gray */
        ring: 'var(--color-ring)', /* purple-blue */
        background: 'var(--color-background)', /* near-white */
        foreground: 'var(--color-foreground)', /* rich-dark-blue-black */
        primary: {
          DEFAULT: 'var(--color-primary)', /* purple-blue */
          foreground: 'var(--color-primary-foreground)', /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* warm-pink */
          foreground: 'var(--color-secondary-foreground)', /* white */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* golden-orange */
          foreground: 'var(--color-accent-foreground)', /* rich-dark-blue-black */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* clear-red */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* vibrant-teal-green */
          foreground: 'var(--color-success-foreground)', /* white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* warm-amber */
          foreground: 'var(--color-warning-foreground)', /* rich-dark-blue-black */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* clear-red */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* barely-perceptible-blue */
          foreground: 'var(--color-muted-foreground)', /* medium-gray-blue */
        },
        surface: 'var(--color-surface)', /* barely-perceptible-blue */
        card: {
          DEFAULT: 'var(--color-card)', /* white */
          foreground: 'var(--color-card-foreground)', /* rich-dark-blue-black */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* white */
          foreground: 'var(--color-popover-foreground)', /* rich-dark-blue-black */
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        caption: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'elevation-0': 'var(--shadow-elevation-0)',
        'elevation-1': 'var(--shadow-elevation-1)',
        'elevation-3': 'var(--shadow-elevation-3)',
        'elevation-6': 'var(--shadow-elevation-6)',
        'elevation-8': 'var(--shadow-elevation-8)',
        'elevation-12': 'var(--shadow-elevation-12)',
      },
      transitionTimingFunction: {
        'material': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      transitionDuration: {
        'smooth': '200ms',
        'medium': '300ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}