/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Purple Backgrounds
        dark: {
          DEFAULT: '#090514', // Main background
          card: '#130C25',    // Card background
          border: '#2A1F45',  // Border color
          hover: '#1D1336'    // Hover background
        },
        // Neon Accents
        neon: {
          cyan: '#00F0FF',    // Primary neon accent
          purple: '#9D00FF',  // Secondary neon accent
          pink: '#FF0055'     // Highlight accent
        },
        // Text Colors
        text: {
          primary: '#FFFFFF',
          secondary: '#A19BAD',
          muted: '#635B77'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.4), 0 0 20px rgba(0, 240, 255, 0.2)',
        'neon-purple': '0 0 10px rgba(157, 0, 255, 0.4), 0 0 20px rgba(157, 0, 255, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'purple-gradient': 'linear-gradient(to right, #9D00FF, #00F0FF)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

