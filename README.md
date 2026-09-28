# Sumi

The shared design foundation for Hattori AI apps: plain CSS and JS, with
no build step. App code owns its layout and workflow.

The files use Tailwind v4 and the daisyUI theme plugin.

## Install

In a Phoenix app, add Sumi as a Mix dependency that is not compiled:

```elixir
{:sumi, github: "hattoriai/sumi", tag: "v0.1.0", app: false, compile: false, depth: 1}
```

Phoenix's Tailwind and esbuild profiles put `deps/` on `NODE_PATH`, so
import the files by package path:

```css
@import "sumi/css/theme.css";
@import "sumi/css/tokens.css";
```

```js
import { SumiDialog } from "sumi/js/dialog";
import "sumi/js/theme";
```

In an app that uses npm, install the same tag:

```sh
npm install github:hattoriai/sumi#v0.1.0
```

## Canonical choices

These are settled. Apps follow them; they do not redefine them.

- **Dark is canonical.** Sumi is paper text on ink. The light theme is the
  same system inverted: ink text on paper. An app follows the person's
  saved choice, then their system preference. With neither, it is dark.
  "System" always means ink or paper; other themes are explicit choices.
- **One accent: blade `#e84a1c`** (`oklch(58% .2 32)`, daisyUI `primary`).
  Ember `#ff6b3d` (`secondary`) is its hover and its small-text variant on
  ink. Do not introduce other oranges.
- **Blade is a line or a mark, not a fill for text.** Use it for the eyebrow
  rule, the wordmark accent, focus, the current navigation item, a row or
  card edge and the primary button. Body text keeps its colour on hover.
- **Two typefaces.** Cormorant Garamond at weight 300 with `-0.02em`
  tracking for display type and moments of meaning. Outfit at weight 300
  for interface text, and 500 for labels.
- **Hairlines, not shadows.** Borders are 1px lines of the text colour.
  Radii are nearly square, and `--depth` is 0.
- **A text floor of 0.65rem.** Only decorative, `aria-hidden` drawings go
  smaller.
- **Colour never carries state alone.** Pair it with a word, a glyph or a
  shape.
- **Motion marks a change of state.** Use `--sumi-motion`, and respect
  reduced motion.

## Foundation

| File | Contents |
| --- | --- |
| `css/theme.css` | The daisyUI themes: surfaces, status colours, radii. See Themes. |
| `css/tokens.css` | Fonts, brand colours, text tiers, lines, status text, motion, widths and gutters. |
| `css/base.css` | Font rendering, film grain (`.sumi-grain` on `<body>`) and scrollbars. |
| `css/typography.css` | `.sumi-display`, `.sumi-wordmark`, `.sumi-label`, `.sumi-meta`. |
| `css/accessibility.css` | Focus, disabled states and reduced motion. |

Import `theme.css` and `tokens.css` first; every other file uses their tokens.

### Themes

| `data-theme` | Name | Scheme | Page |
| --- | --- | --- | --- |
| `dark` | Ink | dark | Paper text on ink. The default. |
| `light` | Paper | light | Ink on warm paper. |
| `snow` | Snow | light | Ink on near-white, with cool greys, for people who prefer a neutral page. |

Every theme keeps the blade accent, the radii and `--depth: 0`. Only the
surfaces, the text colour and the status colours change.

To add a theme:

1. Add a daisyUI theme block to `css/theme.css`.
2. If it is light, add it to the light-scheme list in `css/tokens.css`
   (`:root:is([data-theme="light"], …)`). That list is the only place in
   Sumi that names light themes; components never test theme names.
3. Add it to the app's list of themes. The app renders the ids in
   `data-sumi-themes` on `<html>`; `js/theme.js` and the boot snippet
   accept only those ids.

Do not write `[data-theme="…"]` selectors in components. Use the tokens,
so a new theme needs no component changes.

### Tokens

