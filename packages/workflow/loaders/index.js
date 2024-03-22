/* eslint-disable global-require */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import css from './loader-css';
import less from './loader-less';
import scss from './loader-scss';
import postcss from './loader-postcss';
import images from './rule-images';

export default {
  css,
  less,
  scss,
  postcss,
  images,
  MiniCssExtractPlugin
};
