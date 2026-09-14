import fs from 'node:fs';
import ora from 'ora';
import Logger from '@availity/workflow-logger';
import applyModifyViteConfig from '../helpers/apply-modify-vite-config.js';

export default async function profile({ settings }) {
  const { build } = await import('vite');
  const { visualizer } = await import('rollup-plugin-visualizer');
  const { default: buildViteProductionConfig } = await import('../vite.config.production.js');

  if (!settings.isDryRun()) {
    Logger.info(`Cleaning ${settings.output()}`);
    await fs.promises.rm(settings.output(), { recursive: true, force: true });
  }

  let viteConfig = await buildViteProductionConfig(settings);

  viteConfig.plugins = [
    ...(viteConfig.plugins || []),
    visualizer({ filename: 'profile.html', open: true, gzipSize: true, brotliSize: true }),
  ];

  viteConfig = applyModifyViteConfig(viteConfig, settings);

  Logger.info('Started profiling with Vite');
  const spinner = ora('Running Vite build with profiling');
  spinner.color = 'yellow';
  spinner.start();

  try {
    await build(viteConfig);
    spinner.stop();
    Logger.success('Finished profiling — profile.html generated');
  } catch (error) {
    spinner.stop();
    Logger.failed('Failed to profile with Vite');
    throw error;
  }
}
