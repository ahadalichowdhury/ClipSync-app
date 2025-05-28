/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/src/**/*.{js,ts,jsx,tsx}',
    './src/renderer/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Windows 11 inspired color palette
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0078d4', // Windows 11 accent blue
          600: '#106ebe',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gray: {
          50: '#fafafa',
          100: '#f3f3f3',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Dark theme colors
        dark: {
          bg: {
            primary: '#202020',
            secondary: '#2c2c2c',
            tertiary: '#383838',
            elevated: '#404040',
          },
          text: {
            primary: '#ffffff',
            secondary: '#cccccc',
            tertiary: '#999999',
          },
          border: '#484848',
        },
        // Light theme colors
        light: {
          bg: {
            primary: '#ffffff',
            secondary: '#f3f3f3',
            tertiary: '#fafafa',
            elevated: '#ffffff',
          },
          text: {
            primary: '#323130',
            secondary: '#605e5c',
            tertiary: '#8a8886',
          },
          border: '#e1dfdd',
        },
        // Semantic colors
        success: '#107c10',
        warning: '#ff8c00',
        error: '#d13438',
        info: '#0078d4',
      },
      fontFamily: {
        sans: [
          'Segoe UI Variable',
          'Segoe UI',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        mono: [
          'Cascadia Code',
          'Consolas',
          'Monaco',
          'Menlo',
          'monospace'
        ],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        // Windows 11 specific shadows
        'fluent-sm': '0 2px 4px rgba(0, 0, 0, 0.14), 0 0px 2px rgba(0, 0, 0, 0.12)',
        'fluent': '0 4px 8px rgba(0, 0, 0, 0.14), 0 0px 2px rgba(0, 0, 0, 0.12)',
        'fluent-lg': '0 8px 16px rgba(0, 0, 0, 0.14), 0 0px 2px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-out': 'fadeOut 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    // Custom utilities for Windows 11 design
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.acrylic': {
          'backdrop-filter': 'blur(20px) saturate(180%)',
          'background-color': 'rgba(255, 255, 255, 0.7)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.acrylic-dark': {
          'backdrop-filter': 'blur(20px) saturate(180%)',
          'background-color': 'rgba(32, 32, 32, 0.8)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(0, 0, 0, 0.2)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.fluent-button': {
          'transition': 'all 0.2s ease',
          'border-radius': '8px',
          'padding': '8px 16px',
          'font-weight': '600',
          'font-size': '14px',
          'line-height': '20px',
          '&:hover': {
            'transform': 'translateY(-1px)',
            'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.14), 0 0px 2px rgba(0, 0, 0, 0.12)',
          },
          '&:active': {
            'transform': 'translateY(0)',
          },
        },
        '.fluent-card': {
          'background-color': theme('colors.white'),
          'border-radius': '8px',
          'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.14), 0 0px 2px rgba(0, 0, 0, 0.12)',
          'border': '1px solid rgba(0, 0, 0, 0.05)',
          'transition': 'all 0.2s ease',
          '&:hover': {
            'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.14), 0 0px 2px rgba(0, 0, 0, 0.12)',
            'transform': 'translateY(-1px)',
          },
        },
        '.fluent-card-dark': {
          'background-color': theme('colors.dark.bg.secondary'),
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
} 