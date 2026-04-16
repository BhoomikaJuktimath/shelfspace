/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0a',
        'dark-card': '#111111',
        'dark-border': '#1a1a1a',
        'accent-blue': '#3b82f6',
        'accent-purple': '#8b5cf6',
        'text-primary': '#ffffff',
        'text-secondary': '#9ca3af',
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
