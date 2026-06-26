import workflow from 'eslint-config-availity/workflow';

export default [
  ...workflow,
  {
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
  {
    ignores: ['**/coverage/', '**/build/', '**/dist/', '**/reports/'],
  },
];
