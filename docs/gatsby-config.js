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
        gitRepo: 'github.com/availity/availity-workflow',
        gitType: 'github',
        contentDir: 'docs/source',
        sidebarCategories: {
          null: ['index', 'quick-start'],
          Tutorial: ['tutorial/index', 'tutorial/mocks', 'tutorial/deploy'],
          Recipes: ['recipes/testing-libraries', 'recipes/root-imports', 'recipes/typescript'],
          'API Reference': ['reference/workflow-config', 'reference/commands', 'reference/mock-server']
        }
      }
    }
  ]
};
