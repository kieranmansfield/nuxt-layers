# Layout system — forensic reference

Source: `src/layout.css`. Demo: `index.html`. Design rationale/history: `GRID.md`
(superseded by this doc where they conflict — GRID.md's "known issues" are
now fixed, see Changelog below).

## Governing idea

One root unit derives everything else. No breakpoints, no orientation query.

```
--fs (fluid font-size)
  → line-height (rounded to px)
    → --unit: 1rlh
      → --edge-min, --lpf, --measure-min
        → --lines, --fields, --type-b, --slack
          → padding-block, grid tracks, gap
```

Change `--fs`'s clamp and the whole grid — margins, field height, column
count threshold — rescales in step. This is the one thing that must not
break if this becomes a shared layer: **the grid has no size values of its
own**, only ratios against `--unit`.

## Layer boundary: what belongs in `layout`

`--fs` and the root `line-height` are **not optional inputs** to this
system — `--unit: 1rlh` is derived directly from them. A separate
typography layer supplying its own font-size scale would break the grid
unless it also exposes `--unit` (or layout keeps deriving its own). Two
options if a typography layer already exists:

1. **Keep `--fs`/`line-height` here.** Layout owns the one clamp that
   feeds the grid; typography layer owns everything else (font-family,
   weight scale, prose styles, headings not inside grid cells). This repo
   currently does this — recommended, since it keeps `--unit` correct by
   construction instead of by convention.
2. **Typography layer owns `--fs`, layout consumes it.** Only works if
   typography guarantees `--fs` is a registered `<length>` custom
   property (`@property`, see below) — an unregistered one breaks the
   `calc()` chain silently (see Pitfall 1).

The per-cell type scale (`.block h2`/`p` `cqi` clamps) is presentational
and has no grid dependency — safe to move to a typography layer as-is.

## Derivation, step by step

1. **Type.** `--fs: clamp(1rem, 0.95rem + 0.25svi, 1.125rem)`, registered
   via `@property` as `<length>` so downstream `calc()` gets a resolved
   length, not an unresolved token stream. `line-height` is `round(nearest,
   fs * 1.5, 1px)` — rounded, not raw, so grid boundaries land on-pixel.

2. **Unit.** `--unit: 1rlh`. `rlh` not `lh`: `lh` resolves against the
   *current* element, so a heading with different line-height would
   silently produce a different unit for anything nested in it. `rlh`
   always resolves against root.

3. **Minimums.**
   - `--measure-min: 22rem` — narrowest column, also the `repeat(auto-fill,
     minmax(...))` floor and the `@container cell` padding-step threshold.
   - `--edge-min: clamp(1unit, 8svi, 3unit)` — margin floor > 0 (never
     flush edge), steep `svi` slope so it shrinks fast on narrow screens.
     Feeds `--avail-b`, so it also trims top/bottom slack, not just
     inline edges.

4. **Lines.** `--avail-b: 100svh - 2*edge-min`. `--lines:
   round(down, avail-b, unit) / unit` — the only way to get an integer
   line-count out of a length in CSS.

5. **Fields.** `--lpf` (lines-per-field) clamped 4–8, itself scaled by
   viewport height (`round(down, 100svh/unit/4.5, 1)`) so a fixed lpf=8
   can't strand up to 8 line-heights as dead padding on a short viewport.
   `--fields: max(1, round(down, (lines+1)/(lpf+1), 1))` — from the
   identity that F fields + (F−1) one-line gaps occupy `F(L+1)−1` lines.

6. **Margins.** Whatever's left over, split 40/60 top/bottom so the block
   sits above optical centre — computed last because it *can't* be chosen,
   only what remains after the whole-line constraint.
   `--slack: 100svh - type-b`, clamped `max(0px, …)` on both sides so a
   short/landscape viewport degrades to scroll instead of negative padding.

