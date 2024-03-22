#!/usr/bin/env node
import yargs from 'yargs';
import chalk from 'chalk';
import start from './scripts/start';
import test from './scripts/test';
import lint from './scripts/lint';
import about from './scripts/about';
import build from './scripts/build';
import release from './scripts/release';
import profile from './scripts/profile';
import settings from './settings';

if (process.env.NODE_ENV === 'staging') {
  process.argv.push('--no-optimize');
  process.env.NODE_ENV = 'production';
}
const shouldMimicStaging = process.argv.includes('--no-optimize');

await import('./scripts/init');

yargs.command(
  'release',
  `${chalk.dim('Bundle project for distribution (production or staging) and create a git tag')}`,
  (yyargs) => {
    yyargs
      .version(false)
      .option('version', {
        alias: 'v',
        describe: 'Specify which version you want to use when tagging the project and creating the release.'
      })
      .usage(`\nUsage: ${chalk.yellow('av release')} ${chalk.magenta('[options]')}`)
      .example(chalk.yellow(`${chalk.yellow('av release')} ${chalk.magenta('-v 2.0.0')}`));
  },
  async () => {
    await settings.init({ shouldMimicStaging });
    await release({ settings });
  }
);

/* eslint-disable no-unused-expressions */
yargs

  .usage(`\nUsage: ${chalk.yellow('av')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .command('start', `${chalk.dim('Start the development server')}`, async () => {
    try {
      await settings.init();
      await start();
    } catch {
      /* noop */
    }
  })

  .command(
    'lint',
    `${chalk.dim('Lint source files using ESLint')}`,
    (yyargs) => {
      yyargs
        .option('include', {
          alias: 'i',
          describe: 'Glob patterns to INCLUDE for ESLint scanning'
        })
        .option('fail', {
          alias: 'f',
          describe: 'Force linter to fail and exit'
        })
        .option('ignore-git-untracked', {
          alias: 'u',
          describe: 'Ignore files that are not indexed by git'
        })
        .option('disable-linter', {
          describe: 'Disable linter when creating bundles for production or staging'
        });
    },
    async () => {
      try {
        await settings.init();
        await lint();
      } catch {
        /* noop */
      }
    }
  )

  .command(
    'test',
    `${chalk.dim(test.description)}`,
    (yyargs) =>
      yyargs.option('watch', {
        alias: 'w',
        describe: 'Watch files for changes and rerun tests related to changed files.'
      }),
    async () => {
      try {
        await settings.init();
        await test.run({ settings });
      } catch {
        /* noop */
      }
    }
  )

  .command('profile', `${chalk.dim('Analyze Webpack bundles and find what is contributing their sizes')}`, async () => {
    try {
      await settings.init();
      await profile(settings);
    } catch {
      /* noop */
    }
  })

  .command('build', `${chalk.dim('Bundle project for distribution (production or staging)')}`, async () => {
    try {
      await settings.init({ shouldMimicStaging });
      await build({ settings });
    } catch {
      /* noop */
    }
  })

  .command('about', `${chalk.dim('About @availity/workflow')}`, async () => {
    try {
      await settings.init();
      about({ settings });
    } catch {
      /* noop */
    }
  })

  .demand(1, chalk.red('Must provide a valid cli command'))

  .showHelpOnFail(false, 'Specify --help for available options')

  .help('help')
  .alias('help', 'h')

  .version()
  .alias('version', 'v')

  .example(chalk.yellow('av start'))

  .example(chalk.yellow('av lint'))

  .epilog(`View documentation at ${chalk.blue('https://github.com/availity/availity-workflow')}`).argv;
