import { execFile } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import Logger from '@availity/workflow-logger';

const execFileAsync = promisify(execFile);

/**
 * Resolve the project's own TypeScript compiler binary, so the check uses the version the app
 * depends on rather than one bundled with workflow-vite.
 */
function resolveTscBin(projectRoot) {
  const projectRequire = createRequire(path.join(projectRoot, 'package.json'));
  const tscPackage = projectRequire.resolve('typescript/package.json');
  return path.join(path.dirname(tscPackage), 'bin', 'tsc');
}

/**
 * Run `tsc --noEmit` against the project's tsconfig.json. Used by `av build` when
 * `build.typeCheck` is enabled. Throws, which stops the build, if the compiler reports errors.
 *
 * @param {{ settings: object }} options
 */
export default async function typecheck({ settings }) {
  const tsconfig = path.join(settings.project(), 'tsconfig.json');

  if (!existsSync(tsconfig)) {
    Logger.warn('build.typeCheck is enabled but no tsconfig.json was found. Skipping type checking.');
    return true;
  }

  let tscBin;
  try {
    tscBin = resolveTscBin(settings.project());
  } catch {
    Logger.failed('Failed type checking. Unable to load TypeScript from the project.');
    throw new Error('Unable to load typescript. Install it in the project to use build.typeCheck.');
  }

  Logger.info('Started type checking');
  try {
    await execFileAsync(process.execPath, [tscBin, '--noEmit', '-p', tsconfig], { cwd: settings.project() });
  } catch (error) {
    // tsc writes diagnostics to stdout and exits non-zero when there are errors.
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
    if (output) Logger.simple(output);
    Logger.failed('Failed type checking');
    throw new Error('Failed type checking');
  }

  Logger.success('Finished type checking');
  return true;
}
