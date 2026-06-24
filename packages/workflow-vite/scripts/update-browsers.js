import { execSync } from 'node:child_process';
import Logger from '@availity/workflow-logger';

export default function updateBrowsers() {
  Logger.info('Updating caniuse-lite browser database...');
  execSync('npx update-browserslist-db@latest', { stdio: 'inherit' });
}
