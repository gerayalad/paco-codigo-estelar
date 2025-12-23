/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cosmic: {
          deep: '#0a0a1a',
          indigo: '#1a1a3e',
          violet: '#2d1b4e',
          cyan: '#00d4ff',
          gold: '#ffd700',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 5px rgba(0, 212, 255, 0.5))' },
          '100%': { filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
