#  (2021-11-12)



#  (2021-11-11)



# [5.4.0](https://github.com/Availity/availity-workflow/compare/v5.3.9...v5.4.0) (2019-08-09)

### Bug Fixes

-   **workflow-plugin-react:** fixed package-lock merge issue ([52a6e60](https://github.com/Availity/availity-workflow/commit/52a6e60))

## [5.3.9](https://github.com/Availity/availity-workflow/compare/v5.3.8...v5.3.9) (2019-06-17)

## [5.3.8](https://github.com/Availity/availity-workflow/compare/v5.3.7...v5.3.8) (2019-06-11)

### Bug Fixes

-   **workflow:** removed version and fixed npm install to latest ([2a1d0a2](https://github.com/Availity/availity-workflow/commit/2a1d0a2))

## [5.3.7](https://github.com/Availity/availity-workflow/compare/v5.3.6...v5.3.7) (2019-06-11)

## [5.3.6](https://github.com/Availity/availity-workflow/compare/v5.3.5...v5.3.6) (2019-06-11)

### Bug Fixes

-   **workflow:** fixed issue with yargs not being passed through correctly ([f8e7a38](https://github.com/Availity/availity-workflow/commit/f8e7a38))

## [5.3.5](https://github.com/Availity/availity-workflow/compare/v5.3.4...v5.3.5) (2019-06-11)

### Features

-   **workflow:** templates are now created via cloning templates from git ([811bfd8](https://github.com/Availity/availity-workflow/commit/811bfd8))

## [5.3.4](https://github.com/Availity/availity-workflow/compare/v5.3.3...v5.3.4) (2019-06-07)

### Bug Fixes

-   **mock-data:** fixed incorrect data response issue ([9475897](https://github.com/Availity/availity-workflow/commit/9475897))

### Code Refactoring

-   deleted example-react and refactoring to templates ([24c9cf2](https://github.com/Availity/availity-workflow/commit/24c9cf2))

### Features

-   **react-template-complex:** added complex template ([11cb758](https://github.com/Availity/availity-workflow/commit/11cb758))
-   **react-template-simple:** added simple react template and set as default ([dc16c82](https://github.com/Availity/availity-workflow/commit/dc16c82))
-   **react-template-wizard:** added wizard react template ([6acab8a](https://github.com/Availity/availity-workflow/commit/6acab8a))

### BREAKING CHANGES

-   Refactored authorizations template to be in a new package for when we add 2 more to select from via the workflow

## [5.3.3](https://github.com/Availity/availity-workflow/compare/v5.3.2...v5.3.3) (2019-06-03)

## [5.3.2](https://github.com/Availity/availity-workflow/compare/v5.3.1...v5.3.2) (2019-06-03)

### Bug Fixes

-   **workflow-plugin-angular:** pass in settings for setup ([9e4b160](https://github.com/Availity/availity-workflow/commit/9e4b160))

## [5.3.1](https://github.com/Availity/availity-workflow/compare/v5.3.0...v5.3.1) (2019-05-10)

### Bug Fixes

-   **mock-data:** the mock-data response for axi userpermissions where incorrect ([02ea324](https://github.com/Availity/availity-workflow/commit/02ea324))

# [5.3.0](https://github.com/Availity/availity-workflow/compare/v5.2.8...v5.3.0) (2019-05-02)

### Features

-   **mock-data:** add legacy permission to mock routes ([9baf02f](https://github.com/Availity/availity-workflow/commit/9baf02f))

## [5.2.8](https://github.com/Availity/availity-workflow/compare/v5.2.7...v5.2.8) (2019-04-30)

### Bug Fixes

-   **workflow:** can not read property of ‘isDryRun’ of undefined ([a8133f5](https://github.com/Availity/availity-workflow/commit/a8133f5))

## [5.2.7](https://github.com/Availity/availity-workflow/compare/v5.2.6-alpha.1...v5.2.7) (2019-04-25)

### Performance Improvements

-   **workflow-plugin-angular:** enable futureEmitAssets ([99567e3](https://github.com/Availity/availity-workflow/commit/99567e3))
-   **workflow-plugin-react:** enable futureEmitAssets ([e09b735](https://github.com/Availity/availity-workflow/commit/e09b735))

### Bug Fixes

-   **workflow:** Cannot read property 'development' of null ([612b8df](https://github.com/Availity/availity-workflow/commit/612b8df)), closes [#199](https://github.com/Availity/availity-workflow/issues/199)

## 5.2.6-alpha.1 (2019-04-22)

### Bug Fixes

-   **availitiy-workflow-angular:** enable allChunks in ExtractTextPlugin ([cd5a6dc](https://github.com/Availity/availity-workflow/commit/cd5a6dc)), closes [#141](https://github.com/Availity/availity-workflow/issues/141)
-   **availitiy-workflow-react:** enable allChunks in ExtractTextPlugin ([d5bacfb](https://github.com/Availity/availity-workflow/commit/d5bacfb)), closes [#141](https://github.com/Availity/availity-workflow/issues/141)
-   **availity-angular-kit:** stringify the error from karma ([31e75e3](https://github.com/Availity/availity-workflow/commit/31e75e3))
-   **availity-mock-data:** spaces collection in wrong folder ([3ce0a66](https://github.com/Availity/availity-workflow/commit/3ce0a66))
-   **availity-mock-server:** return correct status for resumable upload route ([0563d49](https://github.com/Availity/availity-workflow/commit/0563d49))
-   **availity-mock-server:** set response headers and unit test ([d7ab013](https://github.com/Availity/availity-workflow/commit/d7ab013))
-   **availity-react-kit:** add pageName to breadcrumbs example ([0683816](https://github.com/Availity/availity-workflow/commit/0683816))
-   **availity-react-kit:** fix directory casing ([ba31cbf](https://github.com/Availity/availity-workflow/commit/ba31cbf))
-   **availity-react-kit:** fix inconsistent casing of import file names ([96440b3](https://github.com/Availity/availity-workflow/commit/96440b3))
-   **availity-react-kit:** fix named export for api examples ([39cf50a](https://github.com/Availity/availity-workflow/commit/39cf50a))
-   **availity-worfklow-react:** fix negative lookahead in regex. Closes [#130](https://github.com/Availity/availity-workflow/issues/130) ([f9c32db](https://github.com/Availity/availity-workflow/commit/f9c32db))
-   **availity-workflow:** add back commands accidently removed ([d5b0ad7](https://github.com/Availity/availity-workflow/commit/d5b0ad7))
-   **availity-workflow:** double v in commit message ([9ee4c75](https://github.com/Availity/availity-workflow/commit/9ee4c75))
-   **availity-workflow:** handle when proxy context is array ([8ae9e69](https://github.com/Availity/availity-workflow/commit/8ae9e69))
-   **availity-workflow:** Include 'node_modules' when searching for modules ([bf4f057](https://github.com/Availity/availity-workflow/commit/bf4f057))
-   **availity-workflow:** sync webpack start and build stat messages ([0d04f64](https://github.com/Availity/availity-workflow/commit/0d04f64))
-   **availity-workflow-angular:** allow babel for [@availity](https://github.com/availity) packages ([bb43e2a](https://github.com/Availity/availity-workflow/commit/bb43e2a))
-   **availity-workflow-react:** add raf polyfill. Closes [#125](https://github.com/Availity/availity-workflow/issues/125) ([65488de](https://github.com/Availity/availity-workflow/commit/65488de))
-   **availity-workflow-react:** allow babel for [@availity](https://github.com/availity) packages ([5896bf2](https://github.com/Availity/availity-workflow/commit/5896bf2))
-   **availity-workflow-react:** transformIgnorePatterns ([d9e0e85](https://github.com/Availity/availity-workflow/commit/d9e0e85))
-   **availity-workflow-react:** Update webpack config to include node_modules ([5e84e6d](https://github.com/Availity/availity-workflow/commit/5e84e6d))
-   **availity-workflow-settings:** allow option to disable linter. Closes [#126](https://github.com/Availity/availity-workflow/issues/126). ([6eab351](https://github.com/Availity/availity-workflow/commit/6eab351))
-   **cli:** closes [#110](https://github.com/Availity/availity-workflow/issues/110) leverage local eslint when available ([1e6e738](https://github.com/Availity/availity-workflow/commit/1e6e738))
-   **example-angular:** bump bootstrap 3.4.0 for xss ([06aa13e](https://github.com/Availity/availity-workflow/commit/06aa13e))
-   **example-react:** include react-block-ui css ([e6c7311](https://github.com/Availity/availity-workflow/commit/e6c7311))
-   **example-react:** make enforceActions 'observed' ([d72b841](https://github.com/Availity/availity-workflow/commit/d72b841))
-   **example-react:** make enforceActions 'observed' ([e6f88fc](https://github.com/Availity/availity-workflow/commit/e6f88fc))
-   **fontRule:** filename no longer needs hyphen ([cbc0b3c](https://github.com/Availity/availity-workflow/commit/cbc0b3c)), closes [#137](https://github.com/Availity/availity-workflow/issues/137)
-   **mock-data:** add uiDisplayName to providers ([b12989f](https://github.com/Availity/availity-workflow/commit/b12989f))
-   **mock-server:** @availity/mock-data as dependency ([ffc22b8](https://github.com/Availity/availity-workflow/commit/ffc22b8))
-   **proxy:** don't clobber user callbacks ([bdaa6df](https://github.com/Availity/availity-workflow/commit/bdaa6df)), closes [#101](https://github.com/Availity/availity-workflow/issues/101)
-   **react kit:** fix incorrect dep version ([8752047](https://github.com/Availity/availity-workflow/commit/8752047))
-   **react-kit:** add es6-symbol for IE11 ([06880fa](https://github.com/Availity/availity-workflow/commit/06880fa))
-   **workflow:** Cannot read property 'development' of null ([612b8df](https://github.com/Availity/availity-workflow/commit/612b8df)), closes [#199](https://github.com/Availity/availity-workflow/issues/199)
-   **workflow:** add missing packages and fix yargs.argv usage ([b1d2864](https://github.com/Availity/availity-workflow/commit/b1d2864))
-   **workflow:** added as arg to the arrow func ([8843f68](https://github.com/Availity/availity-workflow/commit/8843f68))
-   **workflow:** allow webpack warnings to fallthrough when errors are emitted ([bade285](https://github.com/Availity/availity-workflow/commit/bade285))
-   **workflow:** disable log for webpack middleware ([62d4e44](https://github.com/Availity/availity-workflow/commit/62d4e44))
-   **workflow:** fixed eslint issues ([54e070d](https://github.com/Availity/availity-workflow/commit/54e070d))
-   **workflow:** fixed jest v24 not working ([68156ad](https://github.com/Availity/availity-workflow/commit/68156ad))
-   **workflow:** log proper error ([5b59246](https://github.com/Availity/availity-workflow/commit/5b59246))
-   **workflow:** non-blocking webpack warning ([1a58fb4](https://github.com/Availity/availity-workflow/commit/1a58fb4)), closes [#161](https://github.com/Availity/availity-workflow/issues/161)
-   **workflow:** removed ignore for package-lock file as its required for travis ([4b3a05a](https://github.com/Availity/availity-workflow/commit/4b3a05a))
-   **workflow:** rename bin cmd to work with npx ([2fc1632](https://github.com/Availity/availity-workflow/commit/2fc1632)), closes [/github.com/zkat/npx/blob/6e89dbd5989366e52d3810692b1ab5889a05fbad/parse-args.js#L137-L138](https://github.com//github.com/zkat/npx/blob/6e89dbd5989366e52d3810692b1ab5889a05fbad/parse-args.js/issues/L137-L138)
-   **workflow:** reverted .gitignore -> gitignore ([9d468b6](https://github.com/Availity/availity-workflow/commit/9d468b6))
-   **workflow:** update deps in template package,json ([1ea97ad](https://github.com/Availity/availity-workflow/commit/1ea97ad))
-   **workflow-babel-preset:** enable @babel/plugin-syntax-dynamic-import ([548a567](https://github.com/Availity/availity-workflow/commit/548a567))
-   **workflow-babel-preset:** missing babel-plugin-dynamic-import-node dep ([3406ecb](https://github.com/Availity/availity-workflow/commit/3406ecb))
-   **workflow-plugin-angular:** added eslint-loader as dep for plugin ([bc05d68](https://github.com/Availity/availity-workflow/commit/bc05d68))
-   **workflow-plugin-react:** allow hook into jest setupFiles ([d274f4f](https://github.com/Availity/availity-workflow/commit/d274f4f)), closes [#162](https://github.com/Availity/availity-workflow/issues/162)
-   **workflow-plugin-react:** fix submit callback handler in template ([f0e0339](https://github.com/Availity/availity-workflow/commit/f0e0339))
-   **workflow-plugin-react:** moved polyfills to webpack config ([45fe8b0](https://github.com/Availity/availity-workflow/commit/45fe8b0))
-   **workflow-plugin-react:** removed eslint config from angular plugin ([39a5380](https://github.com/Availity/availity-workflow/commit/39a5380))
-   **workflow-plugin-react:** resolve raf/polyfill ([571cdce](https://github.com/Availity/availity-workflow/commit/571cdce))
-   **workflow-react:** fix jest transform pattern ([8072230](https://github.com/Availity/availity-workflow/commit/8072230))
-   **workflow-react, worfkow-angular:** closes [#118](https://github.com/Availity/availity-workflow/issues/118) use recommend head settings in html templates ([a1160e2](https://github.com/Availity/availity-workflow/commit/a1160e2))
-   **workflow-react, worfkow-angular:** use recommend head settings in html templates ([a27096a](https://github.com/Availity/availity-workflow/commit/a27096a))
-   **workflow-settings:** css import error ([9b8611a](https://github.com/Availity/availity-workflow/commit/9b8611a)), closes [#165](https://github.com/Availity/availity-workflow/issues/165)
-   **workflow-settings:** disable source maps in less ([b48ee33](https://github.com/Availity/availity-workflow/commit/b48ee33))
-   **workflow-settings:** emit warnings for eslint errors in webpack ([724627e](https://github.com/Availity/availity-workflow/commit/724627e)), closes [#204](https://github.com/Availity/availity-workflow/issues/204)
-   **workflow-settings:** fixed a bug where regex would not work properly on windows ([f6aa0f2](https://github.com/Availity/availity-workflow/commit/f6aa0f2))
-   **workflow-settings:** fixed incorrect regex pattern ([8d355dc](https://github.com/Availity/availity-workflow/commit/8d355dc))
-   **workflow-settings:** regex for sass was not strict ([47249ea](https://github.com/Availity/availity-workflow/commit/47249ea))
-   **workflow-settings:** remove invalid options for css loader ([87eaaf4](https://github.com/Availity/availity-workflow/commit/87eaaf4))
-   **workflow-settings:** support only IE11+ ([21cb79a](https://github.com/Availity/availity-workflow/commit/21cb79a))
-   **workflow-settings:** uodate mock-data package name ([cf03e13](https://github.com/Availity/availity-workflow/commit/cf03e13))
-   babel should compile [@av](https://github.com/av) namespace ([8cd92fe](https://github.com/Availity/availity-workflow/commit/8cd92fe))
-   cache bust generated css file names ([4bf0f9a](https://github.com/Availity/availity-workflow/commit/4bf0f9a))
-   fix fonts/css output in production build ([b021dbc](https://github.com/Availity/availity-workflow/commit/b021dbc))
-   include [@av](https://github.com/av) during babel and jest ([9468ac6](https://github.com/Availity/availity-workflow/commit/9468ac6))
-   production/profiling webpack splitting ([23456d8](https://github.com/Availity/availity-workflow/commit/23456d8))
-   remove reduceIdents from css optimization ([d37b0cf](https://github.com/Availity/availity-workflow/commit/d37b0cf))
-   remove zindex optimization ([fd07b15](https://github.com/Availity/availity-workflow/commit/fd07b15))
-   **workflow-settings:** wrong options for css loader ([0014f31](https://github.com/Availity/availity-workflow/commit/0014f31))

### chore

-   **availity-worfklow:** enforce Node v8.0 ([a20e1c1](https://github.com/Availity/availity-workflow/commit/a20e1c1))
-   **availity-workflow-react:** update react-hot-loader ([3b60424](https://github.com/Availity/availity-workflow/commit/3b60424))
-   **availity-workflow-settings:** use IE11 default target ([129806f](https://github.com/Availity/availity-workflow/commit/129806f))
-   upgrade deps ([702872e](https://github.com/Availity/availity-workflow/commit/702872e))

### Code Refactoring

-   **mock-server:** remove server events ([2cb477b](https://github.com/Availity/availity-workflow/commit/2cb477b))

### Features

-   **availit-mock-data:** integrate mock data. Closes [#128](https://github.com/Availity/availity-workflow/issues/128) ([bbc9043](https://github.com/Availity/availity-workflow/commit/bbc9043))
-   **availity-mock-data:** add spaces collection query ([84f1750](https://github.com/Availity/availity-workflow/commit/84f1750))
-   **availity-mock-server:** add patch support for tus ([4945642](https://github.com/Availity/availity-workflow/commit/4945642))
-   **availity-mock-server:** integrate mock server. Closes [#127](https://github.com/Availity/availity-workflow/issues/127) ([79b156c](https://github.com/Availity/availity-workflow/commit/79b156c))
-   **availity-workflow:** add env info in about messages ([3866998](https://github.com/Availity/availity-workflow/commit/3866998))
-   **availity-workflow:** add option to allow user to modify the webpack config ([872dad2](https://github.com/Availity/availity-workflow/commit/872dad2)), closes [#134](https://github.com/Availity/availity-workflow/issues/134) [#146](https://github.com/Availity/availity-workflow/issues/146)
-   **availity-workflow:** add option to disable linter ([572dee0](https://github.com/Availity/availity-workflow/commit/572dee0))
-   **availity-workflow:** allow custom commit message on release ([09f284c](https://github.com/Availity/availity-workflow/commit/09f284c))
-   **availity-workflow-angular:** add webpack DuplicatePackageCheckerPlugin to development ([27b2f2e](https://github.com/Availity/availity-workflow/commit/27b2f2e))
-   **availity-workflow-angular:** upgrade uglifyjs. Closes [#131](https://github.com/Availity/availity-workflow/issues/131). ([5a788d2](https://github.com/Availity/availity-workflow/commit/5a788d2))
-   **availity-workflow-angular:** use jest for testing ([07e8110](https://github.com/Availity/availity-workflow/commit/07e8110))
-   **availity-workflow-react:** add webpack DuplicatePackageCheckerPlugin to development ([1c36d8e](https://github.com/Availity/availity-workflow/commit/1c36d8e))
-   **availity-workflow-react:** upgrade uglifyjs. Closes [#131](https://github.com/Availity/availity-workflow/issues/131). ([531bdb5](https://github.com/Availity/availity-workflow/commit/531bdb5))
-   **availity-workflow-settings:** proxy /ms path ([dd78d7e](https://github.com/Availity/availity-workflow/commit/dd78d7e))
-   cli init to bootstrap new app ([f6891af](https://github.com/Availity/availity-workflow/commit/f6891af))
-   **build:** expose build via av build ([d6ac419](https://github.com/Availity/availity-workflow/commit/d6ac419))
-   **example-angular:** angular v1.7 ([2d595b8](https://github.com/Availity/availity-workflow/commit/2d595b8))
-   **example-react:** add react sample project ([cb6a56e](https://github.com/Availity/availity-workflow/commit/cb6a56e))
-   **example-react:** add react-testing-library ([841793f](https://github.com/Availity/availity-workflow/commit/841793f))
-   **settings:** allow merge function ([3427d7c](https://github.com/Availity/availity-workflow/commit/3427d7c))
-   generate sorcemaps for production builds ([c13c87e](https://github.com/Availity/availity-workflow/commit/c13c87e))
-   **upgrader:** created upgrader package for upgrading to v5 ([b7f97e6](https://github.com/Availity/availity-workflow/commit/b7f97e6))
-   **workflow:** accept version when running release ([50c76e6](https://github.com/Availity/availity-workflow/commit/50c76e6)), closes [#175](https://github.com/Availity/availity-workflow/issues/175)
-   **workflow:** added ability to create workflow project in current dir ([b460605](https://github.com/Availity/availity-workflow/commit/b460605))
-   **workflow-logger:** add warning message ([8abf42f](https://github.com/Availity/availity-workflow/commit/8abf42f))
-   **workflow-plugin-react:** added webpack config for eslint-config-availity ([4454457](https://github.com/Availity/availity-workflow/commit/4454457))
-   **workflow-plugin-react:** allow developers to include for jest to babel compile ([4136c9e](https://github.com/Availity/availity-workflow/commit/4136c9e))
-   **workflow-plugin-react:** enable code splitting ([bba4039](https://github.com/Availity/availity-workflow/commit/bba4039))
-   **workflow-plugin-react:** eslint-config-availity runs now before babl ([22e62a4](https://github.com/Availity/availity-workflow/commit/22e62a4))
-   **workflow-plugin-react:** update template ([dab0320](https://github.com/Availity/availity-workflow/commit/dab0320))
-   add gitignore to the init templates ([e16b74f](https://github.com/Availity/availity-workflow/commit/e16b74f))
-   upgrade to webpack 4 ([60d531a](https://github.com/Availity/availity-workflow/commit/60d531a))
-   **workflow-settings:** allow developers to include packages for babel ([96cf764](https://github.com/Availity/availity-workflow/commit/96cf764))

### Performance Improvements

-   **react, angular:** closes [#117](https://github.com/Availity/availity-workflow/issues/117) disable hmr in production ([9d51692](https://github.com/Availity/availity-workflow/commit/9d51692))

### BREAKING CHANGES

-   upgrade to babel 7, eslint 5, eslint-config-airbnb 17
-   **mock-server:** server lifecycle events are not longer emmitted
-   **availity-workflow-angular:** workflow-angular-kit no longer works with karma. Porjects with karma will need to add jest.init.js. See the current workflow-angular-kit jest.init.js for reference. Also, they can remove karma and webpack test config files as they are no longer used.
-   **availity-workflow-settings:** IE9 no longer supported for babel
-   **availity-workflow-react:** react hot loader v3 no longer works, workflow-react-kit packages with the old react hot loader usage will need to remove the usage. See the current workflow-react-kit index.js and App.js for reference.
-   **availity-worfklow:** Minimum requirement to run workflow is now Node 8. There are no API changes.

<a name="5.2.5"></a>

## [5.2.5](https://github.com/Availity/availity-workflow/compare/v5.2.4...v5.2.5) (2019-04-15)

<a name="5.2.4"></a>

## [5.2.4](https://github.com/Availity/availity-workflow/compare/v5.2.3...v5.2.4) (2019-04-12)

### Bug Fixes

-   **workflow-settings:** emit warnings for eslint errors in webpack ([724627e](https://github.com/Availity/availity-workflow/commit/724627e)), closes [#204](https://github.com/Availity/availity-workflow/issues/204)

<a name="5.2.3"></a>

## [5.2.3](https://github.com/Availity/availity-workflow/compare/v5.2.2...v5.2.3) (2019-04-11)

<a name="5.2.2"></a>

## [5.2.2](https://github.com/Availity/availity-workflow/compare/v5.2.1...v5.2.2) (2019-04-11)

<a name="5.2.1"></a>

## [5.2.1](https://github.com/Availity/availity-workflow/compare/v5.2.0...v5.2.1) (2019-04-11)

### Bug Fixes

-   **workflow-plugin-react:** moved polyfills to webpack config ([45fe8b0](https://github.com/Availity/availity-workflow/commit/45fe8b0))

<a name="5.2.0"></a>

# [5.2.0](https://github.com/Availity/availity-workflow/compare/v5.1.0...v5.2.0) (2019-04-02)

### Bug Fixes

-   **example-react:** include react-block-ui css ([e6c7311](https://github.com/Availity/availity-workflow/commit/e6c7311))
-   **workflow-settings:** fixed a bug where regex would not work properly on windows ([f6aa0f2](https://github.com/Availity/availity-workflow/commit/f6aa0f2))
-   **workflow-settings:** fixed incorrect regex pattern ([8d355dc](https://github.com/Availity/availity-workflow/commit/8d355dc))

<a name="5.1.0"></a>

# [5.1.0](https://github.com/Availity/availity-workflow/compare/v5.0.2...v5.1.0) (2019-03-29)

### Features

-   **workflow:** added ability to create app in the current directory -> gitignore ([b460605](https://github.com/Availity/availity-workflow/commit/b460605))

<a name="5.0.0"></a>

# [5.0.0](https://github.com/Availity/availity-workflow/compare/v5.0.0-alpha.8...v5.0.0) (2019-02-05)

### Bug Fixes

-   **example-angular:** bump bootstrap 3.4.0 for xss ([06aa13e](https://github.com/Availity/availity-workflow/commit/06aa13e))
-   **example-react:** make enforceActions 'observed' ([e6f88fc](https://github.com/Availity/availity-workflow/commit/e6f88fc))
-   **workflow:** fixed jest v24 not working ([68156ad](https://github.com/Availity/availity-workflow/commit/68156ad))
-   **workflow:** removed ignore for package-lock file as its required for travis ([4b3a05a](https://github.com/Availity/availity-workflow/commit/4b3a05a))

<a name="5.0.0-alpha.8"></a>

# [5.0.0-alpha.8](https://github.com/Availity/availity-workflow/compare/v5.0.0-alpha.7...v5.0.0-alpha.8) (2019-01-29)

### Bug Fixes

-   **workflow:** reverted .gitignore -> gitignore ([9d468b6](https://github.com/Availity/availity-workflow/commit/9d468b6))

<a name="5.0.0-alpha.7"></a>

# [5.0.0-alpha.7](https://github.com/Availity/availity-workflow/compare/v5.0.0-alpha.6...v5.0.0-alpha.7) (2019-01-29)

### Bug Fixes

-   **workflow:** fixed eslint issues ([54e070d](https://github.com/Availity/availity-workflow/commit/54e070d))

<a name="5.0.0-alpha.6"></a>

# [5.0.0-alpha.6](https://github.com/Availity/availity-workflow/compare/v5.0.0-alpha.5...v5.0.0-alpha.6) (2019-01-29)

### Bug Fixes

-   **workflow-plugin-react:** removed eslint config from angular plugin ([39a5380](https://github.com/Availity/availity-workflow/commit/39a5380))

### Features

-   **example-react:** add react-testing-library ([841793f](https://github.com/Availity/availity-workflow/commit/841793f))
-   **workflow-plugin-react:** added webpack config for eslint-config-availity ([4454457](https://github.com/Availity/availity-workflow/commit/4454457))
-   **workflow-plugin-react:** allow developers to include for jest to babel compile ([4136c9e](https://github.com/Availity/availity-workflow/commit/4136c9e))
-   **workflow-plugin-react:** eslint-config-availity runs now before babl ([22e62a4](https://github.com/Availity/availity-workflow/commit/22e62a4))

<a name="5.0.0-alpha.5"></a>

# [5.0.0-alpha.5](https://github.com/Availity/availity-workflow/compare/v5.0.0-alpha.4...v5.0.0-alpha.5) (2019-01-04)

### Bug Fixes

-   **workflow-babel-preset:** missing babel-plugin-dynamic-import-node dep ([3406ecb](https://github.com/Availity/availity-workflow/commit/3406ecb))

<a name="5.0.0-alpha.4"></a>

# [5.0.0-alpha.4](https://github.com/Availity/availity-workflow/compare/v5.0.0-alpha.3...v5.0.0-alpha.4) (2019-01-04)

### Bug Fixes

-   **workflow-settings:** regex for sass was not strict ([47249ea](https://github.com/Availity/availity-workflow/commit/47249ea))

<a name="5.0.0-alpha.3"></a>

# [5.0.0-alpha.3](https://github.com/Availity/availity-workflow/compare/v5.0.0-alpha.2...v5.0.0-alpha.3) (2019-01-03)

### Bug Fixes

-   **mock-server:** [@availity](https://github.com/availity)/mock-data as dependency ([ffc22b8](https://github.com/Availity/availity-workflow/commit/ffc22b8))
-   **workflow:** log proper error ([5b59246](https://github.com/Availity/availity-workflow/commit/5b59246))
-   **workflow-babel-preset:** enable [@babel](https://github.com/babel)/plugin-syntax-dynamic-import ([548a567](https://github.com/Availity/availity-workflow/commit/548a567))

### Features

-   **example-angular:** angular v1.7 ([2d595b8](https://github.com/Availity/availity-workflow/commit/2d595b8))
-   **workflow-plugin-react:** enable code splitting ([bba4039](https://github.com/Availity/availity-workflow/commit/bba4039))
-   **workflow-settings:** allow developers to include packages for babel ([96cf764](https://github.com/Availity/availity-workflow/commit/96cf764))

<a name="5.0.0-alpha.2"></a>

# [5.0.0-alpha.2](https://github.com/Availity/availity-workflow/compare/v5.0.0-alpha.1...v5.0.0-alpha.2) (2018-12-21)

### Bug Fixes

-   **workflow-settings:** wrong options for css loader ([0014f31](https://github.com/Availity/availity-workflow/commit/0014f31))

<a name="5.0.0-alpha.1"></a>

# [5.0.0-alpha.1](https://github.com/Availity/availity-workflow/compare/v5.0.0-alpha.0...v5.0.0-alpha.1) (2018-12-21)

<a name="5.0.0-alpha.0"></a>

# [5.0.0-alpha.0](https://github.com/Availity/availity-workflow/compare/v4.0.3...v5.0.0-alpha.0) (2018-12-15)

### Bug Fixes

-   **example-react:** make enforceActions 'observed' ([d72b841](https://github.com/Availity/availity-workflow/commit/d72b841))
-   **workflow-settings:** remove invalid options for css loader ([87eaaf4](https://github.com/Availity/availity-workflow/commit/87eaaf4))

### Chores

-   upgrade deps ([702872e](https://github.com/Availity/availity-workflow/commit/702872e))

### BREAKING CHANGES

-   upgrade to babel 7, eslint 5, eslint-config-airbnb 17

<a name="4.0.3"></a>

## [4.0.3](https://github.com/Availity/availity-workflow/compare/v4.0.2...v4.0.3) (2018-10-26)

### Bug Fixes

-   remove reduceIdents from css optimization ([d37b0cf](https://github.com/Availity/availity-workflow/commit/d37b0cf))
-   **workflow-settings:** disable source maps in less ([b48ee33](https://github.com/Availity/availity-workflow/commit/b48ee33))

<a name="4.0.2"></a>

## [4.0.2](https://github.com/Availity/availity-workflow/compare/v4.0.1...v4.0.2) (2018-08-23)

### Bug Fixes

-   remove zindex optimization ([fd07b15](https://github.com/Availity/availity-workflow/commit/fd07b15))
-   **workflow:** disable log for webpack middleware ([62d4e44](https://github.com/Availity/availity-workflow/commit/62d4e44))

<a name="4.0.1"></a>

## [4.0.1](https://github.com/Availity/availity-workflow/compare/v4.0.0...v4.0.1) (2018-08-16)

<a name="4.0.0"></a>

# [4.0.0](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.18...v4.0.0) (2018-08-16)

<a name="4.0.0-alpha.18"></a>

# [4.0.0-alpha.18](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.17...v4.0.0-alpha.18) (2018-07-25)

### Features

-   generate sorcemaps for production builds ([c13c87e](https://github.com/Availity/availity-workflow/commit/c13c87e))

<a name="4.0.0-alpha.17"></a>

# [4.0.0-alpha.17](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.16...v4.0.0-alpha.17) (2018-07-18)

### Bug Fixes

-   cache bust generated css file names ([4bf0f9a](https://github.com/Availity/availity-workflow/commit/4bf0f9a))

<a name="4.0.0-alpha.16"></a>

# [4.0.0-alpha.16](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.15...v4.0.0-alpha.16) (2018-06-22)

### Bug Fixes

-   **mock-data:** add uiDisplayName to providers ([b12989f](https://github.com/Availity/availity-workflow/commit/b12989f))

<a name="4.0.0-alpha.15"></a>

# [4.0.0-alpha.15](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.14...v4.0.0-alpha.15) (2018-06-21)

### Features

-   **workflow:** accept version when running release ([50c76e6](https://github.com/Availity/availity-workflow/commit/50c76e6)), closes [#175](https://github.com/Availity/availity-workflow/issues/175)

<a name="4.0.0-alpha.14"></a>

# [4.0.0-alpha.14](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.13...v4.0.0-alpha.14) (2018-05-22)

### Bug Fixes

-   include [@av](https://github.com/av) during babel and jest ([9468ac6](https://github.com/Availity/availity-workflow/commit/9468ac6))

<a name="4.0.0-alpha.13"></a>

# [4.0.0-alpha.13](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.12...v4.0.0-alpha.13) (2018-05-21)

### Bug Fixes

-   babel should compile [@av](https://github.com/av) namespace ([8cd92fe](https://github.com/Availity/availity-workflow/commit/8cd92fe))

<a name="4.0.0-alpha.12"></a>

# [4.0.0-alpha.12](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.11...v4.0.0-alpha.12) (2018-05-16)

### Bug Fixes

-   fix fonts/css output in production build ([b021dbc](https://github.com/Availity/availity-workflow/commit/b021dbc))

### Features

-   add gitignore to the init templates ([e16b74f](https://github.com/Availity/availity-workflow/commit/e16b74f))

<a name="4.0.0-alpha.11"></a>

# [4.0.0-alpha.11](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.10...v4.0.0-alpha.11) (2018-04-26)

### Bug Fixes

-   **workflow-plugin-react:** allow hook into jest setupFiles ([d274f4f](https://github.com/Availity/availity-workflow/commit/d274f4f)), closes [#162](https://github.com/Availity/availity-workflow/issues/162)

<a name="4.0.0-alpha.10"></a>

# [4.0.0-alpha.10](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.9...v4.0.0-alpha.10) (2018-04-26)

### Bug Fixes

-   **workflow:** allow webpack warnings to fallthrough when errors are emitted ([bade285](https://github.com/Availity/availity-workflow/commit/bade285))
-   **workflow-plugin-react:** resolve raf/polyfill ([571cdce](https://github.com/Availity/availity-workflow/commit/571cdce))
-   **workflow-settings:** css import error ([9b8611a](https://github.com/Availity/availity-workflow/commit/9b8611a)), closes [#165](https://github.com/Availity/availity-workflow/issues/165)
-   **workflow-settings:** support only IE11+ ([21cb79a](https://github.com/Availity/availity-workflow/commit/21cb79a))

### Features

-   **example-react:** add react sample project ([cb6a56e](https://github.com/Availity/availity-workflow/commit/cb6a56e))

<a name="4.0.0-alpha.9"></a>

# [4.0.0-alpha.9](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.8...v4.0.0-alpha.9) (2018-04-26)

### Bug Fixes

-   **workflow:** non-blocking webpack warning ([1a58fb4](https://github.com/Availity/availity-workflow/commit/1a58fb4)), closes [#161](https://github.com/Availity/availity-workflow/issues/161)

### Features

-   **workflow-logger:** add warning message ([8abf42f](https://github.com/Availity/availity-workflow/commit/8abf42f))

<a name="4.0.0-alpha.8"></a>

# [4.0.0-alpha.8](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.7...v4.0.0-alpha.8) (2018-04-24)

### Bug Fixes

-   **workflow-plugin-react:** fix submit callback handler in template ([f0e0339](https://github.com/Availity/availity-workflow/commit/f0e0339))

### Features

-   **workflow-plugin-react:** update template ([dab0320](https://github.com/Availity/availity-workflow/commit/dab0320))

<a name="4.0.0-alpha.7"></a>

# [4.0.0-alpha.7](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.6...v4.0.0-alpha.7) (2018-04-23)

### Code Refactoring

-   **mock-server:** remove server events ([2cb477b](https://github.com/Availity/availity-workflow/commit/2cb477b))

### BREAKING CHANGES

-   **mock-server:** server lifecycle events are not longer emmitted

<a name="4.0.0-alpha.6"></a>

# [4.0.0-alpha.6](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.5...v4.0.0-alpha.6) (2018-04-13)

### Bug Fixes

-   production/profiling webpack splitting ([23456d8](https://github.com/Availity/availity-workflow/commit/23456d8))

### Features

-   upgrade to webpack 4 ([60d531a](https://github.com/Availity/availity-workflow/commit/60d531a))

<a name="4.0.0-alpha.5"></a>

# [4.0.0-alpha.5](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.4...v4.0.0-alpha.5) (2018-04-05)

<a name="4.0.0-alpha.4"></a>

# [4.0.0-alpha.4](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.3...v4.0.0-alpha.4) (2018-04-04)

### Bug Fixes

-   **workflow-settings:** uodate mock-data package name ([cf03e13](https://github.com/Availity/availity-workflow/commit/cf03e13))

<a name="4.0.0-alpha.3"></a>

# [4.0.0-alpha.3](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.2...v4.0.0-alpha.3) (2018-04-04)

### Bug Fixes

-   **workflow:** update deps in template package,json ([1ea97ad](https://github.com/Availity/availity-workflow/commit/1ea97ad))

<a name="4.0.0-alpha.2"></a>

# [4.0.0-alpha.2](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.1...v4.0.0-alpha.2) (2018-04-04)

### Bug Fixes

-   **workflow:** add missing packages and fix yargs.argv usage ([b1d2864](https://github.com/Availity/availity-workflow/commit/b1d2864))

<a name="4.0.0-alpha.1"></a>

# [4.0.0-alpha.1](https://github.com/Availity/availity-workflow/compare/v4.0.0-alpha.0...v4.0.0-alpha.1) (2018-04-04)

### Bug Fixes

-   **workflow:** rename bin cmd to work with npx ([2fc1632](https://github.com/Availity/availity-workflow/commit/2fc1632)), closes [/github.com/zkat/npx/blob/6e89dbd5989366e52d3810692b1ab5889a05fbad/parse-args.js#L137-L138](https://github.com//github.com/zkat/npx/blob/6e89dbd5989366e52d3810692b1ab5889a05fbad/parse-args.js/issues/L137-L138)

<a name="4.0.0-alpha.0"></a>

# [4.0.0-alpha.0](https://github.com/Availity/availity-workflow/compare/v3.2.1...v4.0.0-alpha.0) (2018-04-04)

### Bug Fixes

-   **availitiy-workflow-angular:** enable allChunks in ExtractTextPlugin ([cd5a6dc](https://github.com/Availity/availity-workflow/commit/cd5a6dc)), closes [#141](https://github.com/Availity/availity-workflow/issues/141)
-   **availitiy-workflow-react:** enable allChunks in ExtractTextPlugin ([d5bacfb](https://github.com/Availity/availity-workflow/commit/d5bacfb)), closes [#141](https://github.com/Availity/availity-workflow/issues/141)
-   **availity-react-kit:** fix directory casing ([ba31cbf](https://github.com/Availity/availity-workflow/commit/ba31cbf))
-   **availity-workflow:** handle when proxy context is array ([8ae9e69](https://github.com/Availity/availity-workflow/commit/8ae9e69))

### Chores

-   **availity-workflow-react:** update react-hot-loader ([3b60424](https://github.com/Availity/availity-workflow/commit/3b60424))
-   **availity-workflow-settings:** use IE11 default target ([129806f](https://github.com/Availity/availity-workflow/commit/129806f))

### Features

-   **availity-workflow-angular:** use jest for testing ([07e8110](https://github.com/Availity/availity-workflow/commit/07e8110))
-   cli init to bootstrap new app ([f6891af](https://github.com/Availity/availity-workflow/commit/f6891af))

### BREAKING CHANGES

-   **availity-workflow-angular:** workflow-angular-kit no longer works with karma. Porjects with karma will need to add jest.init.js. See the current workflow-angular-kit jest.init.js for reference. Also, they can remove karma and webpack test config files as they are no longer used.
-   **availity-workflow-settings:** IE9 no longer supported for babel
-   **availity-workflow-react:** react hot loader v3 no longer works, workflow-react-kit packages with the old react hot loader usage will need to remove the usage. See the current workflow-react-kit index.js and App.js for reference.

<a name="3.1.3"></a>

## [3.1.3](https://github.com/Availity/availity-workflow/compare/v3.1.2...v3.1.3) (2018-03-05)

<a name="3.2.1"></a>

## [3.2.1](https://github.com/Availity/availity-workflow/compare/v3.2.0...v3.2.1) (2018-03-14)

### Bug Fixes

-   **availity-workflow:** Include 'node_modules' when searching for modules ([bf4f057](https://github.com/Availity/availity-workflow/commit/bf4f057))
-   **availity-workflow-react:** Update webpack config to include node_modules ([5e84e6d](https://github.com/Availity/availity-workflow/commit/5e84e6d))

<a name="3.2.0"></a>

# [3.2.0](https://github.com/Availity/availity-workflow/compare/v3.1.2...v3.2.0) (2018-03-12)

### Bug Fixes

-   **availity-react-kit:** fix inconsistent casing of import file names ([96440b3](https://github.com/Availity/availity-workflow/commit/96440b3))

### Features

-   **availity-workflow:** add option to allow user to modify the webpack config ([872dad2](https://github.com/Availity/availity-workflow/commit/872dad2)), closes [#134](https://github.com/Availity/availity-workflow/issues/134) [#146](https://github.com/Availity/availity-workflow/issues/146)

<a name="3.1.2"></a>

## [3.1.2](https://github.com/Availity/availity-workflow/compare/v3.1.1...v3.1.2) (2018-03-02)

### Bug Fixes

-   **availity-workflow:** double v in commit message ([9ee4c75](https://github.com/Availity/availity-workflow/commit/9ee4c75))

<a name="3.1.1"></a>

## [3.1.1](https://github.com/Availity/availity-workflow/compare/v3.1.0...v3.1.1) (2018-03-02)

### Features

-   **availity-workflow:** allow custom commit message on release ([09f284c](https://github.com/Availity/availity-workflow/commit/09f284c))

<a name="3.1.0"></a>

# [3.1.0](https://github.com/Availity/availity-workflow/compare/v3.0.0...v3.1.0) (2018-01-18)

### Bug Fixes

-   **availity-angular-kit:** stringify the error from karma ([31e75e3](https://github.com/Availity/availity-workflow/commit/31e75e3))
-   **availity-mock-server:** return correct status for resumable upload route ([0563d49](https://github.com/Availity/availity-workflow/commit/0563d49))
-   **availity-workflow:** sync webpack start and build stat messages ([0d04f64](https://github.com/Availity/availity-workflow/commit/0d04f64))
-   **availity-workflow-settings:** allow option to disable linter. Closes [#126](https://github.com/Availity/availity-workflow/issues/126). ([6eab351](https://github.com/Availity/availity-workflow/commit/6eab351))
-   **fontRule:** filename no longer needs hyphen ([cbc0b3c](https://github.com/Availity/availity-workflow/commit/cbc0b3c)), closes [#137](https://github.com/Availity/availity-workflow/issues/137)

### Features

-   **availity-workflow:** add option to disable linter ([572dee0](https://github.com/Availity/availity-workflow/commit/572dee0))
-   **availity-workflow-angular:** add webpack DuplicatePackageCheckerPlugin to development ([27b2f2e](https://github.com/Availity/availity-workflow/commit/27b2f2e))
-   **availity-workflow-angular:** upgrade uglifyjs. Closes [#131](https://github.com/Availity/availity-workflow/issues/131). ([5a788d2](https://github.com/Availity/availity-workflow/commit/5a788d2))
-   **availity-workflow-react:** add webpack DuplicatePackageCheckerPlugin to development ([1c36d8e](https://github.com/Availity/availity-workflow/commit/1c36d8e))
-   **availity-workflow-react:** upgrade uglifyjs. Closes [#131](https://github.com/Availity/availity-workflow/issues/131). ([531bdb5](https://github.com/Availity/availity-workflow/commit/531bdb5))

<a name="3.0.0"></a>

# [3.0.0](https://github.com/Availity/availity-workflow/compare/v2.7.0...v3.0.0) (2018-01-13)

### Bug Fixes

-   **availity-mock-server:** set response headers and unit test ([d7ab013](https://github.com/Availity/availity-workflow/commit/d7ab013))
-   **availity-workflow:** add back commands accidently removed ([d5b0ad7](https://github.com/Availity/availity-workflow/commit/d5b0ad7))

### Chores

-   **availity-worfklow:** enforce Node v8.0 ([a20e1c1](https://github.com/Availity/availity-workflow/commit/a20e1c1))

### Features

-   **availity-mock-server:** add patch support for tus ([4945642](https://github.com/Availity/availity-workflow/commit/4945642))
-   **availity-workflow:** add env info in about messages ([3866998](https://github.com/Availity/availity-workflow/commit/3866998))
-   **availity-workflow-settings:** proxy /ms path ([dd78d7e](https://github.com/Availity/availity-workflow/commit/dd78d7e))

### BREAKING CHANGES

-   **availity-worfklow:** Minimum requirement to run workflow is now Node 8. There are no API changes.

<a name="2.7.4"></a>

## [2.7.4](https://github.com/Availity/availity-workflow/compare/v2.7.3...v2.7.4) (2018-03-26)

### Bug Fixes

-   **availity-workflow:** include 'node_modules' when searching for modules ([aef46d3](https://github.com/Availity/availity-workflow/commit/aef46d3))

<a name="2.7.3"></a>

## [2.7.3](https://github.com/Availity/availity-workflow/compare/v2.7.2...v2.7.3) (2018-03-02)

### Bug Fixes

-   **availity-worfklow:** v appended twice ([4cd6389](https://github.com/Availity/availity-workflow/commit/4cd6389))

<a name="2.7.2"></a>

## [2.7.2](https://github.com/Availity/availity-workflow/compare/v2.7.1...v2.7.2) (2018-03-02)

### Bug Fixes

-   **availity-workflow:** add message option for release command ([2297786](https://github.com/Availity/availity-workflow/commit/2297786))
-   **availity-workflow:** allow custom commit messages when releasing ([ead04e8](https://github.com/Availity/availity-workflow/commit/ead04e8))
-   **availity-workflow:** allow custom commit messages when releasing ([c1f6e5b](https://github.com/Availity/availity-workflow/commit/c1f6e5b))

<a name="2.7.1"></a>

## [2.7.1](https://github.com/Availity/availity-workflow/compare/v2.7.0...v2.7.1) (2018-02-16)

### Bug Fixes

-   **availity-mock-data:** use Node 6 compat syntax. Closes [#135](https://github.com/Availity/availity-workflow/issues/130) ([c970587](https://github.com/Availity/availity-workflow/commit/c970587))

<a name="2.7.0"></a>

# [2.7.0](https://github.com/Availity/availity-workflow/compare/v2.6.5...v2.7.0) (2018-01-08)

### Bug Fixes

-   **availity-mock-data:** spaces collection in wrong folder ([3ce0a66](https://github.com/Availity/availity-workflow/commit/3ce0a66))
-   **availity-react-kit:** add pageName to breadcrumbs example ([0683816](https://github.com/Availity/availity-workflow/commit/0683816))
-   **availity-worfklow-react:** fix negative lookahead in regex. Closes [#130](https://github.com/Availity/availity-workflow/issues/130) ([f9c32db](https://github.com/Availity/availity-workflow/commit/f9c32db))
-   **availity-workflow-react:** add raf polyfill. Closes [#125](https://github.com/Availity/availity-workflow/issues/125) ([65488de](https://github.com/Availity/availity-workflow/commit/65488de))
-   **availity-workflow-react:** transformIgnorePatterns ([d9e0e85](https://github.com/Availity/availity-workflow/commit/d9e0e85))

### Features

-   **availit-mock-data:** integrate mock data. Closes [#128](https://github.com/Availity/availity-workflow/issues/128) ([bbc9043](https://github.com/Availity/availity-workflow/commit/bbc9043))
-   **availity-mock-data:** add spaces collection query ([84f1750](https://github.com/Availity/availity-workflow/commit/84f1750))
-   **availity-mock-server:** integrate mock server. Closes [#127](https://github.com/Availity/availity-workflow/issues/127) ([79b156c](https://github.com/Availity/availity-workflow/commit/79b156c))

<a name="2.6.5"></a>

## [2.6.5](https://github.com/Availity/availity-workflow/compare/v2.6.4...v2.6.5) (2017-12-21)

### Bug Fixes

-   **availity-react-kit:** fix named export for api examples ([39cf50a](https://github.com/Availity/availity-workflow/commit/39cf50a))
-   **availity-workflow-angular:** allow babel for [@availity](https://github.com/availity) packages ([bb43e2a](https://github.com/Availity/availity-workflow/commit/bb43e2a))
-   **availity-workflow-react:** allow babel for [@availity](https://github.com/availity) packages ([5896bf2](https://github.com/Availity/availity-workflow/commit/5896bf2))
-   **workflow-react:** fix jest transform pattern ([8072230](https://github.com/Availity/availity-workflow/commit/8072230))

<a name="2.6.4"></a>

## [2.6.4](https://github.com/Availity/availity-workflow/compare/v2.6.3...v2.6.4) (2017-11-12)

### Bug Fixes

-   **cli:** closes [#110](https://github.com/Availity/availity-workflow/issues/110) leverage local eslint when available ([1e6e738](https://github.com/Availity/availity-workflow/commit/1e6e738))
-   **react kit:** fix incorrect dep version ([8752047](https://github.com/Availity/availity-workflow/commit/8752047))
-   **react-kit:** add es6-symbol for IE11 ([06880fa](https://github.com/Availity/availity-workflow/commit/06880fa))
-   **workflow-react, worfkow-angular:** closes [#118](https://github.com/Availity/availity-workflow/issues/118) use recommend head settings in html templates ([a1160e2](https://github.com/Availity/availity-workflow/commit/a1160e2))
-   **workflow-react, worfkow-angular:** use recommend head settings in html templates ([a27096a](https://github.com/Availity/availity-workflow/commit/a27096a))

### Performance Improvements

-   **react, angular:** closes [#117](https://github.com/Availity/availity-workflow/issues/117) disable hmr in production ([9d51692](https://github.com/Availity/availity-workflow/commit/9d51692))
