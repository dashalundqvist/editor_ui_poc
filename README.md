# Tellstory Editor — component library

React implementation of the Tellstory Editor design system. See `CLAUDE.md`
for the binding contract between the Figma file and this code.

## Using the components

The package is published to **GitHub Packages**, not the public npm registry,
on every push to `main` (see `.github/workflows/publish.yml`). GitHub
Packages requires authentication to install from, even though this repo is
public — there's no way around that, it's a GitHub Packages limitation, not
a choice made here.

One-time setup in the *consuming* app:

1. Generate a classic PAT with the `read:packages` scope (GitHub → Settings
   → Developer settings → Personal access tokens).
2. Add an `.npmrc` at the root of that project:
   ```
   @dashalundqvist:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
   ```
3. Set `GITHUB_PACKAGES_TOKEN` in that project's environment (and as a CI
   secret, if it builds in CI too).

Then:

```sh
npm install @dashalundqvist/editor_ui_poc
```

```tsx
import { Button, Tag, TagList } from '@dashalundqvist/editor_ui_poc'
import '@dashalundqvist/editor_ui_poc/style.css' // once, at your app root — tokens, fonts, and every component's styles

function Example() {
  return <Button tone="primary">Add object</Button>
}
```

`react` and `react-dom` (^19) are peer dependencies — install them yourself if
your app doesn't already have them. The stylesheet self-hosts Inter and Geist
Mono as separate font files alongside the CSS; your own bundler will pick
them up from the relative `url()` references the same way it handles any
other imported stylesheet.

Every push to `main` publishes a new `0.0.0-<commit-sha>` prerelease — there's
no real semantic-release process yet, so pin the exact prerelease version you
tested against rather than a loose range.

Browse every component and state in Storybook — `npm run storybook` in this
repo, or the published Chromatic build.

## Developing this repo

- `npm run dev` — the (minimal) demo app
- `npm run storybook` — the component catalog, with a11y checks via the addon
- `npm run build:lib` — builds the publishable package into `dist/`
- `npm run build` — builds the demo app (not the library)
- `npm run lint` — Oxlint
