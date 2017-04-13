module.exports = {
  config: '/project/config' // where to look for workflow.js or workflow.yml should only be modified by the projects package.json
  options: { // default options
    // root: defaults to process.cwd()
    context: '/project/app' // main directory for code used
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
