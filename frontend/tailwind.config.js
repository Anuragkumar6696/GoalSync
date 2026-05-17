/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Blue
          dark: '#2563eb',
        },
        secondary: {
          DEFAULT: '#6366f1', // Indigo
          dark: '#4f46e5',
        },
        success: '#22c55e', // Green
        warning: '#f59e0b', // Yellow
        danger: '#ef4444', // Red
      }
    },
  },
  plugins: [],
}
