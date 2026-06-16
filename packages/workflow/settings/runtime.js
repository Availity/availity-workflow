import Logger from '@availity/workflow-logger';
import getPort, { portNumbers } from 'get-port';

/**
 * Resolves available ports and rewrites proxy targets if ports change.
 * Mutates the configuration object in place.
 *
 * @param {object} configuration - The validated workflow configuration
 * @param {string} host - The resolved host
 * @returns {{ devServerPort: number, ekkoServerPort: number }}
 */
export default async function resolveRuntime(configuration, host) {
  let devServerPort;
  let ekkoServerPort;

  // Resolve dev server port
  try {
    devServerPort = configuration?.development?.port ?? 3000;
    const availablePort = await getPort({
      port: portNumbers(devServerPort, devServerPort + 1000),
      host,
    });

    if (availablePort !== devServerPort) {
      devServerPort = availablePort;
    }
  } catch (error) {
    Logger.failed(`There was an error setting up the dev port. See details below:\n\n${error.message}`);
    throw error;
  }

  // Resolve ekko port
  try {
    const wantedEkkoPort = configuration?.ekko?.port ?? 9999;
    ekkoServerPort = await getPort({
      port: portNumbers(wantedEkkoPort, wantedEkkoPort + 1000),
      host,
    });

    if (wantedEkkoPort !== ekkoServerPort) {
      configuration.ekko.pluginContext = configuration.ekko.pluginContext.replace(
        `:${wantedEkkoPort}`,
        `:${ekkoServerPort}`
      );

      if (Array.isArray(configuration.proxies)) {
        for (const proxy of configuration.proxies) {
          proxy.target = proxy.target.replace(`:${wantedEkkoPort}`, `:${ekkoServerPort}`);
        }
      }
    }
  } catch (error) {
    Logger.failed(`There was an error setting up the ekko port. See details below:\n\n${error.message}`);
    throw error;
  }

  return { devServerPort, ekkoServerPort };
}
