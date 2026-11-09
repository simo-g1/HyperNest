/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './js/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1',
          400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c',
          800: '#292524', 900: '#1c1917', 950: '#0c0a09',
        },
        skyBrand: {
          50: '#fdf6ec', 100: '#f8e7cd', 200: '#f0cd9c', 300: '#e5ae6a',
          400: '#d58d3f', 500: '#b5651d', 600: '#9a5217', 700: '#7c4214',
          800: '#5f3411', 900: '#44250c',
        },
        cream: {
          50: '#fbf7ef', 100: '#f3eee4', 200: '#e7dcc8',
        },
      },
      animation: {
        'gradient-wave': 'gradientWave 8s ease infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        gradientWave: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};
