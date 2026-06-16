import Logger from '@availity/workflow-logger';
import chalk from 'chalk';

async function startEkko(settings) {
  if (!settings.isEkko()) return;

  const ekkoOptions = {
    data: settings.config().ekko.data,
    routes: settings.config().ekko.routes,
    plugins: settings.config().ekko.plugins,
    port: settings.ekkoPort(),
    host: settings.host(),
    pluginContext: settings.config().ekko.pluginContext,
    logProvider() {
      return {
        log: (...args) => Logger.log(args),
        debug: (...args) => Logger.debug(args),
        info: (...args) => Logger.info(args),
        warn: (...args) => Logger.warn(args),
        error: (...args) => Logger.error(args),
      };
    }
  };

  try {
    const { default: Ekko } = await import('@availity/mock-server');
    const ekko = new Ekko();
    await ekko.start(ekkoOptions);
  } catch (error) {
    Logger.error("Failed to start Ekko. Install '@availity/mock-server' or set ekko.enabled = false.");
    Logger.error(error.message || error);
  }
}

export default async function start({ settings }) {
  const { createServer, preview } = await import('vite');
  const { default: buildViteConfig } = await import('../vite.config.js');

  settings.log();

  if (settings.isDryRun()) {
    Logger.message('Serving production build from dist/', 'Dry Run');
    await startEkko(settings);
    const previewServer = await preview({
      root: settings.project(),
      preview: { port: settings.port(), host: settings.host() },
    });
    const uri = `http://${settings.host()}:${settings.port()}/`;
    Logger.box(`Previewing ${chalk.yellow(settings.pkg().name)} at ${chalk.green(uri)}`);
    previewServer.printUrls();
    return;
  }

  await startEkko(settings);

  let viteConfig = await buildViteConfig(settings);

  const { modifyViteConfig } = settings.config();
  if (typeof modifyViteConfig === 'function') {
    viteConfig = modifyViteConfig(viteConfig, settings) || viteConfig;
  }

  Logger.info('Starting Vite development server');
  const server = await createServer(viteConfig);
  await server.listen();

  const uri = `http://${settings.host()}:${settings.port()}/`;
  Logger.box(`The app ${chalk.yellow(settings.pkg().name)} is running at ${chalk.green(uri)}`);
}
