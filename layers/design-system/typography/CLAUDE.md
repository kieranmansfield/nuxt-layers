# Typography Layer

Typography components (`Typography`, `TypographyHeadline`, `TypographyCodeBlock`,
`TypographyQuoteBlock`, `TypographyRepeatText`, `TypographyTextStroke`) plus `useTypography` and
`useColor`, sized on a ratio-driven modular scale. Why the scale replaced the old fluid clamps:
`docs/adr/0003-modular-step-system-replaces-fluid-clamps.md`.

## Modular type scale

```text
font-size = round(--type-base × --type-scale ^ --step, --type-snap)
```

| Token            | Value                                        | Notes                                                          |
| ---------------- | -------------------------------------------- | -------------------------------------------------------------- |
| `--type-min`     | `1rem`                                       | base below 48rem                                               |
| `--type-max`     | `1.2rem`                                     | base from 48rem                                                |
| `--type-base`    | `var(--type-min)`, `var(--type-max)` ≥ 48rem | read per element                                               |
| `--type-scale`   | `1.26`                                       | ≈ 2^(1/3) — three steps double a size                          |
| `--type-snap`    | `0.0625rem`                                  | rounding interval; rem, never px, never 0                      |
| `--step-display` | 5 → 7 across 360 → 1280px                    | `vw` term × root / 16px, so the exponent depends on width only |

Utilities (`app/assets/css/typography.css`): `text-step-sm` (step −1), `text-step-0` …
`text-step-12`, `text-step-display`. Everything is rem-based, so a larger user font size scales
every step; the 48rem switch moves with it (rem in media queries = the browser default, e.g.
1152px at a 24px default). Line heights fall with size, anchored on the reference's body 1.7,
h2/h3 1.2 and h1 0.95: sm 1.5 · 0 1.6 · 1 1.7 · 2–3 1.2 · 4 1.15 · 5 1.1 · 6 1.05 · 7 1 ·
8–12 and display 0.95.

Element defaults (`@layer base`, so any `text-*` utility still wins). Headings only match without a
`data-slot` attribute — Nuxt UI's own titles (UModal, USlideover, …) keep inheriting:

| Element | Step    | Line height         |
| ------- | ------- | ------------------- |
| `body`  | 1       | 1.7                 |
| `h1`    | display | 0.95                |
| `h2`    | 3       | 1.2                 |
| `h3`    | 2       | 1.2                 |
| `h4`    | 1       | 1.2 (core/base.css) |
| `h5–h6` | 0       | 1.2 (core/base.css) |

Computed sizes (px, 16px root):

| Step     | < 48rem   | ≥ 48rem   |
| -------- | --------- | --------- |
| sm (−1)  | 13        | 15        |
| 0        | 16        | 19        |
| 1 (body) | 20        | 24        |
| 2 (h3)   | 25        | 30        |
| 3 (h2)   | 32        | 38        |
| 4        | 40        | 48        |
| 5        | 51        | 61        |
| 6        | 64        | 77        |
| 7        | 81        | 97        |
| 8 – 12   | 102 – 256 | 122 – 307 |
| display  | 51 → 81   | 61 → 97   |

**Every step jumps ×1.2 at 48rem** — the base switches there (h1 ≈ 62 → 75px at 768px). This
matches the reference system; it is not a bug.

## Components

```vue
<Typography :step="1">Body copy</Typography>
<TypographyHeadline :level="2">One step below display</TypographyHeadline>
<TypographyHeadline :level="2" :step="5">Explicit step</TypographyHeadline>
<TypographyRepeatText text="SWISS" :step="10" />
```

`step` takes precedence over `size` (Tailwind `text-*`). `TypographyHeadline` is a display
hierarchy: when neither `step` nor `size` is passed, each level sits one step below the previous,
starting at the fluid display step (`--step: calc(var(--step-display) - (level − 1))`, set inline
so the base h1–h6 rules size it) — 51/40/32/25/20/16px at 320px, 97/77/61/48/38/30px at 1280px.
Plain `<h1>`–`<h6>` keep the reading scale (display, 3, 2, 1, 0, 0). `Typography` has no default
size: it inherits (body copy = the body step).

