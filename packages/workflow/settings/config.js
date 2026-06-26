import path from 'node:path';
import { existsSync } from 'node:fs';
import Logger from '@availity/workflow-logger';
import Joi from 'joi';
import deepMerge from '../helpers/deep-merge.js';
import paths from '../helpers/paths.js';
import schema from './schema.js';

/**
 * Resolves and validates the workflow configuration.
 * Pure function — no side effects beyond logging on failure.
 *
 * @param {object} options
 * @param {object} options.pkg - The project's package.json contents
 * @param {object} options.argv - Parsed CLI arguments
 * @returns {{ configuration: object, workflowConfigPath: string }}
 */
export default async function resolveConfig({ pkg, argv }) {
  const { value: defaultConfig } = schema.validate({});

  const defaultWorkflowConfig = path.join(import.meta.dirname, 'schema.js');
  const jsWorkflowConfig = path.join(paths.project, 'project/config/workflow.js');

  let workflowConfigPath;
  let developerConfig = {};

  // Read the workflow file if it exists
  if (existsSync(jsWorkflowConfig)) {
    workflowConfigPath = jsWorkflowConfig;
    const module = await import(workflowConfigPath);
    developerConfig = module.default || module;
  } else {
    workflowConfigPath = defaultWorkflowConfig;
  }

  // Merge defaults with developer config
  let config = {};
  try {
    if (typeof developerConfig === 'function') {
      config = developerConfig(defaultConfig);
    } else {
      deepMerge(config, defaultConfig, pkg.availityWorkflow, developerConfig);
    }
  } catch (error) {
    Logger.failed(`There was an error merging the local config. See details below:\n\n${error.message}`);
    throw error;
  }

  // Validate
  try {
    Joi.assert(config, schema);
  } catch (error) {
    const details = JSON.stringify(error.details, null, 2);
    Logger.failed(`Your workflow.js settings are invalid. See details below:\n\n${details}`);
    throw error;
  }

  // Merge CLI overrides
  deepMerge(config, {
    development: argv.development,
    ekko: argv.ekko,
    globals: argv.globals,
  });

  return { configuration: config, workflowConfigPath };
}
