# availity-workflow

> Upgradable workflow for Availity Toolkit projects

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square&label=license)](http://opensource.org/licenses/MIT)
[![NPM](http://img.shields.io/npm/v/availity-workflow.svg?style=flat-square&label=npm)](https://npmjs.org/package/availity-workflow)

## Table of Contents
* [Intro](#intro)
* [Installation](#installation)
* [Gulp](#gulp-commands)
* [Authors](#authors)
* [License](#license)

## Intro

The Availity Workflow provides [Gulp](http://gulpjs.com), [Karma](http://karma-runner.github.io/) and [Webpack](https://webpack.github.io/) tasks needed to build and maintain a [availity-toolkit](https://github.com/Availity/availity-toolkit) projects.

## Installation

* Install using NPM

```bash
npm install availity-workflow --save-dev
```

* Integrate with Gulp

```javascript

// gulpfile.js

var gulp = require('gulp');

var workflow = require('availity-workflow');

workflow.use({
  gulp: gulp
});

gulp.task('default', ['av:default']);
gulp.task('lint', ['av:lint']);
gulp.task('test', ['av:test']);

```

### Gulp

By default all Gulp tasks are prefixed by `av:` to prevent name clashes with your own Gulp tasks.

##### Default

>
```bash
gulp av:default
```

Runs the default task, which runs these tasks:

* cleans the destination directory `./build` or `./dist`
* `av:copy `
* `av:concat`
* `av:server`
* `av:watch`

##### Clean

>
```sh
gulp av:clean
```

Clears the build/dist environment

##### Build

>
```sh
gulp av:build
```

Builds your latest code for development|staging|production.

By default `development` builds are created.  To build assets for staging or production:

* `NODE_ENV=staging gulp av:release`
* `NODE_ENV=production gulp av:release`

##### Copy

>
```sh
gulp av:copy
```

Copies templates into the build/dist folder.  Setting `NODE_ENV` environment variable determines the output path.


##### Lint

>
```sh
gulp av:lint
```

Checks for stylistic and programming errors using [ESLint](http://eslint.org/)

##### Server

>
```sh
av:server
```

* `av:server:web` is a [hapi](http://hapijs.com/) server that proxies requests to the [Ekko](https://github.com/Availity/availity-ekko) server
* `av:server:rest` starts the [Availity Ekko]((https://github.com/Availity/availity-ekko)) server, which is a json mock server that simulates REST APIs.
* `av:open` opens the system default browser and loads the web application


## Authors

**Kasey Powers**
+ [kasey.powers@availity.com](Kasey.Powers@availity.com)

**Robert McGuinness**
+ [rob.mcguinness@availity.com](Kasey.Powers@availity.com)


## Disclaimer

Open source software components distributed or made available in the Availity Materials are licensed to Company under the terms of the applicable open source license agreements, which may be found in text files included in the Availity Materials.


## License

Copyright (c) 2015 Availity, LLC. Code released under the [the MIT license](LICENSE)
