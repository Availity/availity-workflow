import { readFileSync } from 'node:fs';
import Logger from '@availity/workflow-logger';
import chalk from 'chalk';
import envinfo from 'envinfo';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

export default function about() {
  Logger.simple(`\n${chalk.bold('@availity/workflow-vite')} ${chalk.bold.yellow(`v${pkg.version}`)}\n`);
  envinfo.run(
    {
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm'],
      Browsers: ['Chrome', 'Firefox', 'Safari'],
      npmPackages: ['@availity/workflow-vite', 'vite', 'vitest'],
    },
    { console: true, showNotFound: true }
  );
}
