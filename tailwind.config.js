module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Green palette: light -> dark
        primary: '#34d399', // emerald-400 (light green)
        secondary: '#059669' // emerald-600 (darker green)
      }
    }
  },
  plugins: []
};
