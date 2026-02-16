import build from './build.js';

async function profileVite(settings) {
  const { build: viteBuild } = await import('vite');
  const { visualizer } = await import('rollup-plugin-visualizer');
  const { default: del } = await import('del');
  const { default: Logger } = await import('@availity/workflow-logger');
  const { default: ora } = await import('ora');
  const { default: buildViteProductionConfig } = await import('../vite.config.production.js');

  if (!settings.isDryRun()) {
    Logger.success(`Cleaning directories ${settings.output()}`);
    del.sync([settings.output()]);
  }

  let viteConfig = buildViteProductionConfig(settings);

  // Add visualizer plugin for profiling
  viteConfig.plugins = [
    ...(viteConfig.plugins || []),
    visualizer({
      filename: 'profile.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
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
    await viteBuild(viteConfig);
    spinner.stop();
    Logger.success('Finished profiling with Vite — profile.html generated');
  } catch (error) {
    spinner.stop();
    Logger.failed('Failed to profile with Vite');
    throw error;
  }
}

function profile(settings) {
  if (settings.isVite()) {
    return profileVite(settings);
  }
  return build({ profile: true, settings });
}

export default profile;
