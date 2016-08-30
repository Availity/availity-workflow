'use strict';

const path = require('path');
const pathExists = require('path-exists');

const settings = {

  raw: null,

  maps() {
    return this.isDevelopment() ? 'source-map' : 'source-map';
  },

  entry() {

    if (this.isTesting()) {

      return {
        'index': './index.js'
      };

    }

    return {
      'index': './index.js',
      'vendor': './vendor.js'
    };
  },

  // Don’t use [chunkhash] in development since this will increase compilation time
  // In production, [chunkhash] generate hashes depending on the file contents this if
  // the contents don't change the file could potentially be cached in the browser.
  fileName() {
    return this.isDevelopment() ? '[name].js' : '[name]-[chunkhash].js';
  },

  css() {
    return this.isDevelopment() ? '[name].css' : '[name]-[chunkhash].css';
  },

  output() {
    return this.isDistribution() ?
      path.join(this.project(), 'dist') :
      path.join(this.project(), 'build');
  },

  packages() {
    return path.join(this.project(), './package.json');
  },

  project() {
    return process.cwd();
  },

  app() {
    return path.join(this.project(), 'project/app');
  },

  dest() {
    return this.isDistribution() ? path.join(this.project(), './dist') : path.join(this.project(), './build');
  },

  htmlWebpackConfig: (function() {
    var result;
    function getConfig() {
      if (!result) {
        console.log('generating results');
        var templatePath = './index.html';
        var faviconPath = './favicon.ico';
        var hasLocalTemplate = pathExists.sync(path.join(this.app(), templatePath));
        var hasLocalFavicon = pathExists.sync(path.join(this.app(), faviconPath));
        console.log('Using ' + (hasLocalTemplate ? 'user defined' : 'workflow') + ' template');
        console.log('Using ' + (hasLocalFavicon ? 'user defined' : 'workflow') + ' favicon');
        result = {
          template: hasLocalTemplate ? templatePath : path.relative(this.app(), path.join(__dirname, '../webpack', templatePath)),
          favicon: hasLocalFavicon ? faviconPath : path.relative(this.app(), path.join(__dirname, '../webpack', faviconPath))
        };
      }
      return result;
    }
    return getConfig;
  })(),

  ekko() {
    return {
      data: path.join(this.project(), 'project/data'),
      routes: path.join(this.project(), 'project/config/routes.json')
    };
  },

  servers() {
    return {
      app: {
        host: '127.0.0.1',
        port: 3000
      },
      web: {
        host: '127.0.0.1',
        port: 9999
      }
    };

  },

  environment() {
    return process.env.NODE_ENV || 'development';
  },

  isTesting() {
    return this.environment() === 'testing';
  },

  isDistribution() {
    return this.isProduction() || this.isStaging();
  },

  isDebug() {
    return this.environment() === 'debug';
  },

  isStaging() {
    return this.environment() === 'staging';
  },

  isIntegration() {
    return this.environment() === 'integration';
  },

  isDevelopment() {
    return this.environment() === 'development';
  },

  isProduction() {
    return this.environment() === 'production';
  },

  // Uses globby which defaults to process.cwd() and path.resolve(options.cwd, "/")
  js() {
    return [
      '**/**.js',
      '!node_modules/**',
      '!bower_components/**',
      '!dist/**',
      '!reports/**',
      '!build/**'
    ];
  },

  coverage() {
    return path.join(process.cwd(), 'coverage');
  },

  set(overrides) {
    Object.assign(this, overrides);
  }

};

module.exports = settings;
