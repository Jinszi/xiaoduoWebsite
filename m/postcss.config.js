const px2rem = require('postcss-px2rem')

module.exports = {
  plugins: [
    px2rem({remUnit: 75, remPrecision: 8}),
    require('autoprefixer'),
  ],
}
