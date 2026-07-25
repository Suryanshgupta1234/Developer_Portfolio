/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#2563eb',
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        accent: {
          DEFAULT: '#3b82f6',
          blue: '#2563eb',
          purple: '#7c3aed',
          cyan: '#06b6d4',
        },
        glass: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        muted: 'rgba(255,255,255,0.5)',
        card: 'rgba(255,255,255,0.03)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #000000 0%, #0a0a1a 50%, #000000 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'blue-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #06b6d4 100%)',
        'glow-gradient': 'radial-gradient(ellipse at center, rgba(37,99,235,0.3) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(37,99,235,0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(37,99,235,0.8)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          from: { transform: 'translateY(30px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          from: { transform: 'translateY(-30px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        blob: {
          '0%': { transform: 'translate(0px,0px) scale(1)' },
          '33%': { transform: 'translate(30px,-50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px,20px) scale(0.9)' },
          '100%': { transform: 'translate(0px,0px) scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 40px rgba(37,99,235,0.4)',
        'glow-sm': '0 0 20px rgba(37,99,235,0.2)',
        'glow-lg': '0 0 80px rgba(37,99,235,0.5)',
        card: '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.7)',
        glass: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
