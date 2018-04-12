module.exports = {
  css: require('./loader-css'),
  less: require('./loader-less'),
  scss: require('./loader-scss'),
  postcss: require('./loader-postcss'),
  fonts: require('./rule-fonts'),
  images: require('./rule-images'),
  MiniCssExtractPlugin: require('mini-css-extract-plugin')
};
