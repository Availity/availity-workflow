import fs from 'node:fs';
import ora from 'ora';
import Logger from '@availity/workflow-logger';

export default async function profile({ settings }) {
  const { build } = await import('vite');
  const { visualizer } = await import('rollup-plugin-visualizer');
  const { default: buildViteProductionConfig } = await import('../vite.config.production.js');

  if (!settings.isDryRun()) {
    Logger.success(`Cleaning directories ${settings.output()}`);
    fs.rmSync(settings.output(), { recursive: true, force: true });
  }

  let viteConfig = await buildViteProductionConfig(settings);

  viteConfig.plugins = [
    ...(viteConfig.plugins || []),
    visualizer({ filename: 'profile.html', open: true, gzipSize: true, brotliSize: true }),
  ];

  const { modifyViteConfig } = settings.config();
  if (typeof modifyViteConfig === 'function') {
    viteConfig = modifyViteConfig(viteConfig, settings) || viteConfig;
  }

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
