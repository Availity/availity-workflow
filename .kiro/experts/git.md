# Git Conventions

- Default branch: `master`
- Commit format: Conventional Commits (`@commitlint/config-conventional`)
- Scope = package name without `@availity/` (e.g. `fix(mock-server): ...`)
- Header max length: 85 chars (warning level)
- Husky hooks:
  - `pre-commit`: `yarn constraints` + `yarn lint-staged`
  - `commit-msg`: `yarn constraints` + `yarn commitlint --edit`
- Branch prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `release/`
- PRs target `master` — see `.github/PULL_REQUEST_TEMPLATE.md`
- CI skips on commit messages containing `skip ci` or `Release: Version Updates`
- Release flow: `nx affected --target version --parallel=1` → publish → auto-PR to `master`
