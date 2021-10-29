// CLI flags will take precedence over these default settings
// https://tophat.github.io/monodeploy/configuration
module.exports = {
  access: 'infer',
  autoCommit: true,
  changelogFilename: 'CHANGELOG.md',
  // changesetFilename: 'needed?',
  changesetIgnorePatterns: ['**/*.test.js', '**/*.spec.{js,ts}', '**/*.{md,mdx}', '**/yarn.lock'],
  conventionalChangelogConfig: 'conventional-changelog-conventionalcommits',
  dryRun: false,
  git: {
    push: true
  },
  persistVersions: true,
  prerelease: false,
  prereleaseId: 'alpha',
  prereleaseNPMTag: 'canary'
};
