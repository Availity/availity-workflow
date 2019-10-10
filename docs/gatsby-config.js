const themeOptions = require('@availity/gatsby-theme-docs/theme-options');

module.exports = {
  pathPrefix: '/availity-workflow',
  plugins: [
    {
      resolve: require.resolve('@availity/gatsby-theme-docs'),
      options: {
        ...themeOptions,
        root: __dirname,
        subtitle: 'Availity Workflow',
        description: 'Documentation for Availity Workflow',
        gitRepo: 'availity/availity-workflow',
        contentDir: 'docs/source',
        sidebarCategories: {
          null: ['index', 'getting-started', 'upgrade'],
          Essentials: ['essentials/testing-libraries', 'essentials/root-imports', 'essentials/typescript'],
          Mocking: ['mock/server', 'mock/data']
        }
      }
    }
  ]
};
