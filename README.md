# Sumi

The shared design foundation for Hattori AI apps: plain CSS and JS, with
no build step. App code owns its layout and workflow.

The files use Tailwind v4 and the daisyUI theme plugin.

## Install

In a Phoenix app, add Sumi as a Mix dependency that is not compiled:

```elixir
{:sumi, github: "hattoriai/sumi", tag: "v0.3.4", app: false, compile: false, depth: 1}
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
npm install github:hattoriai/sumi#v0.3.4
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
  Small accent text, such as the eyebrow label, uses `--sumi-accent-text`,
  which passes AA in every theme. Text on a blade or ember fill is ink.
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
- **44px targets on touch screens.** With a coarse pointer every card
  control, chip, choice, icon button and notice or proposal button is at
  least 44 by 44 CSS pixels. Pointer screens may use the compact 36px
  icon buttons (the story map's moves).
- **Glyphs drawn by CSS are silent.** A tick, star, circle or arrow added
  with `content` has empty alternative text (`content: '✓ ' / ''`), so a
  screen reader reads the word and `aria-pressed`, not the glyph.

## Foundation

| File | Contents |
| --- | --- |
| `css/theme.css` | The daisyUI themes: surfaces, status colours, radii. See Themes. |
| `css/tokens.css` | Fonts, brand colours, text tiers, lines, status text, motion, widths and gutters. |
| `css/base.css` | Font rendering, film grain (`.sumi-grain` on `<body>`) and scrollbars. |
| `css/typography.css` | `.sumi-display`, `.sumi-wordmark`, `.sumi-label`, `.sumi-meta`. |
| `css/accessibility.css` | Focus, disabled states and reduced motion. Touch target sizes live with their components (`cards.css`, `shaping.css`). |

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

For a marketing page or a signed-out header, `.sumi-theme-flip` is one
yin-yang button that flips between ink and paper. Any light theme, snow
too, flips to ink. Give it `data-sumi-theme-flip`; `js/theme.js` stores the
choice like the three-way control and keeps the button's name ("Switch to
paper" or "Switch to ink") current. The rotation comes from
`--sumi-flip-turn`, so a new light theme needs no change here.

```html
<button type="button" class="sumi-theme-flip" data-sumi-theme-flip aria-label="Switch to paper" title="Switch to paper">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.25" />
    <path d="M12 2 A10 10 0 0 1 12 22 A5 5 0 0 1 12 12 A5 5 0 0 0 12 2 Z" fill="currentColor" />
    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
    <circle class="sumi-theme-flip-eye" cx="12" cy="17" r="1.5" />
  </svg>
