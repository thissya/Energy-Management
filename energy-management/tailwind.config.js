export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 5s linear infinite',
      },
      colors:{
        myblack: 'rgb(22,21,22)',
        navbar : '#3D52A0',
        tilebox : '#7091E6',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'arial': ['Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}