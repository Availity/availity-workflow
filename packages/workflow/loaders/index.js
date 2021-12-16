/* eslint-disable global-require */
module.exports = {
  css: require('./loader-css'),
  less: require('./loader-less'),
  scss: require('./loader-scss'),
  postcss: require('./loader-postcss'),
  images: require('./rule-images'),
  MiniCssExtractPlugin: require('mini-css-extract-plugin')
};
