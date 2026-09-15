/** @type {import('@availity/workflow-vite').WorkflowViteConfigFunction} */
export default (config) => {
  config.development.open = '/';
  config.development.typeCheck = true;

  return config;
};