| Token | Use |
| --- | --- |
| `--sumi-text-secondary`, `--sumi-text-muted`, `--sumi-text-tertiary` | Descriptions; captions and meta; decoration only. AA in both themes. |
| `--sumi-line`, `--sumi-line-strong` | Dividers and borders (12%); control and emphasis borders (24%). |
| `--sumi-accent-text` | Small blade-coloured text, readable on both themes. |
| `--sumi-success-text`, `--sumi-error-text` and their `-surface` pairs | Status text and tinted backgrounds. |
| `--sumi-motion` | 200ms; set to 0 under reduced motion. |
| `--sumi-control-height` | 2.75rem minimum touch target. |
| `--sumi-page-gutter` | Page side margin: 4.5%, or 6% on narrow screens. |
| `--sumi-content-width`, `--sumi-wide-width` | 56rem for reading; 80rem for work surfaces. |

Use these tokens when adding components. Avoid app names in shared tokens.

### Type patterns

- **Eyebrow:** `.sumi-label`, the blade rule and tracked uppercase text above
  a title. Write the text in sentence case; the class sets the case.
- **Quiet eyebrow or caption:** `.sumi-meta`.
- **Wordmark:** `.sumi-wordmark` with the second half in a `<span>`, for
  example `TŌ<span>RYŌ</span>`.
- **Accent phrase:** one italic `<em>` in a display heading, coloured with
  `--sumi-accent-text`.

## Appearance

`css/theme-toggle.css` and `js/theme.js` provide the appearance control:
"system", then each of the app's themes. Mark up native buttons inside
`.sumi-theme-toggle`, each with `data-sumi-theme="system"` or a theme id
and an accessible name. The module sets `aria-pressed`, stores the choice
under `sumi:theme`, follows system changes and syncs other tabs. In
LiveView, give the group an `id` and `phx-update="ignore"`. The same
`data-sumi-theme` buttons work anywhere, for example as larger
`.sumi-choice` cards on a settings page.

