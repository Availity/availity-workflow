// CLI flags will take precedence over these default settings
module.exports = {
  access: 'infer',
  autoCommit: false,
  changelogFilename: './CHANGELOG.md',
  // changesetFilename: 'needed?',
  changesetIgnorePatterns: ['**/*.test.js', '**/*.spec.{js,ts}', '**/*.{md,mdx}', '**/yarn.lock'],
  conventionalChangelogConfig: 'conventional-changelog-conventionalcommits',
  dryRun: false,
  git: {
    commitSha: 'HEAD',
    remote: 'origin',
    push: true
  },
  persistVersions: false, // TODO: turn on with autoCommit?
  prerelease: false,
  prereleaseId: 'alpha',
  prereleaseNPMTag: 'canary'
};
