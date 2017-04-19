
module.exports = {
  development: {
    webpackLog: {
      colors: true,
      cached: true,
      reasons: false,
      source: false,
      chunks: false,
      children: false,
      errorDetails: true
    }
  }
  webpack: require('./webpackConfig'),
  build: require('./build'),
  start: require('./start')
};
