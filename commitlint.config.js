export default {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?(!)?:\s(.*)$/,
      headerCorrespondence: ['type', 'scope', 'breaking', 'subject'],
    },
  },
};
