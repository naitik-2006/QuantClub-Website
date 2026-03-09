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
        obsidian: '#0A0A0A',
        'cyber-black': '#050505',
        'electric-cyan': '#00FFFF',
        'cyan-dim': '#00CCCC',
        silver: '#9CA3AF',
        'silver-bright': '#D1D5DB',
        'card-bg': '#0D0D0D',
        'card-border': 'rgba(0,255,255,0.12)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,255,255,0.35), 0 0 60px rgba(0,255,255,0.1)',
        'glow-cyan-sm': '0 0 8px rgba(0,255,255,0.4)',
        'glow-cyan-lg': '0 0 40px rgba(0,255,255,0.5), 0 0 80px rgba(0,255,255,0.2)',
        'card': '0 0 0 1px rgba(0,255,255,0.1), 0 4px 24px rgba(0,0,0,0.6)',
        'card-hover': '0 0 0 1px rgba(0,255,255,0.5), 0 8px 40px rgba(0,0,0,0.8), 0 0 30px rgba(0,255,255,0.1)',
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)`,
        'radial-glow': 'radial-gradient(ellipse at center, rgba(0,255,255,0.06) 0%, transparent 70%)',
        'hero-gradient': 'linear-gradient(180deg, #000000 0%, #050505 50%, #000000 100%)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
