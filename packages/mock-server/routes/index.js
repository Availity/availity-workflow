import deepMerge from '../helpers/deep-merge.js';
import fs from 'fs';
import chalk from 'chalk';

import { createRequire } from 'module';
import config from '../config/index.js';
import response from '../response/index.js';
import models from '../models/index.js';
import logger from '../logger/index.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const log = logger.getInstance();

const { Route } = models;

const routes = {
  /**
   * Initialize the Express routes from the endpoints in the configurations file.
   */
  init() {
    // eslint-disable-next-line unicorn/no-this-assignment
    const self = this;

    const { router } = config;

    // Add default route.  Configurations should be allowed to override this if needed.
    router.get('/', (req, res) => {
      res.send({
        name: pkg.name,
        description: pkg.description,
        version: pkg.version
      });
    });

    config.options.endpoints = {};

    // Load plugins that contain data and routes
    this.plugins();

    // Load local data and routes.  Local data and routes should override the plugins.
    const routePaths = config.options.routes;
    const dataPath = config.options.data;

    // Local data can be missing if only plugins are use for route + data
    if (routePaths && dataPath) {
      this.routes(routePaths, dataPath);
    }

    for (const [url, endpoint] of Object.entries(config.options.endpoints)) {
      const route = new Route(url, endpoint, endpoint.dataPath);
      self.add(route);
    }
  },

  routes(routePaths, dataPath) {
    // support multiple directories for routes
    routePaths = Array.isArray(routePaths) ? routePaths : [routePaths];

    for (const routePath of routePaths) {
      const contents = fs.readFileSync(routePath, 'utf8');
      const routeConfig = JSON.parse(contents);

      for (const route of Object.values(routeConfig)) {
        route.dataPath = dataPath;
      }
      deepMerge(config.options.endpoints, routeConfig);
    }
  },

  async plugins() {
    const plugins = config.options.plugins || [];

    for (const plugin of plugins) {
      const mod = await import(plugin);
      const pluginConfig = mod.default;
      log.info(`Loading plugin ${chalk.blue(plugin)}`);
      this.routes(pluginConfig.routes, pluginConfig.data);
    }
  },

  /**
   * Create a route in Express and cache the route in the config object cache.  Express routes
   * forward request to the response module.  The route configuration is attached to the res.locals
   * object for later use.
   *
   * @param {Object} route Object representation route in the configuration file.
   */
  add(route) {
    // cache the route configuration
    config.cache[route.id] = route;

    const methods = Object.keys(route.methods);
    const { router } = config;

    for (const method of methods) {
      // builds get|post|put|delete routes like /v1/payers
      router[method](route.url, (req, res, next) => {
        // get from cache and attach to request local
        res.locals.route = config.cache[route.id];
        response.send(req, res, next);
      });
    }
  }
};

export default routes;
