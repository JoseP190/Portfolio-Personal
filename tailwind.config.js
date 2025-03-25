/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#FF1F1F',
        'secondary': '#1a1a1a',
        'dark': '#0a0a0a',
        'light': '#ffffff',
        'accent': '#FF1F1F',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-in': 'slideIn 1s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
} 