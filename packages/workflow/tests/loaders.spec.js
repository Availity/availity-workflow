import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import css from '../loaders/loader-css.js';
import scss from '../loaders/loader-scss.js';
import less from '../loaders/loader-less.js';
import postcss from '../loaders/loader-postcss.js';
import images from '../loaders/rule-images.js';
import loaders from '../loaders/index.js';

describe('loader-css', () => {
  it('has development and production configs', () => {
    expect(css).toHaveProperty('development');
    expect(css).toHaveProperty('production');
  });

  it('test regex matches .css files', () => {
    expect(css.development.test.test('app.css')).toBe(true);
    expect(css.production.test.test('app.css')).toBe(true);
    expect(css.development.test.test('app.scss')).toBe(false);
    expect(css.development.test.test('app.less')).toBe(false);
  });

  it('development config uses style-loader as first loader', () => {
    expect(css.development.use[0]).toBe('style-loader');
  });

  it('production config uses MiniCssExtractPlugin.loader', () => {
    expect(css.production.use[0]).toEqual({
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: 'auto' },
    });
  });
});

describe('loader-scss', () => {
  it('has development and production configs', () => {
    expect(scss).toHaveProperty('development');
    expect(scss).toHaveProperty('production');
  });

  it('test regex matches .scss and .sass files', () => {
    expect(scss.development.test.test('app.scss')).toBe(true);
    expect(scss.development.test.test('app.sass')).toBe(true);
    expect(scss.production.test.test('app.scss')).toBe(true);
    expect(scss.production.test.test('app.sass')).toBe(true);
    expect(scss.development.test.test('app.css')).toBe(false);
    expect(scss.development.test.test('app.less')).toBe(false);
  });

  it('development config uses style-loader as first loader', () => {
    expect(scss.development.use[0]).toBe('style-loader');
  });

  it('production config uses MiniCssExtractPlugin.loader', () => {
    expect(scss.production.use[0]).toEqual({
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: 'auto' },
    });
  });
});

describe('loader-less', () => {
  it('has development and production configs', () => {
    expect(less).toHaveProperty('development');
    expect(less).toHaveProperty('production');
  });

  it('test regex matches .less files', () => {
    expect(less.development.test.test('app.less')).toBe(true);
    expect(less.production.test.test('app.less')).toBe(true);
    expect(less.development.test.test('app.css')).toBe(false);
    expect(less.development.test.test('app.scss')).toBe(false);
  });

  it('development config uses style-loader as first loader', () => {
    expect(less.development.use[0]).toBe('style-loader');
  });

  it('production config uses MiniCssExtractPlugin.loader', () => {
    expect(less.production.use[0]).toEqual({
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: 'auto' },
    });
  });
});

describe('loader-postcss', () => {
  it('has sourceMap enabled', () => {
    expect(postcss.options.sourceMap).toBe(true);
  });

  it('has postcssOptions with plugins array', () => {
    expect(postcss.options).toHaveProperty('postcssOptions');
    expect(Array.isArray(postcss.options.postcssOptions.plugins)).toBe(true);
    expect(postcss.options.postcssOptions.plugins.length).toBeGreaterThan(0);
  });

  it('specifies postcss-loader as the loader', () => {
    expect(postcss.loader).toBe('postcss-loader');
  });
});

describe('rule-images', () => {
  it('test regex matches .jpg, .jpeg, .png, .gif, .svg', () => {
    expect(images.test.test('photo.jpg')).toBe(true);
    expect(images.test.test('photo.jpeg')).toBe(true);
    expect(images.test.test('photo.JPG')).toBe(true);
    expect(images.test.test('icon.png')).toBe(true);
    expect(images.test.test('icon.PNG')).toBe(true);
    expect(images.test.test('anim.gif')).toBe(true);
    expect(images.test.test('logo.svg')).toBe(true);
    expect(images.test.test('logo.SVG')).toBe(true);
    expect(images.test.test('app.css')).toBe(false);
    expect(images.test.test('bundle.js')).toBe(false);
  });

  it('uses asset/resource type', () => {
    expect(images.type).toBe('asset/resource');
  });

  it('outputs to images/ directory', () => {
    expect(images.generator.filename).toBe('images/[name].[ext]');
  });
});

describe('loaders index', () => {
  it('re-exports css loader', () => {
    expect(loaders.css).toBe(css);
  });

  it('re-exports scss loader', () => {
    expect(loaders.scss).toBe(scss);
  });

  it('re-exports less loader', () => {
    expect(loaders.less).toBe(less);
  });

  it('re-exports postcss loader', () => {
    expect(loaders.postcss).toBe(postcss);
  });

  it('re-exports images rule', () => {
    expect(loaders.images).toBe(images);
  });

  it('re-exports MiniCssExtractPlugin', () => {
    expect(loaders.MiniCssExtractPlugin).toBe(MiniCssExtractPlugin);
  });
});
