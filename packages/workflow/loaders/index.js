/* eslint-disable global-require */
import css from './loader-css';
import less from './loader-less';
import scss from './loader-scss';
import postcss from './loader-postcss';
import images from './rule-images';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  css,
  less,
  scss,
  postcss,
  images,
  MiniCssExtractPlugin
};
