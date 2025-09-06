/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(195, 70%, 40%)',
        accent: 'hsl(45, 90%, 50%)',
        bg: 'hsl(200, 30%, 98%)',
        surface: 'hsl(200, 30%, 100%)',
        'text-primary': 'hsl(200, 30%, 10%)',
        'text-secondary': 'hsl(200, 30%, 30%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 30%, 20%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}