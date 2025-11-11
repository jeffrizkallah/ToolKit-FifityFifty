import type { Config } from 'tailwindcss';
// @ts-ignore - tailwindcss-rtl doesn't have types
import tailwindcssRtl from 'tailwindcss-rtl';
// @ts-ignore - tailwindcss-logical doesn't have types  
import tailwindcssLogical from 'tailwindcss-logical';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // FiftyFifty Brand Colors
        brand: {
          primary: {
            DEFAULT: '#0063AF',
            light: '#4A8FCA',
            dark: '#004A85',
            50: '#E6F2FA',
            100: '#CCE5F5',
            200: '#99CBEB',
            300: '#66B1E1',
            400: '#3397D7',
            500: '#0063AF',
            600: '#00558F',
            700: '#00476F',
            800: '#00394F',
            900: '#002B2F',
          },
          secondary: {
            DEFAULT: '#EC1C24',
            light: '#F15A60',
            dark: '#C01318',
            50: '#FEE7E8',
            100: '#FDCFD1',
            200: '#FB9FA3',
            300: '#F96F75',
            400: '#F73F47',
            500: '#EC1C24',
            600: '#C01318',
            700: '#940E12',
            800: '#680A0C',
            900: '#3C0506',
          },
        },
        
        // Neutral Colors
        neutral: {
          light: '#F6F6F6',
          medium: '#DDDDDD',
          dark: '#222222',
          50: '#FAFAFA',
          100: '#F6F6F6',
          200: '#EEEEEE',
          300: '#DDDDDD',
          400: '#CCCCCC',
          500: '#999999',
          600: '#666666',
          700: '#444444',
          800: '#222222',
          900: '#111111',
        },
        
        // Semantic Colors
        success: {
          DEFAULT: '#10B981',
          light: '#6EE7B7',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FCA5A5',
          dark: '#DC2626',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#93C5FD',
          dark: '#2563EB',
        },
        // Accent colors for interactive elements (Liquid Glass)
        accent: {
          green: '#10B981',
          blue: '#3B82F6',
          orange: '#F59E0B',
        },
      },
      
      fontFamily: {
        sans: [
          'SF Pro Display',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        base: ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      
      borderRadius: {
        '4xl': '2rem',
        'pill': '9999px',
      },
      blur: {
        'glass-bg': '50px',
        'glass-layer': '15px',
        'glass-small': '10px',
        'glass-shadow': '70px',
        'glass-shadow-lg': '80px',
      },
      
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        // Liquid Glass shadows
        'glass-inner': 'inset 3px -2px 17px rgba(255, 255, 255, 0.6), inset -6px 6px 15px rgba(255, 255, 255, 0.5)',
        'glass-inner-lg': 'inset 6px -4px 20px rgba(255, 255, 255, 0.7), inset -8px 8px 20px rgba(255, 255, 255, 0.6)',
        'glass-float': '0 4px 64px rgba(0, 0, 0, 0.25), 0 0 80px rgba(0, 0, 0, 0.2)',
        'glass-float-lg': '0 4px 64px rgba(0, 0, 0, 0.3), 0 0 80px rgba(0, 0, 0, 0.25)',
        'glass-float-sm': '0 2px 32px rgba(0, 0, 0, 0.12), 0 0 40px rgba(0, 0, 0, 0.08)',
      },
      
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
      },
    },
  },
  plugins: [
    tailwindcssRtl,
    tailwindcssLogical,
  ],
};

export default config;

