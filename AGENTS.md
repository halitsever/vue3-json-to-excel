# AGENTS.md

vue3-json-to-excel is a small npm package: one Vue 3 component that Vue apps use to turn an object or an array of objects into an `.xlsx` download, built with SheetJS. `site/` is the project's GitHub Pages site, an online JSON to Excel converter that runs on the component from `src/`.

## Verify a change

- CI (`.github/workflows/ci.yml`) runs `npm ci`, `npm test` and `npm run build:site` on the latest Node LTS. There is no linter.
- `npm run build` runs Vite in library mode twice with `build/vite.lib.config.mjs`: once for `dist/vue3-json-to-excel.mjs`, then with `--mode single` for the `.cjs` and `.min.js` (IIFE) bundles.
- `npm test` builds first, then runs `test/smoke.test.mjs` with `node --test` against the built package. It imports `vue3-json-to-excel` by name, so it checks the `exports` map too.
- To check behavior, run `npm run serve`. It starts Vite with `dev/` as root, on the source in `src/`.
- `npm run build:site` builds the package, then `site/` into `site-dist/` with base `/vue3-json-to-excel/`, and copies the root `llms.txt` into it. `npm run serve:site` runs it locally.

## Gotchas

- `xlsx` is a devDependency installed from a tarball on cdn.sheetjs.com, not from the npm registry. `npm ci` needs access to that host, and Dependabot does not update it, so bump the URL by hand.
- SheetJS is bundled into every file in `dist/`, and `vue` is the only external. Keep `dependencies` empty so installing the package pulls nothing else.
- `site/` imports `vue3-json-to-excel` by its package name. `vite.site.config.mjs` aliases that to `dist/vue3-json-to-excel.mjs`, so the site runs on the bundle that ships to npm.
- Pushing a `v*` tag runs `.github/workflows/release.yml`, which publishes to npm through trusted publishing (OIDC, no token). The tag must match `version` in `package.json`, and `prepublishOnly` runs the tests.
- A push to `main` runs CI and `.github/workflows/pages.yml`, which deploys `site-dist/` to GitHub Pages. Nothing is published to npm.
- The site's preview table uses the package's `toRows()` export, so the preview and the download always flatten JSON the same way.
- Every `index.html` under `site/` is a page: `vite.site.config.mjs` collects them as build inputs. Add a new page to `site/public/sitemap.xml` and link it from the others. `site/excel-to-json/` reads spreadsheets with SheetJS directly, not through the component.
- The package ships `dist/` and `types/`. `dist/` is ignored by git. `types/index.d.ts` is written by hand, so update it when props or exports change.
- `src/LICENSE` (2021) and the root `LICENSE` (2022) differ.

## Conventions

- Commit messages are a conventional-commit subject line in English, with no body and no trailer.
- Work on a branch and open a PR against `main`. The owner merges.
- New text carries no emoji. Code comments stay short, one line where possible, and explain why.
- The README follows the owner's template. Every image served from `halitsever-api.vercel.app` stays byte-for-byte. Only the `title=` value of `api/repo-title` and the link around `api/issue` may be corrected.
- `llms.txt` at the repo root links files by their GitHub URLs. Update it when you move or rename one.
- The owner bumps versions and pushes the matching `v*` tag to publish.
