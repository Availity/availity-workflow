---
title: Upgrading @availity/workflow
---

It's important to stay up to date with the latest version of `@availity/workflow`. Keeping your dependencies up to date minimizes security risk and ensures your project maintains compatibility with our build system. You can upgrade `@availity/workflow` manually yourself, or utilize the `workflow-upgrade` script.

> Note: If using the `workflow-upgrade` script, you will still need to maintain the rest of your dependencies yourself.

## The `workflow-upgrade` script

Navigate to the directory you want to upgrade `@availity/workflow` for and run the following command. 

```bash
npx @availity/workflow-upgrade
```

### What does the `workflow-upgrade` script do?

The `workflow-upgrade` script upgrades your project to the latest version of `@availity/workflow`. Next, it ensures your project is not using deprecated plugins. Finally it upgrades the devDeps and peerDeps associated with `@availity/workflow`.

## Resources

- [The @availity/workflow Changelog](https://github.com/Availity/availity-workflow/blob/master/packages/workflow/CHANGELOG.md)
- [The workflow-upgrade script](https://github.com/Availity/availity-workflow/blob/master/packages/workflow-upgrade/index.js)
