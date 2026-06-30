# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.2.1](https://github.com/Availity/availity-workflow/compare/@availity/workflow-vite@1.2.0...@availity/workflow-vite@1.2.1) (2026-06-30)


### Bug Fixes

* resolve dayjs ESM resolution and improve vitestOverrides API ([c0cd895](https://github.com/Availity/availity-workflow/commit/c0cd895d0da448ac0947119bf4935f3ea0d65ecd))



# [1.2.0](https://github.com/Availity/availity-workflow/compare/@availity/workflow-vite@1.1.0...@availity/workflow-vite@1.2.0) (2026-06-29)


### Bug Fixes

* **workflow-vite:** replace deprecated advancedChunks with codeSplitting ([28bd2d2](https://github.com/Availity/availity-workflow/commit/28bd2d2b144af026a6bd03753136ace1de43898b))


### Features

* **workflow,workflow-vite:** add --ui flag to av test for Vitest UI ([a5c5427](https://github.com/Availity/availity-workflow/commit/a5c54277f9fdd449678675ff7c23c27012fd0469))



# [1.1.0](https://github.com/Availity/availity-workflow/compare/@availity/workflow-vite@1.0.2...@availity/workflow-vite@1.1.0) (2026-06-29)


### Features

* **workflow-vite,workflow:** export globals types and add test CLI flags ([a8f93f7](https://github.com/Availity/availity-workflow/commit/a8f93f79e427df6c2821d7efbf73635c6a27592d))



## [1.0.2](https://github.com/Availity/availity-workflow/compare/@availity/workflow-vite@1.0.1...@availity/workflow-vite@1.0.2) (2026-06-29)


### Bug Fixes

* **workflow-vite:** resolve lint hanging in TypeScript-only projects ([a2d3365](https://github.com/Availity/availity-workflow/commit/a2d336537aac0e530ac1466bbb68816913db3659))



## [1.0.1](https://github.com/Availity/availity-workflow/compare/@availity/workflow-vite@1.0.0...@availity/workflow-vite@1.0.1) (2026-06-29)



# 1.0.0 (2026-06-26)

### Dependency Updates

* `workflow-logger` updated to version `1.0.0`
* `mock-server` updated to version `1.0.0`
* `mock-server` updated to version `1.0.0`

### Bug Fixes

* align eslint-config-availity version constraints ([e716c31](https://github.com/Availity/availity-workflow/commit/e716c3148e682596dfc6b5c70e2be4bcf8e26d63))
* disable vite-plugin-checker overlay for ESLint errors ([9e840ef](https://github.com/Availity/availity-workflow/commit/9e840ef6ba9db946857202628dcba07d2ac30c87))
* eslint failOnError default and typed config options ([3472400](https://github.com/Availity/availity-workflow/commit/3472400666f01cee5804fe4b0356aa57578d31ae))
* eslint overlay in dev, auto-register jest-dom matchers ([f4bf50e](https://github.com/Availity/availity-workflow/commit/f4bf50eca529018afa1b4c331c6a19726ad31e8a))
* explicitly disable vitest watch mode in test scripts ([a828d77](https://github.com/Availity/availity-workflow/commit/a828d777917102b8cc3572cd07200fc2f0ea072f))


* feat!: refactor workflow-vite CLI and Settings architecture ([086f100](https://github.com/Availity/availity-workflow/commit/086f1001cc04f8935c4d07f3d2f02b221a9f1726))


### Features

* add FileSelector example, audit deps, prefer plugin-react over swc ([40a3b57](https://github.com/Availity/availity-workflow/commit/40a3b57814463b75ce5f0ccbcbf6cad345fc4cd4))
* add update-browsers command, fix lint output noise, fix regex backtracking ([51f8127](https://github.com/Availity/availity-workflow/commit/51f81279660e15afe6f214cc38ba4d90f57f698f))
* allow react 18 and 19 in peerDependencies ([2eb5033](https://github.com/Availity/availity-workflow/commit/2eb503338d9a6962e1a46d70f1f2b1fb12abc3aa))


### BREAKING CHANGES

* Settings is now a class with async factory (Settings.create()).
- Mirrored all workflow package patterns (class, param injection, lazy imports)
- Removed yargs from Settings (receives parsed argv from CLI)
- Fixed version.js (execFileSync, no Promise wrappers)
- Fixed test.js (throws instead of process.exit)
- Removed lint expandGlobs, module-level settings imports
- Added globals.d.ts for shipped TypeScript global types
- Updated types (index.d.ts) to reflect Settings class API
- Added nx lint target



# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).
