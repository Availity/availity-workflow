/* eslint-disable global-require */
export default {
  css: import('./loader-css'),
  less: import('./loader-less'),
  scss: import('./loader-scss'),
  postcss: import('./loader-postcss'),
  images: import('./rule-images'),
  MiniCssExtractPlugin: import('mini-css-extract-plugin')
};
