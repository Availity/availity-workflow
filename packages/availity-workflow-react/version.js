const ConcatSource = require('webpack-core/lib/ConcatSource');
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');
const moment = require('moment');

// Probably should check if the version string should be wrapped in quotes.
function wrapVersion(version) {
  return `
window.APP_VERSION=${version};
`;
}

const defaultOptions = {
  entryOnly: true,
  test: /\.js($|\?)/i,
  version: moment().format()
};

class VersionPlugin {

  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  apply(compiler) {

    const options = this.options;
    const version = wrapVersion(options.version);

    compiler.plugin('compilation', compilation => {

      // Minification occurs in callback 'optimize-chunk-assets' and should only run for production
      // builds.  Similarly, appending the app version number to entry chunks should occur in
      // distribution (staging and production) builds.
      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {

        chunks.forEach(chunk => {

          if (options.entryOnly && !chunk.initial) {
            return;
          }

          chunk.files.filter(ModuleFilenameHelpers.matchObject.bind(undefined, options)).forEach(file => {
            compilation.assets[file] = new ConcatSource(version, '\n', compilation.assets[file]);
          });
        });

        callback();

      });
    });

  }

}

module.exports = VersionPlugin;