Cascade notes:

- `useTypography` only emits a `leading-*` class when `leading` is passed — Tailwind sorts
  `leading-*` after `text-step-*`, so one would override the step's line height.
- A Tailwind `text-{size}` class on the same element also sorts after, and beats, `text-step-*`.
- `app/app.config.ts` registers `text-step-*` as a font-size group in Nuxt UI's tailwind-merge
  (`ui.tv.twMergeConfig`). Without it tailwind-merge reads them as a text _colour_, so
  `<UButton class="text-step-2">` would drop the button's colour and keep its `text-sm`. With it,
  a step class on a Nuxt UI component replaces the component's `text-{size}`.

## Nuxt UI prose (Nuxt Content)

`app/app.config.ts` also retunes `ui.prose`: `h1` → `text-step-4` (one step above h2 — content
pages already show a page-header title), `h2` → `text-step-3`,
`h3` → `text-step-2`, `h4` → `text-step-1`, and `p`/`li` swap `leading-7` for `leading-[1.7]`, so
copy inherits the body step at the body's leading. Without it Nuxt UI's fixed
`text-4xl`/`2xl`/`xl`/`lg` headings sat at or below the 24px copy.

## Overrides

- **Per element:** font-size is recomputed wherever a rule sets it from `--step` (body, h1–h6
  without `data-slot`, `text-step-*`), so override `--step` there, fractional steps included:
  `<h2 style="--step: 4">`, `<p class="text-step-0" style="--step: 0.5">`. Setting `--step` on
  an element with no such rule does nothing on its own.
- **Per subtree:** override `--type-base` or `--type-scale` — both are read where used, e.g.
  `.card { --type-base: clamp(0.9rem, 0.8rem + 2cqi, 1.1rem); }`. Only elements with a step
  rule rebase (headings, `text-step-*`); plain `p`/`li` keep the size they inherit, so give the
  wrapper a `text-step-*` class too if its body copy should follow. `cqi` resolves against the
  nearest _ancestor_ container, never the element's own. Overriding `--type-min`/`--type-max`
  on a subtree does nothing: `--type-base` already substituted them at `:root`.

## Spacing tokens (core)

`--space-*` lives in `layers/core/app/assets/css/tokens/spacing-fluid.css` and backs the
`Spacing` token used by `useLayoutAttrs()`:

```text
--space-* = --space-base × 1.414 ^ n     (--space-base: 11.3px at ≤ 320px → 16px at ≥ 1280px)
xs n=−1 · sm 0 · md 1 · lg 2 · xl 3 · 2xl 4 · 3xl 5
```

The base grows one step (√2), not the reference's two (8 → 16px), so phones keep the old token
sizes: xs 8 · sm 11.3 · md 16 · lg 22.6 · xl 32 · 2xl 45.2 · 3xl 64px at 320px, ×√2 by 1280px.

Trap: the steps substitute `--space-base` at `:root`, so overriding `--space-base` on a subtree
does **not** change `--space-md` inside it. Per-subtree spacing retuning is not supported.

## Gotchas

- `TYPE_STEP_CLASSES` (`app/composables/typography.ts`) must stay a literal map — Tailwind's
  scanner only sees complete class names. `typography.test.ts` fails if the map and the
  `@utility` list drift.
- `typography.css` is `@import`ed by relative path from `core.css`, the single Tailwind build
  root. Never add `@import 'tailwindcss…'` here or register it via a `css:` array — see
  `kmcom-nuxt-layers-typography-css-bug.md`.
- Don't change the `html` font-size or put the scale in `@theme` — rem math, spacing and the
  grid's `rlh` unit depend on the browser default root.
- `round()` stays in real declarations behind `@supports`, each after a plain `calc()`
  fallback — in a custom property it would make `font-size` invalid in browsers without it.
