# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.2.2](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.2.1...@availity/workflow@7.2.2) (2019-11-25)

**Note:** Version bump only for package @availity/workflow





## [7.2.1](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.2.0...@availity/workflow@7.2.1) (2019-11-23)

**Note:** Version bump only for package @availity/workflow





# [7.2.0](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.1.1...@availity/workflow@7.2.0) (2019-11-22)


### Bug Fixes

* **workflow:** fix trigger for invalid starter project ([8f8d762](https://github.com/availity/availity-workflow/commit/8f8d7621b7c30b904592e7c6cd787ef168c7f408))


### Features

* **workflow:** add checks for yarn, update logger to reflect yarn, spelling corrections ([2e04c94](https://github.com/availity/availity-workflow/commit/2e04c944c93824e08b03a2865e6a260b77ec7499))
* **workflow:** prefer yarn install over npm ([57b3107](https://github.com/availity/availity-workflow/commit/57b3107eb667afb5779c10113700bb079aa9f448))





## [7.1.2](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.1.1...@availity/workflow@7.1.2) (2019-11-18)

**Note:** Version bump only for package @availity/workflow





## [7.1.1](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.1.0...@availity/workflow@7.1.1) (2019-11-18)


### Bug Fixes

* **workflow:** get specific version of babel plugin ([a0011b7](https://github.com/availity/availity-workflow/commit/a0011b7ae57d919807a917ce76c444f0bb33a391))





# [7.1.0](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.0.5...@availity/workflow@7.1.0) (2019-11-11)


### Features

* add babel plugin for optional chaining ([085bec8](https://github.com/availity/availity-workflow/commit/085bec88ecb0bf4858779579400794fddd9f609e))





## [7.0.5](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.0.4...@availity/workflow@7.0.5) (2019-10-31)


### Bug Fixes

* **workflow:** fixed bug with proxy middleware json not updating content length ([281a2d7](https://github.com/availity/availity-workflow/commit/281a2d7f200a90a19062e4ea83ce9007c239e9cb))





## [7.0.4](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.0.3...@availity/workflow@7.0.4) (2019-10-29)

**Note:** Version bump only for package @availity/workflow





## [7.0.3](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.0.2...@availity/workflow@7.0.3) (2019-10-15)

**Note:** Version bump only for package @availity/workflow





## [7.0.2](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.0.1...@availity/workflow@7.0.2) (2019-10-15)

**Note:** Version bump only for package @availity/workflow





## [7.0.1](https://github.com/availity/availity-workflow/compare/@availity/workflow@7.0.0...@availity/workflow@7.0.1) (2019-10-12)


### Bug Fixes

* **workflow:** added public folder back ([79dc5bf](https://github.com/availity/availity-workflow/commit/79dc5bf5301aae6a22f9cd2e395030077a02df42))





# [7.0.0](https://github.com/availity/availity-workflow/compare/@availity/workflow@6.0.4...@availity/workflow@7.0.0) (2019-10-11)


### Code Refactoring

* **workflow:** added typescript support and root import support ([5e0286c](https://github.com/availity/availity-workflow/commit/5e0286c03aad58a58ecd04c88ec8409c17cd8498))


### Features

* **workflow:** workflow not only runs for react ([b538748](https://github.com/availity/availity-workflow/commit/b538748f9a5ace7bd7070c20e23f1783ccfbb209))


### Performance Improvements

* fixed linter errors ([6be7427](https://github.com/availity/availity-workflow/commit/6be742787afb0535be0ca2eaceb5c97e20642164))


### BREAKING CHANGES

* **workflow:** 
    - removed object assign because it is polyfilled
    - removed plugin plugin-transform-shorthand-properties
    - removed our custom presets for @babel/preset-env since we replaced with babel-preset-react-app
* **workflow:** workflow now only runs for react and no longer requires the plugin dev dependencies





## [6.0.4](https://github.com/availity/availity-workflow/compare/@availity/workflow@6.0.3...@availity/workflow@6.0.4) (2019-10-07)

**Note:** Version bump only for package @availity/workflow





## [6.0.3](https://github.com/availity/availity-workflow/compare/@availity/workflow@6.0.2...@availity/workflow@6.0.3) (2019-08-13)

**Note:** Version bump only for package @availity/workflow





## [6.0.2](https://github.com/availity/availity-workflow/compare/@availity/workflow@6.0.1...@availity/workflow@6.0.2) (2019-08-13)

**Note:** Version bump only for package @availity/workflow





## [6.0.1](https://github.com/availity/availity-workflow/compare/@availity/workflow@6.0.0...@availity/workflow@6.0.1) (2019-08-12)

**Note:** Version bump only for package @availity/workflow





# 6.0.0 (2019-08-09)



# 5.4.0 (2019-08-09)



## 5.3.9 (2019-06-17)



## 5.3.8 (2019-06-11)


### Bug Fixes

* **workflow:** removed version and fixed npm install to latest ([2a1d0a2](https://github.com/availity/availity-workflow/commit/2a1d0a2))



## 5.3.7 (2019-06-11)



## 5.3.6 (2019-06-11)


### Bug Fixes

* **workflow:** fixed issue with yargs not being passed through correctly ([f8e7a38](https://github.com/availity/availity-workflow/commit/f8e7a38))



## 5.3.5 (2019-06-11)


### Features

* **workflow:** templates are now created via cloning templates from git ([811bfd8](https://github.com/availity/availity-workflow/commit/811bfd8))



## 5.3.4 (2019-06-07)


### Features

* **react-template-simple:** added simple react template and set as default ([dc16c82](https://github.com/availity/availity-workflow/commit/dc16c82))



## 5.3.3 (2019-06-03)



## 5.3.2 (2019-06-03)



## 5.3.1 (2019-05-10)



# 5.3.0 (2019-05-02)



## 5.2.8 (2019-04-30)


### Bug Fixes

* **workflow:** can not read property of ‘isDryRun’ of undefined ([a8133f5](https://github.com/availity/availity-workflow/commit/a8133f5))



## 5.2.7 (2019-04-25)



## 5.2.6-alpha.1 (2019-04-22)


### Bug Fixes

* **workflow:**  Cannot read property 'development' of null ([612b8df](https://github.com/availity/availity-workflow/commit/612b8df)), closes [#199](https://github.com/availity/availity-workflow/issues/199)



## 5.2.5 (2019-04-15)



## 5.2.4 (2019-04-12)



## 5.2.3 (2019-04-11)



## 5.2.2 (2019-04-11)



## 5.2.1 (2019-04-11)



# 5.2.0 (2019-04-02)



# 5.1.0 (2019-03-29)



## 5.0.2 (2019-03-28)


### Bug Fixes

* **workflow:** added as arg to the arrow func ([8843f68](https://github.com/availity/availity-workflow/commit/8843f68))


### Features

* **workflow:** added ability to create workflow project in current dir ([b460605](https://github.com/availity/availity-workflow/commit/b460605))



## 5.0.1 (2019-03-20)


### Bug Fixes

* **workflow:** removed ignore for package-lock file as its required for travis ([4b3a05a](https://github.com/availity/availity-workflow/commit/4b3a05a))


### Features

* **upgrader:** created upgrader package for upgrading to v5 ([b7f97e6](https://github.com/availity/availity-workflow/commit/b7f97e6))



# 5.0.0-alpha.8 (2019-01-29)



# 5.0.0-alpha.7 (2019-01-29)


### Bug Fixes

* **workflow:** fixed eslint issues ([54e070d](https://github.com/availity/availity-workflow/commit/54e070d))



# 5.0.0-alpha.6 (2019-01-29)



# 5.0.0-alpha.5 (2019-01-04)



# 5.0.0-alpha.4 (2019-01-04)



# 5.0.0-alpha.3 (2019-01-03)


### Bug Fixes

* **workflow:** log proper error ([5b59246](https://github.com/availity/availity-workflow/commit/5b59246))



# 5.0.0-alpha.2 (2018-12-21)



# 5.0.0-alpha.1 (2018-12-21)



# 5.0.0-alpha.0 (2018-12-15)


### chore

* upgrade deps ([702872e](https://github.com/availity/availity-workflow/commit/702872e))


### BREAKING CHANGES

* upgrade to babel 7, eslint 5, eslint-config-airbnb 17



## 4.0.2 (2018-08-23)


### Bug Fixes

* **workflow:** disable log for webpack middleware ([62d4e44](https://github.com/availity/availity-workflow/commit/62d4e44))



## 4.0.1 (2018-08-16)



# 4.0.0-alpha.18 (2018-07-25)



# 4.0.0-alpha.17 (2018-07-18)



# 4.0.0-alpha.16 (2018-06-22)



# 4.0.0-alpha.15 (2018-06-21)


### Features

* **workflow:** accept version when running release ([50c76e6](https://github.com/availity/availity-workflow/commit/50c76e6)), closes [#175](https://github.com/availity/availity-workflow/issues/175)



# 4.0.0-alpha.14 (2018-05-22)



# 4.0.0-alpha.13 (2018-05-21)



# 4.0.0-alpha.12 (2018-05-16)



# 4.0.0-alpha.11 (2018-04-26)



# 4.0.0-alpha.10 (2018-04-26)


### Bug Fixes

* **workflow:** allow webpack warnings to fallthrough when errors are emitted ([bade285](https://github.com/availity/availity-workflow/commit/bade285))



# 4.0.0-alpha.9 (2018-04-26)


### Bug Fixes

* **workflow:** non-blocking webpack warning ([1a58fb4](https://github.com/availity/availity-workflow/commit/1a58fb4)), closes [#161](https://github.com/availity/availity-workflow/issues/161)



# 4.0.0-alpha.8 (2018-04-24)



# 4.0.0-alpha.7 (2018-04-23)



# 4.0.0-alpha.6 (2018-04-13)


### Features

* upgrade to webpack 4 ([60d531a](https://github.com/availity/availity-workflow/commit/60d531a))



# 4.0.0-alpha.5 (2018-04-05)



# 4.0.0-alpha.4 (2018-04-04)



# 4.0.0-alpha.3 (2018-04-04)


### Bug Fixes

* **workflow:** update deps in template package,json ([1ea97ad](https://github.com/availity/availity-workflow/commit/1ea97ad))



# 4.0.0-alpha.2 (2018-04-04)


### Bug Fixes

* **workflow:** add missing packages and fix yargs.argv usage ([b1d2864](https://github.com/availity/availity-workflow/commit/b1d2864))



# 4.0.0-alpha.1 (2018-04-04)


### Bug Fixes

* **workflow:** rename bin cmd to work with npx ([2fc1632](https://github.com/availity/availity-workflow/commit/2fc1632)), closes [/github.com/zkat/npx/blob/6e89dbd5989366e52d3810692b1ab5889a05fbad/parse-args.js#L137-L138](https://github.com//github.com/zkat/npx/blob/6e89dbd5989366e52d3810692b1ab5889a05fbad/parse-args.js/issues/L137-L138)



# 4.0.0-alpha.0 (2018-04-04)