Render `data-theme="dark"` and `data-sumi-themes="dark light snow"` (the
app's theme ids) on `<html>`. To prevent a flash of the wrong theme, set
the theme in `<head>` before first paint:

```html
<script>
  (() => {
    // A saved account setting (data-appearance) comes first, then the
    // choice this browser remembers, then the system.
    let choice = document.documentElement.dataset.appearance || null;
    try {
      if (!choice) choice = localStorage.getItem("sumi:theme");
      else if (choice === "system") localStorage.removeItem("sumi:theme");
      else localStorage.setItem("sumi:theme", choice);
    } catch {}
    const themes = (document.documentElement.dataset.sumiThemes || "dark light").split(" ");
    const saved = themes.includes(choice);
    const light = matchMedia("(prefers-color-scheme: light)").matches;
    document.documentElement.dataset.theme = saved ? choice : light ? "light" : "dark";
    document.documentElement.dataset.themeSource = saved ? "user" : "system";
  })();
</script>
```

An app that stores the appearance per person renders it as
`data-appearance` on `<html>` and saves each choice on the server as well.

## Navigation

`css/menu.css` and `js/menu.js` provide the personal menu: an initials
avatar (`.sumi-avatar`) that opens a panel (`.sumi-menu-panel`) with the
person's name and email (`.sumi-menu-identity`), dividers and items
(`.sumi-menu-item`). Mark up `[data-sumi-menu]` with a trigger button that
has `aria-expanded` and `aria-controls`, and a `hidden` panel. The module
opens and closes it, moves focus with the arrow keys, Home and End, and
closes it on Escape (focus returns to the avatar), an outside click or a
choice. In LiveView, give the menu an `id` and `phx-update="ignore"`.

`css/section-nav.css` provides `.sumi-section-nav`: links between the
pages of one area, such as a workshop's team and AI settings. Mark the
current link with `aria-current="page"`; it gets a blade underline on the
hairline.

## Error pages

`css/error-page.css` provides branded 404 and 500 pages: `.sumi-error`
holds the status code as a faint numeral (`.sumi-error-code`,
`aria-hidden`), a `.sumi-label`, a display heading, a
`.sumi-error-description` and a way back. `.sumi-error-mark` shows the
app's mark in outline beside it and is left out on narrow screens. Render
the pages inside the app's root layout so they keep the theme and fonts.

## Colour mixing

Mix colours `in srgb`. OKLCH mixing interpolates hue, so blade mixed
with ink passes through blue.

## Shaping components

`css/shaping.css` extends Sumi with reusable decision and review patterns:

| Component | Contract |
| --- | --- |
| `.sumi-button.primary` / `.secondary` | Main and supporting actions; 44px minimum height. |
| `.sumi-choice` | A native button with `aria-pressed`; an explicit check indicates selection. |
| `.sumi-status` | A text label, with `.draft`, `.settled`, `.open`, `.inherited` (dashed edge) or `.proposed` (dotted edge). Color never carries state alone. |
| `.sumi-board-page` | A document section with a heading, review status, body, approval actions and source disclosure. |
| `.sumi-specimen` | A native choice button showing real product content; `--sample-*` variables belong to the preview, independently of the app theme. |
| `.sumi-interview-skeleton`, `.sumi-skeleton` | A reserved layout while content loads. |

Light mode remains paper; dark mode remains ink. Components must support
both, keyboard interaction, narrow screens and reduced motion. Prototype
new patterns in the app, then place their reusable behavior and appearance
here. Ronin remains on hold; its legacy styles have not been migrated.

### Board artifacts

`css/shaping.css` also draws shaped work on a board. Every artifact keeps
its items' review status, actions and *Show the details*; these classes
only lay them out.

| Component | Contract |
| --- | --- |
| `.sumi-board-page.compact` | A small board page for items shown many to a box; its heading carries the content. |
| `.sumi-status.assumption` | A double-edged chip with the word "Assumption", for guesses such as personas. |
| `.sumi-four-box` | Four `.sumi-box` sections in two rows (one column on phones), each with an `h4`, an optional `.sumi-box-hint` or `.sumi-box-empty`, and its items. `.sumi-box-focus` adds a blade edge to the box that needs attention first; its heading must say why. `.sumi-four-box-axis.y` (before) and `.x` (after) show the axis words. |
| `.sumi-tree` | Nested lists drawn as a tree with hairline elbows; `.sumi-tree-empty` for a placeholder node. |
| `.sumi-table-wrap`, `.sumi-table` | A hairline table that scrolls sideways on narrow screens, with a `caption`. A `.sumi-table-actions` row under a row holds its actions. |
| `.sumi-card-list` | Rows of `.sumi-card-list-text` (lines and a `small` note) and one action. Mark the current row with `aria-current`. |
| `.sumi-portrait-summary`, `.sumi-portrait-context`, `.sumi-portrait-lists` | A persona: a summary in display type, where they use it, and what they want and what frustrates them in two lists. |

## Card controls

`css/cards.css` holds the controls of a decision card. Each one is a
native button or input that works with a keyboard and on a phone. Pressed
state is `aria-pressed="true"`, drawn with a tick or a word as well as
colour. Give every control an accessible name that says what it does,
for example `aria-label="Move Alpha up"`.

| Component | Contract |
| --- | --- |
| `.sumi-choices` | A list of `.sumi-choice` buttons. Inside a choice, `.choice-indicator` (add `.multi` for a square box when several may be picked), `.choice-text` with `.choice-label` and `.choice-detail`. |
| `.sumi-recommended` | A small line after a choice's label: "Recommended: reason". The star is added by CSS. |
| `.sumi-card-hint` | One line of guidance above or below a control. |
| `.sumi-pair` | Two `.sumi-choice.sumi-pair-side` buttons with `.sumi-pair-or` between them; `.sumi-pair-specimen` shows a short sample in monospace. Stacks on phones. |
| `.sumi-toggle`, `.sumi-verdicts` | Word buttons that toggle (Right, Nearly right, Not right) in a wrapping row. |
| `.sumi-chip` | A small toggle for words and bucket moves; `.quiet` for a dashed "put back" chip. |
| `.sumi-icon-button` | A square button for one Lucide icon or glyph; needs `aria-label`. |
| `.sumi-rank` | An ordered list of `.sumi-rank-row`: `.sumi-rank-number`, the content, and `.sumi-rank-moves` (up and down buttons). |
| `.sumi-sorter` | A bucket sorter: `.sumi-sorter-tray` for unsorted cards, `.sumi-sorter-buckets` of `.sumi-sorter-bucket` sections, each holding `.sumi-sorter-card` articles with `.sumi-sorter-moves` (one `.sumi-chip` per bucket). |
| `.sumi-grid-wrap`, `.sumi-grid` | A table of yes/no `.sumi-grid-toggle` buttons with row and column headers; it scrolls sideways on narrow screens. |
| `.sumi-map` | A two-by-two map: `.sumi-map-axis.y` and `.x` (axis ends as words), `.sumi-map-grid` of four `.sumi-map-quadrant` sections holding `.sumi-map-card` labels. Pair it with `.sumi-map-list`, where each `.sumi-map-row` has four place buttons (`.sumi-map-moves`). |
| `.sumi-sliders` | `.sumi-slider` blocks: `.sumi-slider-ends` (a label with the two words) above a native range input. |
| `.sumi-words`, `.sumi-checkgroup`, `.sumi-ticks` | Fieldsets of chips or choices with a `legend`. |
| `.sumi-judge-group`, `.sumi-example` | Examples as a Given, When, Then list (`dl`) with `.sumi-verdicts` under each. `.sumi-questions` and `.sumi-inline-field` hold an input with its add button. |
| `.sumi-draft` | A draft to check: its body, or a textarea while editing. |

### Drag and drop

`js/drag.js` exports the `SumiDrag` LiveView hook. It only enhances
controls that already work with buttons; never make dragging the only
way. Put the hook on a container with an `id` and `data-drop-op` (the
operation to send). Mark draggable elements with `data-drag-id` and
`draggable="true"`, and drop zones with `data-drop-value`. A drop pushes
`card_op` (or the container's `data-drop-event`) with
`{op, id, to}`. CSS marks the zone under the pointer
(`[data-drop-active]`) and the element in flight (`[data-dragging]`).

## Level marks

`css/levels.css` shows how far a piece of work has come as line weight:
empty (dotted), sketched (a thin dashed pencil line), drawn (a 2px pen
line) and inked (a 4px ink line). Set `data-level` to `empty`,
`sketched`, `drawn` or `inked`.

- `.sumi-level` holds a `.sumi-level-line` (decorative, `aria-hidden`)
  and a `.sumi-level-word`. Always show the word; the line never carries
  the level alone.
- `.sumi-level-frame` draws a region's border at the same weight, for
  example a quadrant of a drawing.

## Form controls

Use daisyUI's `btn`, `btn-primary`, `btn-soft`, `input`, `textarea`, and
`select` classes with the shared theme. Do not add app-specific control
skins. The shaping button classes are superseded by those controls.

`css/select.css` and `js/select.js` extend the themed select with an in-page
listbox. Register `SumiSelect` as a LiveView hook. The Phoenix markup
adapter is currently `ItazuWeb.Controls.select`: named hidden input, themed
trigger, labelled listbox, and options with `data-value` and
`aria-selected`. The hook supports arrows, Home/End, typeahead,
Enter/Space, Escape, Tab and outside dismissal. Give each instance a unique
ID. The ignored root preserves unsaved selections across unrelated LiveView
patches; remount it when its available options or authoritative value
changes.

`css/settings.css` provides an editorial two-column settings layout,
provider choices and field spacing, built on the themed controls.

## Form validation

Mark forms with `novalidate data-sumi-form` and import `js/forms.js` and
`css/forms.css`. Keep `required`, type and length constraints as field
metadata. Sumi renders inline messages, associates them with fields using
ARIA, focuses the first invalid field, and clears each error when
corrected. Native browser validation bubbles are disabled. Always validate
submissions on the server too. Navigation actions belong in links, outside
form submission behavior.

## Confirmation dialogs

`css/dialog.css` and `js/dialog.js` provide a confirmation pattern using
Sumi surface, border, radius and danger tokens. `ItazuWeb.Controls.dialog`
provides the Phoenix adapter. Register `SumiDialog` as a LiveView hook and
handle `close_dialog` for Escape/backdrop dismissal. Native `showModal()`
contains focus and makes the background inert; dismissal restores focus.
Destructive forms must validate the typed identifier on the server too.
