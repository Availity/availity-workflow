/* eslint-disable global-require */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import css from './loader-css.js';
import less from './loader-less.js';
import scss from './loader-scss.js';
import postcss from './loader-postcss.js';
import images from './rule-images.js';

export default {
  css,
  less,
  scss,
  postcss,
  images,
  MiniCssExtractPlugin
};
