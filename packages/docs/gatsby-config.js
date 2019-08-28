module.exports = {
  pathPrefix: '/availity-workflow',
  __experimentalThemes: [
    {
      resolve: '@availity/gatsby-theme',
      options: {
        root: __dirname,
        subtitle: 'Availity Workflow',
        description: 'Documentation for Availity Workflow',
        githubRepo: 'availity/availity-workflow',
        sidebarCategories: {
          null: ['index', 'getting-started','upgrade'],
          Plugins: ['plugins/react', 'plugins/angular'],
          Mocking: ['mock/server', 'mock/data']
        }
      }
    }
  ]
};
