/* eslint-disable global-require */
module.exports = {
  css: require('./loader-css'),
  less: require('./loader-less'),
  scss: require('./loader-scss'),
  postcss: require('./loader-postcss'),
  fonts: require('./rule-fonts'),
  images: require('./rule-images'),
  eslint: require('./loader-eslint'),
  MiniCssExtractPlugin: require('mini-css-extract-plugin')
};
