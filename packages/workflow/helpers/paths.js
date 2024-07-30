const fs = require('fs');
const path = require('path');

// https://github.com/facebook/create-react-app/blob/134cd3c59cdac8db9383432519f5a612b4dcfb79/packages/react-scripts/config/paths.js#L15-L18
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  // TODO: add other common paths
  project: resolveApp(''),
  app: resolveApp('project/app'),
  appNodeModules: resolveApp('node_modules'),
  appStatic: resolveApp('project/app/static'),
  tsconfig: resolveApp('tsconfig.json')
};
