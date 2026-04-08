# Testing Conventions

- Framework: Vitest 4 (root `vitest.config.js`)
- Globals enabled (`describe`, `it`, `expect` available without imports)
- Test pattern: `packages/**/*.spec.js`
- Excluded from test: `docusaurus/`, `example/`, `node_modules/`
- Example app uses Jest (`jest.setup.js` with `@testing-library/jest-dom`)
- Run all tests: `yarn test` (vitest run)
- Run affected: `yarn nx affected --target=test`
- Integration tests: `yarn test:integration` (per-workspace `integration` script)
- CI matrix: Node 20, 22, 24 on ubuntu-latest + macos-latest
