const autoprefixer = require('autoprefixer');

const prefixer = autoprefixer({ browsers: ['last 5 versions'] });

module.exports = prefixer;
