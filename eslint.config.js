import browser from 'eslint-config-availity/browser';

export default [
  ...browser,
  {
    languageOptions: {
      globals: {
        "vi": true
      }
    }
  },
  {
    rules: {
      'import/extensions': 0,
      'import/no-dynamic-require': 0,
      'no-await-in-loop': 0,
      'no-continue': 0,
      'no-plusplus': 0,
      'unicorn/no-await-expression-member': 0,
      'unicorn/prefer-string-raw': 0,
    }
  },
  {
    ignores: ['./yarn', '.yarn/*', '**/coverage/', '**/build/', '**/dist/', '**/node_modules/', '**/.docusaurus', './example', '**/*.d.ts', '**/*.snap', 'docusaurus/']
  },
  {
    files: ['packages/mock-server/**/*.js', 'packages/workflow/settings/index.js', 'packages/workflow-vite/settings/index.js', 'packages/workflow-vite/vite.config.js'],
    rules: {
      'unicorn/no-this-outside-of-class': 'off',
    }
  },
];
