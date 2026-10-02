# Tellstory Editor — component library

React implementation of the Tellstory Editor design system. See `CLAUDE.md`
for the binding contract between the Figma file and this code.

## Using the components

```sh
npm install editor_ui_poc
```

```tsx
import { Button, Tag, TagList } from 'editor_ui_poc'
import 'editor_ui_poc/style.css' // once, at your app root — tokens, fonts, and every component's styles

function Example() {
  return <Button tone="primary">Add object</Button>
}
```

`react` and `react-dom` (^19) are peer dependencies — install them yourself if
your app doesn't already have them. `editor_ui_poc/style.css` self-hosts
Inter and Geist Mono as separate font files alongside the CSS; your own
bundler will pick them up from the relative `url()` references the same way
it handles any other imported stylesheet.

Browse every component and state in Storybook — `npm run storybook` in this
repo, or the published Chromatic build.

## Developing this repo

- `npm run dev` — the (minimal) demo app
- `npm run storybook` — the component catalog, with a11y checks via the addon
- `npm run build:lib` — builds the publishable package into `dist/`
- `npm run build` — builds the demo app (not the library)
- `npm run lint` — Oxlint
