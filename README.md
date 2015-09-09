# availity-workflow

> Upgradable workflow for Availity Toolkit projects

## Table of Contents
* [Intro](#intro)
* [Set up Workflow](#set-up-workflow)
* [Gulp Commands](#gulp-commands)
* [Authors](#authors)
* [License](#license)


## Intro

The Availity Workflow provides the [Gulp](http://gulpjs.com), [Karma](http://karma-runner.github.io/) and [Webpack](https://webpack.github.io/) tasks needed to build and maintain an [availity-toolkit](https://github.com/Availity/availity-toolkit) projects.

## Set up Workflow


#### Gulp

Workflow provides all gulp files needed for your [availity-toolkit](https://github.com/Availity/availity-toolkit) app. By default all of these tasks are prefixed by `av:` to give you more freedom to create your own tasks.

#### Gulp Commands

To use gulp, you type (in a terminal or command prompt) `gulp` and then the name of the task you wish to run. If you want to run a task named "foo" for example, you would type:

##### Default

>
```bash
gulp av:default
```

Runs the default task, which runs these tasks:

* av:clean
* av:copy 
* av:concat
* av:server
* av:open
* av:watch

##### Clean

>
```sh
gulp av:clean
```

Clears the build/dist environment

##### Build

>
```sh
gulp av:build:dev
```

Builds your latest code for development.

##### Copy

>
```sh
gulp av:copy
```

Copies templates into the build/dist folder

##### Less

>
```sh
gulp av:less
```

Compiles your Less code to CSS.

##### Lint

>
```sh
gulp av:lint
```

Checks for stylistic and programming errors using [ESLint](http://eslint.org/)

##### Rest Server

>
```sh
av:server:rest
av:server:web
```

Starts two servers and the browser:
* av:server:web is a [hapi](http://hapijs.com/) server which uses your plugin to distribute data and proxy the [Ekko](https://github.com/Availity/availity-ekko) server
* av:server:rest starts the [Availity Ekko]((https://github.com/Availity/availity-ekko)) server, which is a json mock server that simulates REST APIs.


## Authors

**Kasey Powers**
+ [kasey.powers@availity.com](Kasey.Powers@availity.com)

**Robert McGuinness**
+ [rob.mcguinness@availity.com](Kasey.Powers@availity.com)


## License

Copyright (c) 2015 Availity, LLC. Code released under the [the MIT license](LICENSE)
