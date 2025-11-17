/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Refined Futuristic Palette
        'primary': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        'neutral': {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          850: '#1e1e21',
          900: '#18181b',
          925: '#121214',
          950: '#0a0a0b',
        },
        'accent': {
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          blue: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        // Subtle, refined shadows
        'xs': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.25)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.3)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.35)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.4)',
        '2xl': '0 16px 32px rgba(0, 0, 0, 0.45)',
        // Glow effects - very subtle
        'glow-xs': '0 0 10px rgba(6, 182, 212, 0.05)',
        'glow-sm': '0 0 20px rgba(6, 182, 212, 0.1)',
        'glow-md': '0 0 30px rgba(6, 182, 212, 0.15)',
        // Inner shadows for depth
        'inner-sm': 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
        'inner-md': 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        // Subtle gradients
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(139, 92, 246, 0.05))',
        'gradient-border': 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'subtle-pulse': 'subtlePulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      opacity: {
        '2': '0.02',
        '3': '0.03',
        '8': '0.08',
        '12': '0.12',
        '15': '0.15',
      }
    },
  },
  plugins: [],
}
