// CLI flags will take precedence over these default settings
module.exports = {
  dryRun: false,
  git: {
    commitSha: 'HEAD',
    remote: 'origin',
    push: true
  },
  conventionalChangelogConfig: '@tophat/conventional-changelog-config',
  access: 'infer',
  persistVersions: false,
  changesetIgnorePatterns: ['**/*.test.js', '**/*.spec.{js,ts}', '**/*.{md,mdx}', '**/yarn.lock']
};