7. **Columns.** `repeat(auto-fill, minmax(measure-min, 1fr))`. Native
   `auto-fill` computes column count from available space directly —
   `floor((avail+gutter)/(measure+gutter))` — without needing an integer
   derived via `calc()`. See Pitfall 1 for why this isn't `repeat(var(--n),
   ...)`.

Portrait/landscape fall out of steps 5 and 7 independently — no
orientation branch anywhere.

## Grid track sizing (current, post-fix)

```css
grid-template-columns: repeat(auto-fill, minmax(var(--measure-min), 1fr));
grid-auto-columns: minmax(var(--measure-min), 1fr);
grid-auto-rows: minmax(calc(var(--lpf) * var(--unit)), max-content);
```

No explicit `grid-template-rows` — `grid-auto-rows` alone covers every
row (explicit or implicit) with the same floor, so a separate template
would be redundant even if it worked.

## Container query scaffolding

- `.page` is `container-type: inline-size; container-name: viewport` —
  **not** `body` (GRID.md's caveat: `body` as containment root becomes
  the `position: fixed` containing block for descendants, an unrelated
  footgun). This lets `.span-2` query `.page`'s own resolved inline size.
- `.block`/`.plate` are `container-type: inline-size; container-name: cell`
  — feeds the `cqi`-based type scale and the padding step-down.
- Two container-query thresholds are **hand-kept in sync** with custom
  properties, because `@container` conditions can't reference custom
  properties at all:
  - `@container cell (max-width: 22rem)` mirrors `--measure-min`.
  - `@container viewport (min-width: 46rem)` mirrors `2 * --measure-min +
    gutter`, gating `.span-2`.

## Utility classes

| Class | Effect |
|---|---|
| `.span-2` | `grid-column: span 2`, gated behind `@container viewport (min-width: 46rem)` — see Pitfall 2 for why it's conditional |
| `.span-2-rows` / `.span-3-rows` | `grid-row: span N`, unconditional (row spans don't have the implicit-track failure mode column spans do, since rows already grow via `grid-auto-rows: max-content`) |
| `.block` | Bordered cell, `cqi`-scaled heading/body, padding step-down under 22rem |
| `.plate` | Filled/inverted cell (image-module stand-in), no border |
| `.hero` | Full-viewport (`100svh`) flex-centered section, deliberately **outside** the grid system — no `--fields`, no column derivation |

## Pitfalls (root-caused this session, fixed — kept here so they aren't reintroduced)

### 1. `repeat(var(--n), ...)` silently invalidates

`repeat()`'s track-count argument requires a literal `<integer>` at
computed-value time. An **unregistered** custom property built from
`calc()`/`round()` (e.g. an early `--cols`/`--fields` attempt) doesn't
satisfy that — it substitutes as a token stream, not a resolved integer.
The whole `grid-template-columns`/`-rows` declaration becomes invalid at
computed-value time and falls back to `none`. The grid then auto-places
into **implicit** tracks sized by the default `grid-auto-columns/rows:
auto` (content/min-content sized) — cells silently squash to unreadable
slivers.

This is invisible to `pnpm build` (pure syntax check, not computed-value
resolution) — only catchable via real browser `getComputedStyle()`
inspection. `getComputedStyle(...).gridTemplateColumns` reports the
actual *used* track list, implicit tracks included, even when the
authored declaration was invalid — that mismatch (declared `repeat(var())`
vs. computed content-sized tracks) is the tell.

Fix: use `repeat(auto-fill, minmax(<length>, 1fr))` — native keyword,
no var()-derived integer needed, browser computes count itself.

### 2. Span utility forcing malformed implicit tracks

Even after fixing #1, `.span-2` unconditionally applying `grid-column:
span 2` would force CSS Grid to fabricate an extra **implicit** column
whenever `auto-fill` had only resolved 1 explicit column (narrow/medium
viewport). That implicit column defaults to `auto` (content-sized) unless
`grid-auto-columns` is explicitly set to match — squashing sibling 1×1
cells that landed in it, and in some cases overflowing the viewport
width (horizontal scroll at ~900px).

Fix: two parts —
- `grid-auto-columns: minmax(var(--measure-min), 1fr)` so *any* forced
  implicit column gets the same sizing as explicit ones (belt-and-braces).
- Gate `.span-2`'s `grid-column: span 2` behind `@container viewport
  (min-width: 46rem)` so it only activates once 2 columns have genuinely
  resolved — below that threshold `.span-2` cells stay normal 1×1,
  never forcing the fabrication in the first place.

Verified clean (no squash, zero horizontal scroll, `.span-2` correctly
gated) across 500 / 768 / 900 / 1024 / 1440 / 1920px via live
`getComputedStyle` inspection, not just visual screenshot.

## Constraints to preserve (from GRID.md, still binding)

- Every fluid `clamp()` keeps a `rem` term — a pure `vw`/`cqi` middle term
  ignores browser zoom, fails WCAG 1.4.4.
- Never `line-height: normal` on `:root` — font-metric dependent, whole
  grid would reflow on webfont swap.
- `svh`/`svi`, never `dvh`/`vw`/`vh` — `dvh` recomputes on mobile URL-bar
  collapse, reflowing mid-scroll.
- `lh`/`rlh` don't resolve correctly in media queries (resolve against
  initial font there) — use `rem`, or a container query with `cqi`.
- `container-type` never on `body` (fixed-position containing-block trap).
- `@container` conditions can't read custom properties — any threshold
  that mirrors a custom property (measure-min, the span-2 gate) must be
  hand-kept in sync; comment the pairing at both ends when adding one.

## Changelog vs. GRID.md's "known issues"

All five issues GRID.md listed are now resolved:

1. ~~`--fields` isn't enforced~~ — `grid-auto-rows` applies the field-height
   floor uniformly to explicit and implicit rows; explicit
   `grid-template-rows` was attempted but hit Pitfall 1, so this is
   enforced via the auto floor instead, not a template.
2. ~~`1rlh` fractional~~ — fixed via `round(nearest, fs*1.5, 1px)`.
3. ~~`100svw` scrollbar gutter~~ — moot: columns no longer derive from an
   `--avail-i`/`--cols` calc chain at all (removed, see Pitfall 1);
   `auto-fill` measures the container's actual content box.
4. ~~Unit mismatch (`vw` vs `svw`/`svh`)~~ — `--fs` clamp uses `svi`.
5. ~~`max(1, …)` masking impossible constraint~~ — `--slack` and
   `padding-block` both clamp to `max(0px, …)`; short/landscape viewports
   degrade to scroll with zero (not negative) padding, not overflow.

## Not yet resolved

- `--lpf` is fixed-clamped, not derived from column width (near-square
  module solve) — noted in GRID.md, still open.
- `.hero` sections (outside the grid, `100svh` flex-centered) untested at
  very short viewports with heavy text content — theoretical overflow
  path, low risk (plain centered flex, no field math), not yet verified.
- `svi` vs `svmin` for the type-scale slope — GRID.md's landscape-symmetry
  question, still open.
