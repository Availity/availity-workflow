const { accessSync, constants } = require('fs');

// Checks for existence of .yarn/versions directory
// If not present then there is no release strategy and no need to run release scripts
const checkVersionStrategy = () => {
  let exitCode = 1;
  const dir = '.yarn/versions';

  console.log(process.cwd());
  try {
    accessSync(dir, constants.F_OK);
    console.log(`${dir} exists`);
    exitCode = 0;
  } catch {
    console.log(`${dir} does not exist`);
    exitCode = 1;
  }

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(exitCode);
};

checkVersionStrategy();