</button>
```

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
| `.sumi-choice` | A native button with `aria-pressed`; an explicit check (`aria-hidden`) indicates selection. |
| `.sumi-status` | A text label, with `.draft`, `.settled`, `.open`, `.inherited` (dashed edge), `.proposed` (dotted edge) or `.rejected` (dashed and struck through; say "Not taken"). Color never carries state alone. |
| `.sumi-notice` | Something changed elsewhere and needs a look: a blade-edged box with an `h2` that says what to do, `div`s of a `.sumi-label` and a short `ul` (rows may end in a quiet button), and one button that clears it. Give it `aria-labelledby` its heading. |
| `.sumi-notice.calm` | Something is less than it could be and one quiet action may help (guided options because AI could not tailor them): a dashed, untinted box with a `p.sumi-notice-title`, a short `p` saying why, and one button. It stays until the reason goes. Give it `role="note"`. |
| `.sumi-proposals` | Suggestions waiting for a decision: an `h3` and a `ul` of `.sumi-proposal` rows, each a `.sumi-proposal-text` (a `small` kind, the text, a `small` source) and `.sumi-proposal-actions` with both answers as buttons (icon and word). |
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
| `.sumi-storymap-grid` | A story map as a table inside `.sumi-table-wrap`: one `th scope="col"` per step, one row per version (`tr.slice-<id>`; `.slice-1` gets the blade edge) with a `th scope="row"` label and an optional `small` hint, and board pages in the cells. |
| `.sumi-matrix` | Add to a `.sumi-table` for a permission matrix: `.sumi-matrix-group` rows name a thing, action rows follow, and each cell holds a `.sumi-matrix-cell` (`.yes` when allowed) with a visible mark and a `.sr-only` sentence. |
| `.sumi-verdict` | A verdict chip on a judged example: `.right` (solid), `.wrong` (struck through, dashed edge) or `.unsure` (dotted edge), always with its word. |
| `.sumi-given-when-then` | A `dl` of an example: `dt` Given / When / Then in a narrow column, `dd` the text beside it. |
| `.sumi-flow` | An `ol` of `.sumi-flow-step` items, numbered on a line. A step holds `.sumi-flow-text` and an optional `ul.sumi-flow-failures` of `.sumi-flow-failure` items on a dashed branch, each with a `.sumi-flow-handling` (`.open` when nobody has decided it yet). |

## Look previews

`css/look.css` draws a product's own look inside an app: its colours,
type and controls, independent of the app's theme. Sumi's canonical
choices apply to the app around a preview, never to the look inside it.

A `.sumi-preview` element carries the product's tokens as `--preview-*`
custom properties, set inline by the app (for example
`--preview-color-bg`, `--preview-color-text`, `--preview-button-primary-bg`,
`--preview-radius-control`, `--preview-font-display`). Everything inside
draws with them. Controls inside a preview are drawings: they are `span`s
with `aria-hidden`, so a preview can sit inside a button.

| Component | Contract |
| --- | --- |
| `.sumi-style-tile` | A style tile inside `.sumi-preview`: `.sumi-swatches` of `.sumi-swatch` items (`--swatch` inline, with an `.sr-only` name), `.sumi-preview-display` (a line in the display face), `.sumi-preview-body`, and a `.sumi-preview-card` holding `.sumi-preview-badge`, `.sumi-preview-label`, `.sumi-preview-input` and `.sumi-preview-actions` with `.sumi-preview-button` (`.secondary`). `.compact` for small tiles. |
| `.sumi-style-tiles`, `.sumi-style-pick` | Tiles to pick from: each pick is a native button with `aria-pressed` holding a tile and `.sumi-style-pick-text` (a `.choice-label` with `.choice-indicator`, and a `.choice-detail`). One column on phones. |
| `.sumi-style-studio` | The picked look with its controls: `.sumi-nudges` (a row of `.sumi-chip` buttons; a toggle nudge uses `aria-pressed`), `.sumi-hue` (a label with an `output`, and a native range input whose track shows the hues), `.sumi-hex` (an optional colour field). |
| `.sumi-contrast` | Contrast numbers: `.sumi-contrast-summary` (a `.sumi-status` word and a sentence) and a `.sumi-contrast-table` (where, WCAG ratio with a `small` pass note, APCA Lc). |
| `.sumi-look-notes` | Notes on a look (never a block): list items with a “Note:” lead-in. |
| `.sumi-type-pairs`, `.sumi-type-pick`, `.sumi-type-specimen` | Type pairs to pick from, each a `.sumi-choice.sumi-type-pick` with a `.sumi-type-specimen` (`--specimen-display`, `--specimen-display-weight`, `--specimen-body`, `--specimen-body-weight` inline): `.sumi-type-display`, `.sumi-type-body`, and an optional `.sumi-type-scale` list of steps with their sizes. `.compact` for picks; `.sumi-type-preview` frames the chosen pair. |
| `.sumi-scale` | A value on a line between two words: `--at` (0–100%) places the mark. It is decorative; say the value in text as well. |

## Sketches

`css/sketch.css` frames low-fidelity sketches of screens and the controls
around them. A sketch is an SVG the app draws itself (shown as an image,
so it keeps its own paper in any theme and nothing in it can run); these
classes only lay it out. Every move is a native button or field.

| Component | Contract |
| --- | --- |
| `.sumi-sketch` | The sketch image (`img`, `alt` names the screen): full width, a hairline frame. `.sumi-sketch-missing` stands in when a screen has no sketch yet; `.sumi-sketch-frame` is a `figure` around a large one. |
| `.sumi-sketch-picks`, `.sumi-sketch-pick` | Sketches to pick from, two per row (one on phones): each pick is a native button with `aria-pressed` holding the sketch and `.sumi-sketch-pick-text` (a `.choice-label` with `.choice-indicator`, and a `.choice-detail`). |
| `.sumi-wire-toolbar` | A row of `.sumi-verdicts` toggle groups above a wireframe (desktop or phone; sketch or with style). |
| `.sumi-wire-region`, `.sumi-wire-blocks`, `.sumi-wire-block` | A wireframe as an outline: one region per area (an `h4` with its name) listing its blocks. A block row holds `.sumi-wire-block-text` (name, kind, a `.sumi-status` word for the one that matters most, a `.sumi-wire-note`) and `.sumi-wire-moves`: icon buttons (up, down, matters most with `aria-pressed`, remove) and a `.sumi-more` whose `.sumi-more-menu.sumi-wire-edit` holds labelled fields (name, kind, area, note). |
| `.sumi-wire-add`, `.sumi-wire-states`, `.sumi-wire-state` | Fieldsets under the outline: adding a block (a `.sumi-inline-field`), and the UI-stack states, one row per state with a `.sumi-toggle` and its note field. |
| `.sumi-state` | A state's word as a chip: dashed when it does not apply, solid with a blade edge (`.is-on`) when it does. Always with its word. `.sumi-state-list` lists them; `.sumi-state-matrix` on a `.sumi-table` makes a matrix of screens by states. |
| `.sumi-screens`, `.sumi-screen` | A breadboard to edit: each screen with `.sumi-screen-head` (a `.sumi-rank-number`, `.sumi-screen-name` field, `.sumi-screen-moves`), a purpose field, `.sumi-affordances` (rows of `.sumi-affordance`: a label field, kind chips, a `.sumi-affordance-to` select, remove), an add field, and `.sumi-screen-stories` (a `details` of story chips). `.sumi-screen-add` adds a screen. |
| `.sumi-sitemap` | A list of screens, each with the actions that lead elsewhere. |
| `.sumi-sketch-expandable`, `.sumi-sketch-expand` | A sketch with an Expand icon button (`.sumi-icon-button`) over its top-right corner, next to the sketch's own button, never inside it. It shows on hover and on focus, and always on touch screens (44px there). |
| `.sumi-sketch-viewer`, `.sumi-sketch-stage` | A sketch seen large inside a `.sumi-dialog-large` (toggles go in the head's `.sumi-dialog-head-tools`): `.sumi-sketch-viewer-note` on one line, the stage (a `figure` with `data-viewport`) where the sketch takes all the room left and keeps its proportions (on phones it runs the full width and the stage scrolls), then one row, `.sumi-sketch-viewer-actions`, with `.sumi-sketch-viewer-nav` (previous, “2 of 4”, next) on the left and the pick on the right. |
| `.sumi-sketch-thumbs`, `.sumi-sketch-thumb` | Sketch thumbnails on a board: a button with `aria-expanded` that opens a `.sumi-wire-view` (a larger sketch with `.sumi-wire-view-head`). |
| `.sumi-journey`, `.sumi-story-frame`, `.sumi-story-links` | A clickable storyboard: numbered chips for the screens in order (the current one has `aria-current`), a frame with the screen's sketch, and its actions as buttons that go where they lead; `.sumi-story-stay` for one that stays on the screen. |
| `.sumi-specimen-picks`, `.sumi-specimen-pick`, `.sumi-specimen-text` | Text samples for products without screens (a command line, an API call, code, a chat): picks are `.sumi-choice` buttons with a label and a monospace `pre.sumi-specimen-text`; the same class on a `textarea` adjusts one. `.sumi-specimen-edit` frames that field. |

## Card controls

`css/cards.css` holds the controls of a decision card. Each one is a
native button or input that works with a keyboard and on a phone. Pressed
state is `aria-pressed="true"`, drawn with a tick or a word as well as
colour. Give every control an accessible name that says what it does,
for example `aria-label="Move Alpha up"`.

| Component | Contract |
| --- | --- |
| `.sumi-choices` | A list of `.sumi-choice` buttons. Inside a choice, `.choice-indicator` (add `.multi` for a square box when several may be picked), `.choice-text` with `.choice-label` and `.choice-detail`. |
| `.sumi-recommended` | A small line after a choice's label: "Recommended: reason". The star is added by CSS and is silent to screen readers. |
| `.sumi-card-hint` | One line of guidance above or below a control. |
| `.sumi-pair` | Two `.sumi-choice.sumi-pair-side` buttons with `.sumi-pair-or` between them; `.sumi-pair-specimen` shows a short sample in monospace. Stacks on phones. |
| `.sumi-toggle`, `.sumi-verdicts` | Word buttons that toggle (Right, Nearly right, Not right) in a wrapping row. |
| `.sumi-chip` | A small toggle for words and bucket moves; `.quiet` for a dashed "put back" chip. |
| `.sumi-icon-button` | A square button for one Lucide icon or glyph; needs `aria-label`. 44px, or at least 44px on touch screens where a component makes it compact. |
| `.sumi-rank` | An ordered list of `.sumi-rank-row`: `.sumi-rank-number`, the content, and `.sumi-rank-moves` (up and down buttons). |
| `.sumi-sorter` | A bucket sorter: `.sumi-sorter-tray` for unsorted cards, `.sumi-sorter-buckets` of `.sumi-sorter-bucket` sections, each holding `.sumi-sorter-card` articles with `.sumi-sorter-moves` (one `.sumi-chip` per bucket). |
| `.sumi-grid-wrap`, `.sumi-grid` | A table of yes/no `.sumi-grid-toggle` buttons with row and column headers; it scrolls sideways on narrow screens. |
| `.sumi-map` | A two-by-two map: `.sumi-map-axis.y` and `.x` (axis ends as words), `.sumi-map-grid` of four `.sumi-map-quadrant` sections holding `.sumi-map-card` labels. Pair it with `.sumi-map-list`, where each `.sumi-map-row` has four place buttons (`.sumi-map-moves`). |
| `.sumi-sliders` | `.sumi-slider` blocks: `.sumi-slider-ends` (a label with the two words) above a native range input. |
| `.sumi-words`, `.sumi-checkgroup`, `.sumi-ticks` | Fieldsets of chips or choices with a `legend`. |
| `.sumi-judge-group`, `.sumi-example` | Examples as a Given, When, Then list (`dl`) with `.sumi-verdicts` under each. `.sumi-questions` and `.sumi-inline-field` hold an input with its add button. |
| `.sumi-draft` | A draft to check: its body, or a textarea while editing. |
| `.sumi-inline-field` | An input (or select) and its button in a wrapping row. |
| `.sumi-add`, `.sumi-chips`, `.sumi-chip.is-on`, `.sumi-chip-remove` | Words the person added, as chips in a list, each with a remove button, above a `.sumi-inline-field`. |
| `.sumi-undo` | A status line after a removal or merge, with an Undo button. Use `role="status"`. |
| `.sumi-more`, `.sumi-more-menu` | Less frequent moves behind a native `details`: the `summary` is a `.sumi-icon-button` with an `aria-label`, the menu holds labelled buttons. |
| `.sumi-storymap-steps` | A story map to edit: `.sumi-storymap-step` items with a `.sumi-storymap-step-head` (a `.sumi-rank-number`, `.sumi-storymap-step-title`, `.sumi-storymap-moves`), then one `.sumi-storymap-slice.slice-<id>` per version with a `.sumi-meta` label and its `.sumi-storymap-story` rows (`.sumi-storymap-story-title` and moves). `.sumi-storymap-legend` counts stories per version. Slices are drop zones for `SumiDrag`. |
| `.sumi-objects` | Things to confirm: `.sumi-object` rows, each a `.sumi-object-toggle` button (`aria-expanded`; `.sumi-object-name`, a detail or `.sumi-object-missing`, counts) that opens a `.sumi-object-body` of `.sumi-object-part` fieldsets. |
| `.sumi-relationships` | Links between things: `.sumi-relationship` rows with `.sumi-relationship-ends`, a group of chips for the kind of link, and an inline field; a `.sumi-inline-field` with two selects adds one. |

### Placement

`.sumi-placement` places one piece of work on a larger map (a feature on
its product's story map). It holds `.sumi-placement-part` groups, each a
`.sumi-label` and a `.sumi-choices` list of `.sumi-choice` buttons whose
last choice is "new"; picking it shows a text field under the list. The
version is a row of `.sumi-chip` toggles with `aria-pressed`. Give each
part `role="group"` and `aria-labelledby` its label.

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

## Steps and commands

`css/steps.css` holds a short numbered guide and a copyable command.

- `.sumi-steps` on an `<ol>`: each `<li>` is one step, usually an `h4`
  and its body. The numbers (01, 02, …) are drawn in display type in the
  accent text colour, joined by a hairline; they are silent to screen
  readers, which read the list's own numbering.
- `.sumi-command` holds a `<pre><code>` with one shell command and a
  `.sumi-command-copy` button after it. Give the button an `aria-label`
  that names the command. The app does the copying, for example by
  pushing the server's own text to a clipboard hook. Give the `pre`
  `tabindex="0"`, `role="region"` and an `aria-label`, so keyboard users
  can scroll a long command. A long command scrolls inside its block,
  never the page; on touch screens the button is at least 44 by 44 CSS
  pixels.

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

An option may carry one plain description line, for choices that need more
than a name to tell apart (for example, a role). Give the option's label its
own element (`[data-option-label]`) and follow it with the description text;
put the same text in `data-description` on the option, so the hook can move
it to the control when that option is chosen. Render `[data-select-description]`
once, under the control, holding the chosen option's description (empty and
`hidden` when it has none); point the control's `aria-describedby` at it, so
the description reaches assistive tech before the list ever opens, not only
inside it. `ItazuWeb.Controls.select` does this for `{label, value, description}`
options; `{label, value}` still works, with no description shown.

Every option needs `[data-option-label]` around its label now, description
or not: the selected checkmark draws on that element
(`[aria-selected="true"] [data-option-label]::after`), not on the option as
a whole, so an option that puts its label straight in as text, with no
`[data-option-label]` wrapper, shows no checkmark when selected.

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

## Dialogs

`css/dialog.css` and `js/dialog.js` provide a confirmation pattern using
Sumi surface, border, radius and danger tokens. `ItazuWeb.Controls.dialog`
provides the Phoenix adapter. Register `SumiDialog` as a LiveView hook.
Native `showModal()` contains focus and makes the background inert.
Destructive forms must validate the typed identifier on the server too.

| Markup | Behaviour |
| --- | --- |
| `.sumi-dialog` on a `<dialog phx-hook="SumiDialog">`, `.sumi-dialog-body` inside | A confirmation, 30rem wide (`--sumi-dialog-width`), with a danger line on top. |
| `.sumi-dialog-head` | The title row: the `h2` on the left; optionally `.sumi-dialog-head-tools` (toggles) and a close button on the right. |
| `.sumi-dialog.sumi-dialog-large` | Most of the screen (`min(96vw, 1600px)` by `92dvh`; the whole screen at 540px and below), for looking at one thing closely. Its body is a column with a compact head: give the part that should take the room left `flex: 1; min-height: 0`, and keep the rest to one row above and one below. |
| `[data-dialog-close]` on a button inside | Escape and a click on the backdrop press it, so closing uses that button's own `phx-click` and `phx-target`. Without one they push `close_dialog` to the LiveView. |
| `[data-dialog-prev]`, `[data-dialog-next]` on buttons inside | The Left and Right arrow keys press them (not while typing in a field, and not with a modifier key). |
| `data-return-focus="<id>"` on the dialog | When the dialog goes, focus returns to that element; without it, to the element that had focus when the dialog opened. |

## Component library

Sumi's Storybook previews the shared foundations, controls, and patterns in
Ink, Paper, and Snow. Use Node 22.22.2 or newer:

```sh
npm ci
npm run storybook
```

Build the static site with `npm run build-storybook`. See
[the Storybook guide](docs/storybook.md) for browser checks, adding stories,
and private deployment to `sumi.hattori.ai` with Cloudflare Pages and Access.
