# Build & Monorepo Conventions

- Nx 22.5.1 with `@nx/js` and `@nx/workspace` — extends `@nx/workspace/presets/npm.json`
- Yarn 4.11.0 workspaces: `packages/*`, `docusaurus`, `example`
- `nodeLinker: node-modules` (no PnP)
- Nx targets with caching: `build`, `test`, `lint`, `package`, `prepare`
- `build` and `package` targets have `dependsOn` for dependency ordering
- Run affected: `yarn nx affected --target=<target>` (base: `master`)
- Workspace deps must be `workspace:*` — enforced by `constraints.pro`
- `@availity/workflow` provides both webpack and vite build pipelines
- Docusaurus site builds with `yarn nx build docusaurus`
- Example app builds with `yarn build:app`
- All packages are ESM (`"type": "module"`)
- Versioning: `@jscutlery/semver` — independent per package, conventional changelog
- Publishing: `yarn npm publish --tolerate-republish --access public`
