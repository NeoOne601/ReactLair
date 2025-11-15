/** @type {import('tailwindcss').Config} */
export default {
  // This content path is from your project plan
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode via a class
  theme: {
    extend: {
      // Add the animations from our previous project
      animation: {
        'flash': 'flash 1s ease-in-out',
        'flash-blueprint': 'flash-blueprint 1.5s ease-in-out',
      },
      keyframes: {
        flash: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 5px rgba(255, 255, 255, 0)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 20px rgba(74, 222, 128, 0.7)' },
        },
        'flash-blueprint': {
          '0%, 100%': { 
            borderColor: 'rgb(55 65 81)', // border-gray-600
            boxShadow: '0 0 0px rgba(59, 130, 246, 0)' 
          },
          '50%': { 
            borderColor: 'rgb(59 130 246)', // border-blue-500
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)' 
          },
        }
      }
    },
  },
  plugins: [],
}
