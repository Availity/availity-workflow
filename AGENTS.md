# AGENTS.md: availity-workflow (@availity/workflow, workflow-vite, mock-server)

Nx and Yarn monorepo of the build, dev-server, mock, and release tooling behind the `av` CLI. Apps depend on this as tooling. It depends only on `eslint-config-availity`.

## Branches

- Default and PR target: `master` (see `.github/workflows/pr-build.yml`).
- Check `git branch --show-current` and `git status` before editing. This clone may have uncommitted work. Do not overwrite changes you did not make.
- Never push to `master`. Work on `feature/<JIRA-###>-description` or `fix/<JIRA-###>-description`.

## Environment

- Node `>=22.12.0` (the engine pin is not `^22 || ^24`; do not change it without a decision).
- Yarn 4 (`packageManager: yarn@4.17.0`).
- Install with `yarn install --immutable`. Do not hand-edit `yarn.lock`.

## Commands

| Task                     | Command                                          |
| ------------------------ | ------------------------------------------------ |
| Build                    | `yarn build`                                     |
| Lint                     | `yarn lint:all` (changed only: `yarn lint`)      |
| Lint and autofix changed | `yarn lint:fix`                                  |
| Format                   | `yarn format`                                    |
| Unit tests               | `yarn test` (changed only: `yarn test:affected`) |
| Integration tests        | `yarn test:integration`                          |
| Example app dev server   | `yarn start:app` (Vite: `yarn start:vite-app`)   |
| Example app tests        | `yarn test:app` (Vite: `yarn test:vite-app`)     |

Before you say a change is done, run `yarn lint`, `yarn test:affected`, and `yarn build`. If you changed how an app is started or built, also run `yarn build:app` or `yarn build:vite-app`.

## Commits and releases

- Conventional commits enforced by `commitlint.config.js`. Scope is an Nx project name, and the header allows `!` before the colon for breaking changes. The header length limit is not enforced: `header-max-length` is disabled.
- Releases run through `nx affected --target version`. Do not run `version` locally.

## Lockstep rule (important)

- `@availity/workflow` v14 and `eslint-config-availity` (ESLint 9) **must be upgraded together.** Changing one without the other breaks consumers. Check `eslint-config-availity` before releasing a workflow major.
- Upgrade path for consumer apps: `npx @availity/workflow-upgrade@latest`. See `UPGRADE.md`.
- Consumers: about 32 repos depend on `@availity/workflow` and about 26 on `@availity/mock-server`. Treat any change to CLI flags, config shape, or mock routing as a cross-repo change.

## Do not

- Do not change `workflow.js` defaults in a way that changes behavior for apps silently. Put behavior changes behind a documented option or a major.
- Do not run `check:packages` (Artifactory check) or release scripts locally unless asked.

## Gotchas

- `NX_DAEMON` is disabled in CI. Local runs with the daemon can differ.
- Docs live in `@availity/dinosaurdocs` (`yarn start:docs`). Some docs lag the code. Trust the source.
