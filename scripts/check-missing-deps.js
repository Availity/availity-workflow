const check = require('dependency-check');
const globby = require('globby');

const defaultPaths = ['packages/**/package.json', '!packages/**/node_modules/**/package.json'];

const dependencyAnalyzer = async (args = {}) => {
  let { ignorePaths = [] } = args;
  let exitCode = 0;
  ignorePaths = Array.isArray(ignorePaths) ? ignorePaths : [ignorePaths];
  const globs = [...defaultPaths, ...ignorePaths];
  const files = await globby(globs, {
    absolute: true
  });

  await Promise.all(
    files.map(async (file) => {
      const data = await check({
        path: file,
        entries: [],
        noDefaultEntries: false,
        extensions: ['.js']
      });

      const pkg = data.package;
      const deps = data.used;

      const missing = check.missing(pkg, deps, {
        excludeDev: false,
        excludePeer: false,
        ignore: [
          `${pkg.name}` // Can ignore packages that require their own compiled modules
        ]
      });

      if (missing.length > 0) {
        // eslint-disable-next-line no-console
        console.log(
          `Run the following command to add missing packages to ${pkg.name}:
yarn workspace ${pkg.name} add ${missing.map((m) => `${m}`).join(' ')}
          `
        );
        exitCode = 1;
      }
    })
  );
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(exitCode);
};

dependencyAnalyzer();
