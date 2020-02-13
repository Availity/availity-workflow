---
title: Deploying to our Portal
---

If you have made it this far then you must mean business. The application must have 100% test coverage and ready to be deployed on a Friday afternoon to production. 😉

In all seriousness let's start on how to get your application deployed.

## Creating the Artifact

Our CLI ships with two different commands for building your deployments. The first is the `staging` command and the second being `production`.

Both commands run the same CLI workflow, the only difference is that the `production` command will minify your code for a smaller gzip footprint.

For testing purposes let's use the `staging` command below to get started:

```bash
yarn staging
```

You should now be prompted to select what type of version bump you would like:

```shell hideCopy=true
? What type of version bump would you like to do?
  1) patch ( 0.1.0 => 0.1.1 )
  2) minor ( 0.1.0 => 0.2.0 )
  3) major ( 0.1.0 => 1.0.0 )
   ──────────────
  4) other
  Answer:
```

You can choose whichever version bump you wish, typically we follow the [semver versioning](https://docs.npmjs.com/about-semantic-versioning) strategy for what version bump we want to give in our deployment stage, however for projects that aren't using NPM its not a huge deal.

Once entered, the CLI will bundle the app in the `./dist` directory and create a tag with the appropriate version.

There will already be a commit created with the version bump and `dist` folder updates included. You will want to push this and the git tag that was auto generated up to your version control.

```bash
git push && git push --tags
```

## Deploying

When deploying, there are different processes for staging vs. production environments.

### Development Builds

// TODO - `/public/spaces`

### Production Builds

// TODO - `/public/apps`
