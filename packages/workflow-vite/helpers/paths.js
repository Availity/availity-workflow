import fs from 'node:fs';
import path from 'node:path';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

export default {
  project: resolveApp(''),
  app: resolveApp('project/app'),
  appNodeModules: resolveApp('node_modules'),
  appStatic: resolveApp('project/app/static'),
  tsconfig: resolveApp('tsconfig.json'),
};
