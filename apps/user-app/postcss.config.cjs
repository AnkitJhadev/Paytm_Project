const { default: tailwindConfig } = require("./tailwind.config")

module.exports = {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    }
  }
