module.exports = {
  plugins: [],
  themes: [['@docusaurus/theme-search-algolia', { id: '01' }]],
  onBrokenLinks: 'log',
  title: 'Availity Workflow Docs',
  tagline: 'Toolkit for Availity web projects',
  url: 'https://availity.github.io/availity-workflow',
  baseUrl: '/availity-workflow',
  favicon: 'img/favicon.ico',
  organizationName: 'availity', // Usually your GitHub org/user name.
  projectName: 'availity-workflow', // Usually your repo name.
  themeConfig: {
    algolia: {
      apiKey: 'eec0154a008662c32d440b7de7982cd2',
      indexName: 'availity'
    },
    // announcementBar: {
    //   id: 'supportus',
    //   backgroundColor: '#e29f0d',
    //   textColor: 'black',
    //   content:
    //     '⭐️ If you like Availity-React, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/availity/availity-react">GitHub</a>! ⭐️'
    // },
    colorMode: {
      defaultMode: 'dark',
      // Should we use the prefers-color-scheme media-query,
      // using user system preferences, instead of the hardcoded defaultMode
      respectPrefersColorScheme: true
    },

    navbar: {
      title: 'Availity Docs',
      // hideOnScroll: true,
      logo: {
        alt: 'Availity Docs Logo',
        src: 'img/icon.png',
        href: 'https://availity.github.io',
        target: '_self'
      },
      items: [
        {
          href: 'https://availity.github.io/availity-workflow',
          target: '_self'
          label: 'React',
          position: 'right',
        },
        {
          href: 'https://availity.github.io/sdk-js',
          target: '_self',
          label: 'SDK-JS',
          position: 'right',
        },
        {
          to: '/', // availity.github.io/availity-workflow, this repo
          label: 'Workflow',
          position: 'right',
        },
        {
          href: 'https://github.com/availity/availity-workflow',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ]
    },
    footer: {},
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          routeBasePath: '/',

          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/availity/availity-workflow/edit/master/'
        },

        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
};
