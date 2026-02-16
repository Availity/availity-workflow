import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['packages/**/*.spec.js'],
    exclude: ['**/node_modules/**', 'docusaurus/**', 'example/**']
  }
});
