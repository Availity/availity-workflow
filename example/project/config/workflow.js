/** @type {import('@availity/workflow').WorkflowConfigFunction} */
export default (config) => {
  config.development.open = '/';

  config.development.hotLoader = true;

  config.development.stats = {
    level: 'normal',
  };

  config.development.infrastructureLogging = {
    level: 'info',
  };

  return config;
};
