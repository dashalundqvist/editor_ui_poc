# Tellstory Editor — React implementation

Claude Code reads this file automatically at the start of every session in this repo.
It is the contract between the design system and this codebase.

The design system lives in a Figma file (`Q78xrdm215QEQEkUODMYTp`) with its reasoning
recorded in a Claude project. **This file is the only part of that reasoning that is
binding here.** If something below seems arbitrary, it usually survived two or three
rejected alternatives — the reasoning is in the Figma documentation frames on
`02 Components`.

---

## The token contract

`src/styles/tokens.css` is **generated from Figma**. Do not edit it by hand, and do not
patch values in it. If a value is wrong, it is wrong in Figma — fix it there and
re-export. The export is one-way and always will be: Figma owns tokens, code consumes them.

Three rules, in order of how badly they break things:

1. **Never write a literal colour, radius, or spacing value in a component stylesheet.**
   If you need one that does not exist, that is a missing token — stop and say so rather
   than hardcoding it. A hardcoded value is invisible to the next theme change.
2. **Bind semantic tokens, never primitives.** `var(--background-panel)`, not
   `var(--neutral-900)`. The primitives exist so the semantics can alias them; a component
   reaching past the semantic layer defeats the whole structure.
3. **Type roles come from `type.module.css` via `composes`**, not five hand-written
   declarations. `composes: itemName from "../styles/type.module.css";`

Dark is the default theme. Light is `[data-theme="light"]` on `<html>`.

---

## Things Figma cannot express — do not look for them there

The Figma file is authoritative for appearance and structure. These five exist only here,
and every one of them is load-bearing:

- **`font-feature-settings: "ss02" 1`** on `body`. This gives Inter its disambiguated
  `I l 1 0 O`. Figma cannot apply it at all — not by plugin, not by hand on a styled
  layer — so every mockup renders without it. Without this line the typeface choice
  delivers nothing, and `Waterfall_30` vs `Waterfall_3O` becomes a real support problem.
  **Use the official Inter release, not the Google Fonts build**, which ships without
  OpenType features and will silently do nothing.
- **`:focus-visible`**, defined once globally in `tokens.css`. No component has a Focus
  variant in Figma and none should have a focus style here. Figma cannot distinguish
  mouse focus from keyboard focus, so a per-component Focus state would document
  something subtly wrong. **Do not add a focus style to a component stylesheet.**
- **The spinner animation** in the Saving state. Figma cannot animate; the glyph is drawn
  as eight radial ticks so it rotates cleanly. Guard it with `prefers-reduced-motion`.
- **Truncation reveal.** Names truncate to one line (see below). The full value must be
  reachable on focus or hover — a `title` attribute at minimum.
- **Hit areas.** Several glyphs are 16px but need a 24×24 target: the `×` on a Tag above
  all. The visual size and the target size are different numbers.

---

## Non-negotiables

These came from accessibility requirements or from a defect we already hit.

- **No row state may change a row's height.** All nine `Table row` states are 49px. Five
  alternatives were built and rejected against this constraint — a row that grows pushes
  every row beneath it, which is disorienting mid-scroll. If a new state needs vertical
  room, it is the wrong design.
- **Names and categories truncate to one line.** `02` says to expect long names; a
  57-character name was tested and wrapping grew the row by 8px. Use the `.truncate`
  class — and note it includes `min-width: 0`, without which a flex child refuses to
  shrink and truncation never fires.
- **Row action targets are 24×24** with at least `var(--spacing-stack)` (12px) between
  them. That is WCAG 2.5.8's minimum with no margin to spare — the spacing exception is
  what makes it pass. Do not tighten the gaps.
- **Icon-only actions must name their object in the accessible name.**
  `aria-label="Delete Waterfall_30"`, never `"Delete"`.
- **The Attention band strip is `aria-hidden`.** It is redundant encoding. The figures are
  the accessible value; the cell announces "20 to 80" or "40".
- **Never colour alone.** Selection uses weight, an indicator bar and a surface together.
  Status uses an icon plus text. A colour-blind author must lose nothing.
- **Never present a save as successful without confirmation from the system.** The row
  reverting from inputs to text *is* the confirmation, and it must only happen after the
  save actually returns.

---

## Error states — three, and they are not interchangeable

- **Invalid** — a required value is missing (in practice, Attention). Can apply to many
  rows at once. Row is marked; nothing is disabled.
- **Field error** — a bad value in one input, known *before* Save is pressed. The offending
  field gets `--border-error` and a clickable info mark. **Save is disabled**, because
  pressing it could only fail. The info mark is a `<button>`, not a hover target — that is
  what makes click-to-reveal acceptable where hover-to-reveal was not.
- **Save failed** — a fault that appeared *after* the press. **Save must stay enabled**, or
  there is no way to retry.

Getting these backwards is the single most likely implementation mistake.

---

## Terminology

Use the product's words. The developer is renaming Marker → **Object**; the system already
uses Object everywhere.

| Term | Meaning |
|---|---|
| Project | The unit you Save, Load and Quit. Also called a world. |
| Tiles | A tab. Author-created tile types (ocean, forrest, urban) shown as a grid. |
| Vectors | A tab. Spatial elements. |
| Objects | A tab, and the records in it. **Not "markers".** |
| Attention | A required 0–100 integer span. Min may equal max. |
| Tags | An object's references to tile types. Author-coloured — **user data, not tokens.** |

There is **no tree and no properties panel** in this editor. Editing is inline in a table.
Older context documents describe a story/scene hierarchy that was never built.

---

## Two saves

- **Row save** commits one object. A transition: it starts and ends.
- **Project save** writes everything across all tabs. A state that persists until the
  author acts, and the one that can lose work.

A committed row still lives only in memory until the project is saved. The project bar
shows `Unsaved changes` and enables Save; when clean it shows nothing and Save is disabled.

---

## Build order

Each step composes the previous ones. Do not jump ahead — `Table row` depends on four
other components and will be rebuilt if they are wrong.

1. `tokens.css` + `type.module.css` wired in, rendering in dark mode.
2. `Icon` — ten glyphs, 16×16, 1.5px stroke, round caps, `currentColor`.
3. `Button` — two sizes, three tones, optional leading icon. See `Button.module.css`.
4. `IconButton` — 24×24, circular, wraps `Icon`.
5. `RangeField` — the Attention control. Figures plus five quantised bands.
6. `Tag` + `TagOverflow` — the `+N` counter, because an object can have ten or more tags.
7. `TableRow` — nine states.
8. The Objects tab screen: project bar, tabs, page actions, table.

---

## Before you start

Ask if any of these are unknown rather than guessing:

- Is there an existing component library, or is this the first component?
- Testing setup — is there one, and should components ship with tests?
- Is Storybook in play? The Figma documentation frames map to stories almost one to one.
- How are icons delivered — inline SVG components, or a sprite?
