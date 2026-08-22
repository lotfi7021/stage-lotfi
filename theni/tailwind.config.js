/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'on-secondary-container': '#294f83',
        'on-tertiary-fixed-variant': '#454748',
        'secondary-fixed': '#d5e3ff',
        'surface-container-lowest': '#ffffff',
        'on-secondary-fixed-variant': '#1f477b',
        error: '#ba1a1a',
        'tertiary-fixed': '#e1e3e4',
        'on-error-container': '#93000a',
        outline: '#727784',
        'on-tertiary': '#ffffff',
        'inverse-on-surface': '#ebf1fa',
        'on-primary-fixed': '#001a40',
        'primary-fixed': '#d7e2ff',
        'primary-fixed-dim': '#acc7ff',
        'on-secondary': '#ffffff',
        'on-tertiary-fixed': '#191c1d',
        'inverse-primary': '#acc7ff',
        'on-primary-fixed-variant': '#004491',
        primary: '#003f87',
        surface: '#f6f9ff',
        'surface-variant': '#dce3ec',
        'surface-bright': '#f6f9ff',
        'surface-dim': '#d4dbe3',
        'secondary-container': '#9fc2fe',
        'surface-container': '#e8eef7',
        'inverse-surface': '#2a3138',
        tertiary: '#3f4243',
        'on-tertiary-container': '#ced0d1',
        'on-surface-variant': '#424752',
        secondary: '#3a5f94',
        'outline-variant': '#c2c6d4',
        'on-error': '#ffffff',
        'surface-container-highest': '#dce3ec',
        'on-secondary-fixed': '#001b3c',
        'surface-container-low': '#eef4fd',
        background: '#f6f9ff',
        'on-background': '#151c22',
        'on-surface': '#151c22',
        'surface-container-high': '#e2e9f1',
        'surface-tint': '#115cb9',
        'tertiary-container': '#57595a',
        'on-primary': '#ffffff',
        'on-primary-container': '#bbd0ff',
        'secondary-fixed-dim': '#a7c8ff',
        'error-container': '#ffdad6',
        'primary-container': '#0056b3',
        'tertiary-fixed-dim': '#c5c7c8'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px'
      },
      spacing: {
        'margin-mobile': '16px',
        'container-max': '1200px',
        unit: '8px',
        gutter: '24px',
        'margin-desktop': '40px'
      },
      fontFamily: {
        sans: ['Work Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display-lg': ['Work Sans'],
        'body-lg': ['Work Sans'],
        'headline-lg-mobile': ['Work Sans'],
        'label-md': ['Work Sans'],
        'headline-md': ['Work Sans'],
        'headline-lg': ['Work Sans'],
        'body-md': ['Work Sans'],
        'label-sm': ['Work Sans']
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '500' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '600' }]
      },
      boxShadow: {
        ambient:
          '0 16px 32px -4px rgba(0, 51, 102, 0.08), 0 4px 16px -2px rgba(0, 51, 102, 0.04)',
        'ambient-sm':
          '0 8px 16px -4px rgba(0, 51, 102, 0.06), 0 2px 8px -2px rgba(0, 51, 102, 0.03)'
      },
      maxWidth: {
        'container-max': '1200px'
      }
    }
  },
  plugins: []
};