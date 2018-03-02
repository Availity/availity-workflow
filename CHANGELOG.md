<a name="3.1.1"></a>
## [3.1.1](https://github.com/Availity/availity-workflow/compare/v3.1.0...v3.1.1) (2018-03-02)


### Features

* **availity-workflow:** allow custom commit message on release ([09f284c](https://github.com/Availity/availity-workflow/commit/09f284c))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/Availity/availity-workflow/compare/v3.0.0...v3.1.0) (2018-01-18)


### Bug Fixes

* **availity-angular-kit:** stringify the error from karma ([31e75e3](https://github.com/Availity/availity-workflow/commit/31e75e3))
* **availity-mock-server:** return correct status for resumable upload route ([0563d49](https://github.com/Availity/availity-workflow/commit/0563d49))
* **availity-workflow:** sync webpack start and build stat messages ([0d04f64](https://github.com/Availity/availity-workflow/commit/0d04f64))
* **availity-workflow-settings:** allow option to disable linter. Closes [#126](https://github.com/Availity/availity-workflow/issues/126). ([6eab351](https://github.com/Availity/availity-workflow/commit/6eab351))
* **fontRule:** filename no longer needs hyphen ([cbc0b3c](https://github.com/Availity/availity-workflow/commit/cbc0b3c)), closes [#137](https://github.com/Availity/availity-workflow/issues/137)


### Features

* **availity-workflow:** add option to disable linter ([572dee0](https://github.com/Availity/availity-workflow/commit/572dee0))
* **availity-workflow-angular:** add webpack DuplicatePackageCheckerPlugin to development ([27b2f2e](https://github.com/Availity/availity-workflow/commit/27b2f2e))
* **availity-workflow-angular:** upgrade uglifyjs. Closes [#131](https://github.com/Availity/availity-workflow/issues/131). ([5a788d2](https://github.com/Availity/availity-workflow/commit/5a788d2))
* **availity-workflow-react:** add webpack DuplicatePackageCheckerPlugin to development ([1c36d8e](https://github.com/Availity/availity-workflow/commit/1c36d8e))
* **availity-workflow-react:** upgrade uglifyjs. Closes [#131](https://github.com/Availity/availity-workflow/issues/131). ([531bdb5](https://github.com/Availity/availity-workflow/commit/531bdb5))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/Availity/availity-workflow/compare/v2.7.0...v3.0.0) (2018-01-13)


### Bug Fixes

* **availity-mock-server:** set response headers and unit test ([d7ab013](https://github.com/Availity/availity-workflow/commit/d7ab013))
* **availity-workflow:** add back commands accidently removed ([d5b0ad7](https://github.com/Availity/availity-workflow/commit/d5b0ad7))


### Chores

* **availity-worfklow:** enforce Node v8.0 ([a20e1c1](https://github.com/Availity/availity-workflow/commit/a20e1c1))


### Features

* **availity-mock-server:** add patch support for tus ([4945642](https://github.com/Availity/availity-workflow/commit/4945642))
* **availity-workflow:** add env info in about messages ([3866998](https://github.com/Availity/availity-workflow/commit/3866998))
* **availity-workflow-settings:** proxy /ms path ([dd78d7e](https://github.com/Availity/availity-workflow/commit/dd78d7e))


### BREAKING CHANGES

* **availity-worfklow:** Minimum requirement to run workflow is now Node 8. There are no API changes.

<a name="2.7.1"></a>
## [2.7.1](https://github.com/Availity/availity-workflow/compare/v2.7.0...v2.7.1) (2018-02-16)

### Bug Fixes

* **availity-mock-data:** use Node 6 compat syntax. Closes [#135](https://github.com/Availity/availity-workflow/issues/130) ([c970587](https://github.com/Availity/availity-workflow/commit/c970587))

<a name="2.7.0"></a>
# [2.7.0](https://github.com/Availity/availity-workflow/compare/v2.6.5...v2.7.0) (2018-01-08)


### Bug Fixes

* **availity-mock-data:** spaces collection in wrong folder ([3ce0a66](https://github.com/Availity/availity-workflow/commit/3ce0a66))
* **availity-react-kit:** add pageName to breadcrumbs example ([0683816](https://github.com/Availity/availity-workflow/commit/0683816))
* **availity-worfklow-react:** fix negative lookahead in regex. Closes [#130](https://github.com/Availity/availity-workflow/issues/130) ([f9c32db](https://github.com/Availity/availity-workflow/commit/f9c32db))
* **availity-workflow-react:** add raf polyfill. Closes [#125](https://github.com/Availity/availity-workflow/issues/125) ([65488de](https://github.com/Availity/availity-workflow/commit/65488de))
* **availity-workflow-react:** transformIgnorePatterns ([d9e0e85](https://github.com/Availity/availity-workflow/commit/d9e0e85))


### Features

* **availit-mock-data:**  integrate mock data. Closes [#128](https://github.com/Availity/availity-workflow/issues/128) ([bbc9043](https://github.com/Availity/availity-workflow/commit/bbc9043))
* **availity-mock-data:** add spaces collection query ([84f1750](https://github.com/Availity/availity-workflow/commit/84f1750))
* **availity-mock-server:** integrate mock server. Closes [#127](https://github.com/Availity/availity-workflow/issues/127) ([79b156c](https://github.com/Availity/availity-workflow/commit/79b156c))



<a name="2.6.5"></a>
## [2.6.5](https://github.com/Availity/availity-workflow/compare/v2.6.4...v2.6.5) (2017-12-21)


### Bug Fixes

* **availity-react-kit:** fix named export for api examples ([39cf50a](https://github.com/Availity/availity-workflow/commit/39cf50a))
* **availity-workflow-angular:** allow babel  for [@availity](https://github.com/availity) packages ([bb43e2a](https://github.com/Availity/availity-workflow/commit/bb43e2a))
* **availity-workflow-react:** allow babel  for [@availity](https://github.com/availity) packages ([5896bf2](https://github.com/Availity/availity-workflow/commit/5896bf2))
* **workflow-react:** fix jest transform pattern ([8072230](https://github.com/Availity/availity-workflow/commit/8072230))



<a name="2.6.4"></a>
## [2.6.4](https://github.com/Availity/availity-workflow/compare/v2.6.3...v2.6.4) (2017-11-12)


### Bug Fixes

* **cli:** closes [#110](https://github.com/Availity/availity-workflow/issues/110) leverage local eslint when available ([1e6e738](https://github.com/Availity/availity-workflow/commit/1e6e738))
* **react kit:** fix incorrect dep version ([8752047](https://github.com/Availity/availity-workflow/commit/8752047))
* **react-kit:** add es6-symbol for IE11 ([06880fa](https://github.com/Availity/availity-workflow/commit/06880fa))
* **workflow-react, worfkow-angular:** closes [#118](https://github.com/Availity/availity-workflow/issues/118) use recommend head settings in html templates ([a1160e2](https://github.com/Availity/availity-workflow/commit/a1160e2))
* **workflow-react, worfkow-angular:** use recommend head settings in html templates ([a27096a](https://github.com/Availity/availity-workflow/commit/a27096a))


### Performance Improvements

* **react, angular:** closes [#117](https://github.com/Availity/availity-workflow/issues/117) disable hmr in production ([9d51692](https://github.com/Availity/availity-workflow/commit/9d51692))



