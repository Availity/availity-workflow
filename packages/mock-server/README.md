# @availity/mock-server

## Table of Contents

*   [Intro](#intro)
*   [Server Configuration](#server-configuration)
*   [Route Configuration](#route-configuration)
*   [Contributing](#contributing)
*   [Authors](#authors)
*   [Disclaimer](#disclaimer)
*   [License](#license)

## Intro

Develop web applications without heavy back-end services by running [Pollyjs](https://netflix.github.io/pollyjs/#/) which can deliver mock responses.

Responses are recorded using pollyjs and saved as `har` files with all the recording info from response headers, to timings on how long the requests take.

## Request Matching

`Pollyjs` has its own request matcher built in and we expose the configuration for it via the `workflow` configuration file. More info on request matching can be found [here](https://netflix.github.io/pollyjs/#/configuration?id=matchrequestsby)

## Configuration

By default the mock server is enabled but when you add a `workflow` config file you will need to enable it by adding the `mock.enabled` boolean to true.
