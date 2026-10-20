# 0003 — One modular step scale replaces the fluid type and spacing clamps

Status: accepted (2026-10-20)

## Context

Type and spacing were two unrelated sets of hand-tuned `clamp()` ranges: 13 `text-fluid-*`
utilities (plus 13 `-cq` copies) snapped by `round(down, …, 0.25rem)`, and 8 `--fluid-space-*`
tokens (plus 7 `-cq` copies). No ratio linked one size to the next, so every new size was
another clamp to tune, and the `-cq` sets had no consumers. The reference system (matuzo.at,
analysed in `matuzo-typography-system-1.md`) gets better proportions from two ratios.

## Decision

Every size is a step on a scale:

- **Type:** `font-size = round(--type-base × 1.26^--step, 0.0625rem)`. Base is `1rem` below
  48rem and `1.2rem` from 48rem; body is step 1 (20 → 24px). `h1` uses a fluid display step,
  5 → 7 across 360 → 1280px, cast from a length with `tan(atan2(…, 1rem))`. Utilities are
  `text-step-sm`, `text-step-0` … `text-step-12`, `text-step-display`.
- **Space:** `--space-* = --space-base × 1.414^n`, with `--space-base` running 8 → 16px across
  320 → 1280px. The `Spacing` union is unchanged; only the values behind it moved.
- **Grid:** the `grid` layer's `--fs` shares the type scale's endpoint tokens (`--type-min`,
  `--type-max`) but stays continuous, so its rhythm unit does not inherit the 48rem jump.

It is a parallel namespace: Tailwind's `--text-*`, Nuxt UI's `--ui-*` and the `html` font-size
are untouched. Tokens are plain `:root` properties, not `@theme`, so `var(--step)` resolves on
the element using it.

## Consequences

- The top end is coarser: default `TypographyHeadline` sizes drop (h1 144 → 97px, h2 120 →
  38px at 1280px). The bottom end is finer.
- Body text grows from 16px to 20/24px, and body line-height from 1.5 to 1.7. Nuxt UI
  components with explicit `text-*` sizes are unaffected; anything that inherits body size
  (card bodies, plain prose) grows.
- Every step jumps ×1.2 at 48rem because the base switches there (h1 ≈ 62 → 75px at 768px).
- Spacing is smaller at the small end and grows faster mid-range.
- `--space-*` steps are substituted at `:root`, so per-subtree spacing retuning is not
  supported. Type retuning is: `--type-base` and `--type-scale` are read per element.
- The display step is normalised by `1rem`, so it stays 5 → 7 at any root font size; with a
  larger root the 5 → 7 transition happens at wider viewports (540 → 1920px at a 24px root).
