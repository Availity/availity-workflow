---
title: Dependency Management
---

Everything related to managing dependencies

## Semver

Availity creates open source projects that follow [Semantic Versioning](https://semver.org/) for dependency management. SemVer is a 3-component system in the format of `x.y.z` where:

-   `x` stands for a major version:
    -   Breaking Change and **NOT** backwards compatible
    -   Potential new features
    -   Potential bug fixes
-   `y` stands for a minor version:
    -   New Feature
    -   Backwards compatible
-   `z` stands for a patch
    -   Bug fix
    -   Backwards compatible

For example, one of the libraries created and maintained by Availity is [availity-workflow](https://github.com/Availity/availity-workflow). This library is used by developers to create web applications using React. There have been [many releases](https://github.com/Availity/availity-workflow/tags) for `availity-workflow` and they follow semantic versioning.

The `1.x.x` versions are fully compatible with each other. For example, if a project is using `v1.0.0`, a developer can be confident that upgrading to `v1.0.1` or `v1.1.0` it will not break their application.

When Availity identifies a need to make a breaking change, the major version number in the semantically versioned scheme is changed so that developers can understand how difficult it would be to upgrade. Upgrading is **VOLUNTARY**. It is up to the developer teams to determine if upgrading is necessary for their project(s). When `availity-workflow@2.0.0` was released, Availity deemed the breaking changes necessary to push the platform forward. The breaking changes were documented in the [changelog](https://github.com/Availity/availity-workflow/releases/tag/v2.0.0) along with an [upgrade path for older applications](https://github.com/Availity/availity-toolkit/wiki/Upgrading-to-availity-angular-2.x-and-availity-workflow-2.x).

Availity released `availity-workflow@3.0.0` to modernize the stack even further by leveraging Node 8 and dropping support for Node 6. Availity tries to keep its Node.js stack modern by matching the [release schedule](https://github.com/nodejs/Release#release-schedule) of the current active LTS (Long-Term Support) Node.js version. Once again, the [changelog was documented](https://github.com/Availity/availity-workflow/releases/tag/v3.0.0) so that developers can determine the difficulty factor when upgrading.

## Changelog

All Availity open-source projects maintain a changelog. Each project maintains it's own changelog. The changelog can be found either in the `releases` link on GitHub or as a `CHANGELOG.md` at the root of the project.

### Releases Examples

-   <https://github.com/Availity/availity-workflow/releases>
-   <https://github.com/Availity/sdk-js/releases>
-   <https://github.com/Availity/availity-uikit/releases>
-   <https://github.com/Availity/sdk-js/releases>

### Changelog.md Examples

-   <https://github.com/Availity/sdk-js/blob/master/CHANGELOG.md>
-   <https://github.com/Availity/availity-workflow/blob/master/CHANGELOG.md>
-   <https://github.com/Availity/availity-react/blob/master/CHANGELOG.md>

## Tools

It is up to the development team to decide if they want or need to upgrade any library in their stack. There are some tools available that help teams know if new releases of components have been published for use:

### `npm outdated`

```bash
❯ npm outdated --depth=0
Package                                 Current            Wanted        Latest  Location
awesome-bootstrap-checkbox                0.3.7             0.3.7         1.0.0  availity-toolkit > availity-uikit
bootstrap                                 3.3.7             3.3.7         4.0.0  availity-toolkit > availity-uikit
```

### `npm-check`

<https://www.npmjs.com/package/npm-check>

```bash
 npm-check -u
? Choose which packages to update.

 Major Update Potentially breaking API changes. Use caution.
❯◉ bootstrap           3.3.7             ❯  4.0.0  <https://getbootstrap.com>
 ◯ select2             3.5.2-browserify  ❯  4.0.5  <https://select2.org>
 ◯ lint-staged devDep  6.1.1             ❯  7.0.0  <https://github.com/okonet/lint-staged#readme>

 Space to select. Enter to start upgrading. Control-C to cancel.
```

## FAQ

### What happens when teams upgrade a library and the project/build breaks?

-   Check the library changelog for BREAKING CHANGE announcements or recent fixes
-   Check the offending library issue board and see if tickets have been
    opened or closed similar to the issue being experienced.
-   If the problem can't be resolved, feel free to open an issue so that the Availity team can fix or provide feedback.
-   Rollback to previous library version if necessary

### Why did `minor` or `patch` upgrade break my build/app?

Availity strives to follow SemVer on every release but mistakes do happen and we try to quickly correct the issue. For example, [availity-workflow@2.7.0](https://github.com/Availity/availity-workflow/releases/tag/v2.7.0) broke users on Node 6. The issue was identified [availity-workflow/issues/135](https://github.com/Availity/availity-workflow/issues/135) and fixed in subsequent release [availity-workflow@2.7.1](https://github.com/Availity/availity-workflow/releases/tag/v2.7.1)

## Credits

Portions adopted from [Semantic Versioning: Why You Should Be Using it](https://www.sitepoint.com/semantic-versioning-why-you-should-using/)
