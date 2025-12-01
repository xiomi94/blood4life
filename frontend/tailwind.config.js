/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1' }],        // 64px
        'h1': ['3.5rem', { lineHeight: '1.2' }],           // 56px
        'h2': ['3rem', { lineHeight: '1.3' }],             // 48px
        'h3': ['2.5rem', { lineHeight: '1.4' }],           // 40px
        'body': ['1.5rem', { lineHeight: '1.6' }],         // 24px
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],    // 18px
        'body-sm': ['1rem', { lineHeight: '1.5' }],        // 16px
        'caption': ['0.875rem', { lineHeight: '1.4' }],    // 14px
      },
    },
  },
  plugins: [],
}