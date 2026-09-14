import fs from 'node:fs';
import ora from 'ora';
import Logger from '@availity/workflow-logger';
import applyModifyViteConfig from '../helpers/apply-modify-vite-config.js';

export default async function build({ settings }) {
  const { build } = await import('vite');
  const { default: buildViteProductionConfig } = await import('../vite.config.production.js');

  if (!settings.isDryRun()) {
    Logger.info(`Cleaning ${settings.output()}`);
    await fs.promises.rm(settings.output(), { recursive: true, force: true });
  }

  const viteConfig = applyModifyViteConfig(await buildViteProductionConfig(settings), settings);

  Logger.info('Started compiling with Vite');
  const spinner = ora('Running Vite build\n');
  spinner.color = 'yellow';
  spinner.start();

  try {
    await build(viteConfig);
    spinner.stop();
    Logger.success('Finished compiling with Vite');
  } catch (error) {
    spinner.stop();
    Logger.failed('Failed to build with Vite');
    throw error;
  }
}
