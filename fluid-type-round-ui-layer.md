# Task: stepped fluid type scale with `round()` — UI layer

**Repo:** `kmcom-nuxt-layers`
**Target layer:** `ui` (not `theme` — see [Layer boundary](#layer-boundary))
**Reference:** [Better fluid sizing with `round()` — Ahmad Shadeed](https://ishadeed.com/article/css-round/)
**Stack assumptions:** Nuxt 4, Tailwind CSS v4, Nuxt UI v4

---

## 0. Before you write anything

1. Locate the UI layer's CSS entrypoint and any existing `@theme` / `@utility` blocks. Do not assume paths — find them.
2. Report back the following before implementing:
   - the file(s) where Tailwind v4 theme tokens are currently declared in the `ui` layer
   - whether the `ui` layer currently overrides any `--text-*` tokens
   - the installed Tailwind version (the `@utility` and `--value()` APIs differ across v4 minors)
3. Work on a branch using the repo's existing typed-prefix convention.

---

## 1. Goal

Add an **opt-in fluid type scale** to the UI layer where the computed font size is fluid but lands on **predictable, discrete steps** rather than arbitrary values like `19.7px`.

The mechanism is `clamp()` for the fluid range, wrapped in `round()` to snap the result to an interval:

```css
font-size: round(down, clamp(1.25rem, 1.125rem + 0.75vi, 1.75rem), var(--fluid-step));
```

`round(<strategy>, <value>, <interval>)`. Strategies: `up`, `down`, `nearest` (default if omitted), `to-zero`.

`round()` is Baseline since May 2024 (all three engines). It still needs a fallback — see [§4](#4-progressive-enhancement).

---

## 2. Non-goals / hard constraints

Do **not**:

- Override Tailwind's default `--text-xs` … `--text-9xl` tokens. Nuxt UI v4 components (buttons, inputs, dropdowns) consume those. Making them fluid will cause control heights and hit areas to shift on resize. Add a **parallel namespace** instead.
- Use a **px** rounding interval. See [§5](#5-accessibility-non-negotiable).
- Allow the interval to be `0`. Per spec, an interval of `0` makes `round()` return NaN, which is invalid at computed-value time and drops the declaration. There is no "interval: 0 turns rounding off" escape hatch — implement "off" as a separate code path if it's needed at all.
- Add any JavaScript. This is pure CSS; there is no hydration-flash concern and no runtime to build.
- Touch the `core`, `layout`, `motion`, `shader`, or `theme` layers.

---

## 3. Implementation

### 3.1 Raw tokens + step

Declare the unrounded `clamp()` expressions and the rounding step as ordinary custom properties on `:root`, inside the UI layer's base styles.

```css
:root {
  /* Rounding interval. rem, never px. */
  --fluid-step: 0.25rem;

  /* Unrounded fluid ranges. Endpoints MUST be integer multiples of --fluid-step. */
  --fluid-text-md-raw:  clamp(1rem,    0.9375rem + 0.35vi, 1.25rem);
  --fluid-text-lg-raw:  clamp(1.25rem, 1.125rem  + 0.75vi, 1.75rem);
  --fluid-text-xl-raw:  clamp(1.5rem,  1.25rem   + 1.5vi,  2.5rem);
  --fluid-text-2xl-raw: clamp(2rem,    1.5rem    + 2.5vi,  3.5rem);
  --fluid-text-3xl-raw: clamp(2.5rem,  1.75rem   + 4vi,    5rem);
}
```

**These numbers are placeholders — flag them for review rather than treating them as final.** The invariant that matters:

> With strategy `down`, every `clamp()` min and max must be an exact integer multiple of `--fluid-step`.

Otherwise the floor undercuts the intended minimum: `round(down, 0.875rem, 0.25rem)` → `0.75rem`, i.e. a 14px token silently renders at 12px. If a scale genuinely needs off-grid endpoints, halve the step to `0.125rem` rather than switching strategy.

`vi` (logical inline viewport unit) is preferred over `vw` for writing-mode correctness. If the repo's browser support target predates it, use `vw`.

### 3.2 Utilities

Use Tailwind v4's `@utility`, **not** `@theme`, for these. Reason: with `@theme`, the token is declared on `:root`, so any `var(--fluid-step)` nested inside it substitutes against `:root` and is frozen before it inherits. Per-scope step overrides would silently do nothing. Putting `round()` in the utility declaration means both `var()`s resolve on the element that uses the class.

```css
@utility text-fluid-md {
  font-size: var(--fluid-text-md-raw);
  line-height: 1.4;
  @supports (font-size: round(1rem, 1rem)) {
    font-size: round(down, var(--fluid-text-md-raw), var(--fluid-step));
  }
}

@utility text-fluid-lg {
  font-size: var(--fluid-text-lg-raw);
  line-height: 1.25;
  @supports (font-size: round(1rem, 1rem)) {
    font-size: round(down, var(--fluid-text-lg-raw), var(--fluid-step));
  }
}

/* …xl, 2xl, 3xl, same shape */
```

CSS has no loops, so the repetition is unavoidable at this scale. Accept it. If Tailwind's installed version supports functional utilities with `--value()`, consolidating into a single `@utility text-fluid-*` is a reasonable follow-up — but verify the syntax against the docs for the installed version before attempting it, and don't block this task on it.

Line heights must be **unitless ratios**, not fixed lengths — a fixed `line-height` paired with a fluid `font-size` collapses at the top of the range.

### 3.3 Per-scope step overrides

Because the step resolves per-element, a consumer can retune the ladder for a subtree with a single declaration:

```css
.editorial-lede { --fluid-step: 0.125rem; }  /* finer steps */
```

Document this as the supported extension point.

---

## 4. Progressive enhancement

The `@supports` block in §3.2 is load-bearing and must not be flattened. In a browser without `round()`, the declaration inside `@supports` never applies and the plain `clamp()` above it stands — fluid but unstepped, which is a fine degradation.

Note the trap this avoids: if `round()` were placed in a **custom property** rather than a real declaration, an unsupported browser would parse the custom property fine (custom properties accept nearly any token stream) and then fail at substitution time, making `font-size` invalid at computed-value time. The fallback would not kick in. Keep `round()` in real declarations only.

Feature test: `@supports (font-size: round(1rem, 1rem))`.

---

## 5. Accessibility (non-negotiable)

**The interval must be in `rem`.** A px interval quantises the result to a fixed device grid, so a user who raises their browser's default font size gets snapped back to the same px ladder — text-size preferences stop working. A rem interval scales the ladder with the root font size, preserving the preference. (The source article uses px intervals in its demos; deviate from it here deliberately.)

Every `clamp()` must keep a **rem term in the middle argument** (`0.9375rem + 0.35vi`, not `2.5vi` alone), so text still responds to root font size changes independent of viewport width. Do not remove these.

Verify: with browser default font size set to 24px, every `text-fluid-*` utility must produce a visibly larger value than at 16px, at a fixed viewport width.

---

## 6. Verification

Run the dev server and check:

1. **Generated CSS** — inspect the compiled output. Confirm each utility emits both the `clamp()` fallback and the `@supports`-gated `round()`, and that Tailwind hasn't hoisted or deduplicated them incorrectly.
2. **Stepping** — at viewport widths 320 / 480 / 768 / 1024 / 1440 / 1920, record the computed `font-size` for each utility. Every value must be an integer multiple of 4px (at a 16px root). Paste the table into the PR.
3. **Endpoints** — at the narrowest and widest widths, the computed value must equal the `clamp()` min and max exactly, not one step below.
4. **Root font size** — repeat check 2 at a 24px root. Values must now be multiples of 6px, and must all be larger.
5. **Zoom** — 200% browser zoom, no clipping or overlap.
6. **Cross-browser** — Chrome, Safari, Firefox. Confirm identical stepped values; note any divergence rather than working around it silently.
7. **Fallback path** — confirm the unrounded `clamp()` renders sensibly when the `@supports` block is disabled (comment it out temporarily).
8. **No regressions** — Nuxt UI buttons, inputs, and dropdowns must be pixel-identical to `main`. If anything moved, a default `--text-*` token was touched; revert it.

---

## 7. Layer boundary

This lives in the **UI layer** because it defines component-facing typography utilities, not a runtime-switchable theme dimension.

The seam to the theme layer, if it's ever wanted, is clean and should be noted in the PR description but **not built now**: because `--fluid-step` resolves per-element, a theme-layer `data-*` attribute could retune or effectively disable the stepping without the UI layer knowing anything about it — e.g. `[data-fluid-type="fine"] { --fluid-step: 0.125rem; }`.

---

## 8. Optional follow-up (do not include in this PR)

Given the repo's grid-system leanings, `round()` also solves **baseline snapping**: `line-height: round(up, <ratio-derived value>, var(--fluid-lead))` snaps leading to a vertical rhythm unit, and `height: calc-size(auto, round(up, size, var(--fluid-lead)))` snaps card heights to the same grid. `calc-size()` is Chromium-only, so treat it strictly as an enhancement. Raise as a separate issue.

---

## Acceptance criteria

- [ ] Fluid utilities live in the `ui` layer under a namespace parallel to `--text-*`; no default Tailwind or Nuxt UI type token is modified.
- [ ] Every `clamp()` endpoint is an integer multiple of `--fluid-step`.
- [ ] The rounding interval is expressed in `rem`.
- [ ] Every `clamp()` middle term includes a `rem` component.
- [ ] `round()` appears only in real declarations, each gated behind `@supports`, each with a plain `clamp()` fallback preceding it.
- [ ] `--fluid-step` is overridable per subtree, and this is documented.
- [ ] Verification table from §6.2 and §6.4 included in the PR.
- [ ] No JavaScript added; no other layer modified.
