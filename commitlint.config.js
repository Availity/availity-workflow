export default {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  rules: {
    'header-max-length': [0, 'always', 85],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?(!)?:\s(.*)$/,
      headerCorrespondence: ['type', 'scope', 'breaking', 'subject'],
    },
  },
};
