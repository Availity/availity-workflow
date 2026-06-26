import { defineConfig } from 'vitest/config';

const pathArg = process.argv.find((arg) => arg.startsWith('packages/'));
const name = pathArg ? `@availity/${pathArg.split('/', 2)[1]}` : 'availity-workflow';

export default defineConfig({
  test: {
    name,
    globals: true,
    include: ['packages/**/*.spec.js'],
    exclude: ['**/node_modules/**', 'docusaurus/**', 'example/**'],
  },
});
