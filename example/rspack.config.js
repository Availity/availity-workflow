const { composePlugins, withNx, withReact } = require('@nrwl/rspack');

module.exports = composePlugins(withNx(), withReact(), (config) => {
  return config;
});
