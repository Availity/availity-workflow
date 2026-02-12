import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Base configuration for all projects
    globals: true,
    environment: 'node',
    reporters: ['default'],
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist', 'example'],
    coverage: {
      reportsDirectory: './coverage'
    }
  },
  projects: ['packages/*/vitest.config.{js,ts}']
});
