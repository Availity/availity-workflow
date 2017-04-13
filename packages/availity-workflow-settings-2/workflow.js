module.exports = {
  options: { // default options
    // root: defaults to process.cwd()
    context: '/project/app' // main directory for code used
    config: '/project/config' // where to look for workflow.js or workflow.yml
    output: '/build'
  },
  development: {},
  test: {},
  production: {
    output: '/dist'
  },
  staging: {
    output: '/dist'
  }
};
