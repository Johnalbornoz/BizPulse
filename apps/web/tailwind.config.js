/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // AiBo Brand Colors
        'aibo-blue': '#286CBE',
        'aibo-blue-light': '#4C8AD6',
        'aibo-navy': '#1D3C6A',
        'aibo-signal': '#12B8A6',
        'aibo-signal-dark': '#0E9384',
        'aibo-ink': '#0E2038',
        'aibo-cloud': '#F6F9FC',
        'aibo-mist': '#E3EAF3',
        'aibo-line': '#CBD7E5',
        'aibo-slate': '#5B6B7E',

        // Semantic aliases for consistency
        primary: '#286CBE',     // aibo-blue
        secondary: '#1D3C6A',   // aibo-navy
        accent: '#12B8A6',      // aibo-signal
        success: '#12B8A6',     // aibo-signal
        warning: '#C26E19',     // warm
        error: '#C23B4A',       // error red from guide

        // Grayscale
        neutral: {
          50: '#F6F9FC',   // aibo-cloud
          100: '#E3EAF3',  // aibo-mist
          200: '#CBD7E5',  // aibo-line
          300: '#A8B5C6',
          400: '#7A8FA3',
          500: '#5B6B7E',  // aibo-slate
          600: '#4A5A6E',
          700: '#374151',
          800: '#1D3C6A',  // aibo-navy
          900: '#0E2038',  // aibo-ink
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        'm': '0.5rem',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideIn: 'slideIn 0.6s ease-out',
        slideInFromLeft: 'slideInFromLeft 0.5s ease-out',
        slideInFromRight: 'slideInFromRight 0.5s ease-out',
        slideInFromTop: 'slideInFromTop 0.5s ease-out',
        scaleIn: 'scaleIn 0.5s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        shimmer: 'shimmer 3s infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInFromLeft: {
          'from': { opacity: '0', transform: 'translateX(-30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInFromRight: {
          'from': { opacity: '0', transform: 'translateX(30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInFromTop: {
          'from': { opacity: '0', transform: 'translateY(-30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
