module.exports = {
  plugins: [],
  themes: [['@docusaurus/theme-search-algolia', { id: '01' }]],
  onBrokenLinks: 'log',
  title: 'Availity Docs',
  tagline: 'React components using Availity UIKit and Bootstrap 4',
  url: 'https://availity.github.io/cli',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'availity', // Usually your GitHub org/user name.
  projectName: 'availity-react', // Usually your repo name.
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
    colorMode: { defaultMode: 'dark' },

    navbar: {
      title: 'Availity Docs',
      hideOnScroll: true,
      logo: {
        alt: 'Availity Docs Logo',
        src: 'img/icon.png'
      },
      items: [
        {
          to: 'http://localhost:3000', // needs to be updated once deployed
          label: 'CLI',
          class: 'active',
          position: 'right'
        },
        {
          to: 'http://localhost:3001', // needs to be updated once deployed
          label: 'SDK',
          position: 'right'
        },
        {
          to: 'https://deploy-preview-571--condescending-leavitt-66e607.netlify.app/', // The target URL (string).
          label: 'React',
          position: 'right'
        },

        {
          href: 'https://github.com/availity',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository'
        }
      ]
    }
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
          editUrl: 'https://github.com/availity/availity-react/edit/feat/docusaurus-docs/docusaurus/'
        },

        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
};
