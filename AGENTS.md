# AGENTS.md

vue3-json-to-excel is a small npm package: one Vue 3 component that Vue apps use to turn an object or an array of objects into an `.xlsx` download, built with SheetJS. `site/` is the project's GitHub Pages site, an online JSON to Excel converter that runs on the component from `src/`.

## Verify a change

- CI (`.github/workflows/ci.yml`) runs `npm ci`, `npm run build` and `npm run build:site` on the latest Node LTS. There are no tests or linters.
- `npm run build` clears `dist/` and has rollup write the ESM, CJS (`ssr`) and IIFE (`min`) bundles. `.browserslistrc` sets the targets.
- To check behavior, run `npm run serve`. It starts Vite with `dev/` as root and `@` aliased to `src/`.
- `npm run build:site` builds `site/` into `site-dist/` with base `/vue3-json-to-excel/` and copies the root `llms.txt` into it. `npm run serve:site` runs it locally.

## Gotchas

- `xlsx` is installed from a tarball on cdn.sheetjs.com, not from the npm registry. `npm ci` needs access to that host, and Dependabot does not update it, so bump the URL by hand.
- npm has 1.0.5, but package.json says 1.0.1. There is no publish workflow: the owner publishes by hand, so leave `version` alone.
- A push to `main` runs CI and `.github/workflows/pages.yml`, which deploys `site-dist/` to GitHub Pages. Nothing is published to npm.
- The site's preview table uses `toRows()` from the component file, so the preview and the download always flatten JSON the same way.
- The package ships `dist/*` and `src/**/*.vue`. `dist/` is ignored by git.
- `src/LICENSE` (2021) and the root `LICENSE` (2022) differ.

## Conventions

- Commit messages are a conventional-commit subject line in English, with no body and no trailer.
- Work on a branch and open a PR against `main`. The owner merges.
- New text carries no emoji. Code comments stay short, one line where possible, and explain why.
- The README follows the owner's template. Every image served from `halitsever-api.vercel.app` stays byte-for-byte. Only the `title=` value of `api/repo-title` and the link around `api/issue` may be corrected.
- `llms.txt` at the repo root links files by their GitHub URLs. Update it when you move or rename one.
- The owner bumps versions and publishes to npm.
