module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Green palette: light -> dark
         primary: '#386641',    // xanh đậm
        secondary: '#6a994e',  // xanh lá
        accent: '#a7c957',     // xanh nhạt
        background: '#f2e8cf', // nền be
        danger: '#bc4749'      // đỏ nhấn
      }
    }
  },
  plugins: []
};
