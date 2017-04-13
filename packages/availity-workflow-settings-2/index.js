const relative = require('require-relative');
const path = require('path');
const _ = require('lodash');
const exists = require('exists-sync');
const fs = require('fs');
const yaml = require('js-yaml');
const argv = require('yargs').argv;

const defaults = require('./workflow.js');

const project = process.cwd();
const pkg = require(path.join(project, 'package.json'));
const pkgWorkflow = (pkg && pkg.availityWorkflow) ? pkg.availityWorkflow : {}; // workflow object in package.json

function getOptions(opts, relativePath) {
  const output = {};
  let options = _.cloneDeep(opts);
  let nextRelative = relativePath;
  if (_.isArray(options)) {
    options = {
      use: options
    };
  }
  // if options is a string, attempt to require it
  if (_.isString(options)) {
    if (/\.yml/.test(options)) {
      // is yml file
      const file = path.isAbsolute(options) ? options : path.join(relativePath, options);
      options = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
      nextRelative = path.dirname(file);
    } else {
      nextRelative = path.dirname(relative.resolve(options, relativePath));
      options = relative(options, relativePath);
    }
  }
  // if not an object return
  if (!_.isObject(options)) {
    return output;
  }
  // grab the plugin's plugins and remove from output
  const use = _.compact(_.castArray(_.get(options, 'use', [])));
  _.unset(options, 'use');
  _.forEach(use, (plugin) => {
    _.merge(output, getOptions(plugin, nextRelative));
  });
  _.merge(output, options);
  return output;
}

const settings = getOptions(pkgWorkflow, process.cwd());
_.defaultsDeep(settings, defaults);

// check the config for last webpack config
const config = path.resolve(_.get(settings, 'options.config'));
if (config) {
  const hasYml = exists(path.join(config, 'workflow.yml'));
  const hasJs = exists(path.join(config, 'workflow.js'));
  if (hasYml || hasJs) {
    let fileName = 'workflow';
    if (hasYml) fileName += '.yml';
    let configOptions = getOptions(fileName, config);
    _.merge(settings, configOptions);
  }
}
_.merge(settings, argv);
let originalOptions = _.cloneDeep(settings.options);
settings.setOptions = (env) => {
  settings.env = env || process.env.NODE_ENV || 'development';
  settings.options = _.merge({}, originalOptions, _.get(settings, settings.env, {}));
}
settings.setOptions();
module.exports = rawOptions;
