# Task: replace fluid type + fluid spacing with a modular step system (type, spacing, grid base)

**Repo:** `kmcom-nuxt-layers`
**Supersedes:** `fluid-type-round-ui-layer.md` (stepped `clamp()` + `round(down, …, 0.25rem)`). Add a "superseded by …" note at its top; do not delete it.
**Reference system:** matuzo.at — ratio-based type steps and a fluid spacing scale. Analysis and a tested reconstruction of the type part are in `matuzo-typography-system.md` (attached alongside this brief).
**Stack:** Nuxt 4, TypeScript, Tailwind CSS v4, Nuxt UI v4, pnpm + Turbo.

---

## 0. Before you write anything

1. Work on a branch using the repo's typed-prefix convention (find it from `git log` / existing branches; e.g. `feat/modular-scale`).
2. **Inventory first, edit second.** Grep the whole repo (all `layers/**` and `apps/**`, `.vue`, `.ts`, `.css`, `.md`, `.mdc`) for each of these and produce a table of `file : line : what`:
   - `text-fluid-` (including `-cq` variants)
   - `fluidSize`, `FluidFontSize`, `FLUID_SIZE_CLASSES`
   - `--fluid-text-`, `--fluid-step`, `--fluid-space-` (including `-cq`)
   - `Spacing` token type and every consumer (`useLayoutAttrs`, `Element`, `ElementTw`, stack primitives, `Section/*`)
   - `--fs`, `1rlh`, `--unit` outside `grid.css`
3. Report the inventory before implementing. **Stop and report instead of improvising if** any of these hold:
   - `-cq` variants have real consumers (see §4.5 for the intended port, but confirm scope first)
   - something outside `design-system/typography`, `core` tokens, `layout`, `grid` consumes `--fluid-*`
   - the installed Tailwind version can't do nested `@supports` inside `@utility` (the current code does, so it should)
4. Record installed Tailwind and Nuxt UI versions in the PR description.

---

## 1. Goal

Replace the two independent fluid systems (13 `text-fluid-*` clamp ranges; 8 `--fluid-space-*` clamp ranges) with **one ratio-driven system**, so every size is a *step on a scale* rather than a hand-tuned clamp:

```
font-size = round(base × ratio^step, 0.0625rem)
space     = spaceBase × spaceRatio^n
```

- **Type:** ratio `1.26` (≈ 2^(1/3): three steps double). Base `1rem`, switching to `1.2rem` at `48rem`. Body sits at step 1 (20px → 24px).
- **Space:** ratio `1.414` (≈ 2^(1/2): two steps double). Base `clamp(0.5rem, 0.3333rem + 0.8333vw, 1rem)` (8px at ≤320px → 16px at ≥1280px).
- **Grid:** the grid layer's `--fs` shares the same endpoint tokens as the type base (see §5).

`--step` is a per-element custom property. Size is recomputed from the base each time, so steps never compound.

---

## 2. Hard constraints

Do **not**:

- Override Tailwind's `--text-xs … --text-9xl` or any Nuxt UI `--ui-*` token. Nuxt UI components consume them. The new system is a **parallel namespace**.
- Change the `html` / `:root` font-size. It stays at the browser default (16px). All rem math, spacing and `rlh` depend on it.
- Open a second Tailwind build root. No `@import 'tailwindcss/...'` anywhere except `core.css` (see `kmcom-nuxt-layers-typography-css-bug.md` — this broke production nav padding once already).
- Register the new CSS via a layer's `css:` array. `@theme` / `@utility` blocks are inert unless `@import`ed by relative path from `core.css`. Edit the files that are **already** imported there (`typography.css`, `tokens/spacing-fluid.css`) rather than adding imports. If you rename `spacing-fluid.css`, update the import in the same commit.
- Add any JavaScript runtime. Types, composables and Headline.vue change; no new runtime logic.
- Allow a rounding interval of `0`, or a **px** interval. Use `0.0625rem` (= 1px at a 16px root, scales with the root font size). This deliberately differs from Matuzo's literal `1px` to keep the repo's existing rem-interval rule.
- Use `@theme` for the new tokens. Use plain `:root` custom properties and `@utility`, same as today, so `var(--step)` resolves per element. `--space-*` is chosen because it is **not** a Tailwind theme namespace; do not declare these inside `@theme`, or `--space-xs` / `m` / `xl` risk colliding with `--container-*` size names.
- Put `container-type` on `body`, or touch `core`'s Tailwind root, `motion`, `shader`, `theming`, or `layout` beyond what §4.4 lists.
- Apply `font-size` to a universal `body *` selector. Matuzo's page does, but here it would fight component CSS. Set `--step` / font-size only on `body`, `h1–h6` and the `text-step-*` utilities; descendants inherit normally.

Previous-spec invariants that **no longer apply**: "clamp endpoints must be exact multiples of the step" (that was only needed for `round(down, …, 0.25rem)`; the new rounding is `nearest` on a 1px-equivalent interval).

---

## 3. Type implementation (`layers/design-system/typography/app/assets/css/typography.css`)

### 3.1 Tokens

Remove: `--fluid-step`, all `--fluid-text-*-raw` and `*-cq-raw`, all 26 `@utility text-fluid-*`.
**Keep:** `@theme { --font-sans/mono/display }` and `--heading-text-scale-damp`.

```css
:root {
  --type-min: 1rem;       /* base below 48rem */
  --type-max: 1.2rem;     /* base from 48rem  */
  --type-base: var(--type-min);
  --type-scale: 1.26;
  --type-snap: 0.0625rem; /* rounding interval, rem, never 0 */
  --measure: 54rem;

  /* Fluid display step, 5 → 7. Normalised by 1rem (not 1px) so the exponent
     does not change with the user's root font size. */
  --step-display: tan(atan2(clamp(5rem, 4.2176rem + 3.4784vw, 7rem), 1rem));
}
@media (min-width: 48rem) {
  :root { --type-base: var(--type-max); }
}
```

`--step-display` is the one untested change from the reference reconstruction (which used `clamp(0.3125rem, 0.2636rem + 0.2174vw, 0.4375rem)` over `1px`). Both forms give 5 at ≤360px and 7 at ≥1280px at a 16px root. Verify the `1rem` form in all three engines; if it misbehaves anywhere, fall back to the px form and **note in the PR that the display step then scales with root font size** (at a 24px root it becomes 7.5 → 10.5, which is too large).

### 3.2 Utilities

Enumerate literal utilities (the Tailwind scanner needs literal class names in source, hence the literal map in `typography.ts` — keep that pattern). Shape:

```css
@utility text-step-3 {
  --step: 3;
  font-size: calc(var(--type-base) * pow(var(--type-scale), var(--step)));
  line-height: 1.2;
  @supports (font-size: round(1rem, 1rem)) {
    font-size: round(calc(var(--type-base) * pow(var(--type-scale), var(--step))), var(--type-snap));
  }
}
```

Set of utilities: `text-step-sm` (step −1), `text-step-0` … `text-step-12`, and `text-step-display` (`--step: var(--step-display)`).

Line height by step (starting values measured from the reference, **not tuned** — flag for review):

| steps | line-height |
|---|---|
| sm, 0, 1 | 1.7 |
| 2 – 5 | 1.2 |
| 6 – 12, display | 0.95 |

Steps ≥ 7 and `display` also multiply font-size by `var(--heading-text-scale-damp)` (preserves current behaviour for the former `4xl+`). Confirm it's not dead code before keeping it; if dead, drop it and say so.

Fallback: if `round()` is unsupported, the unrounded `calc()` stands. If `pow()` is unsupported the declaration is invalid and the element inherits — acceptable (both are Baseline).

### 3.3 Element defaults (`@layer base`, inside typography.css)

```css
@layer base {
  body { --step: 1; font-size: /* same expression */; line-height: 1.7; }
  h1 { --step: var(--step-display); line-height: 0.95; text-wrap: balance; }
  h2 { --step: 3; line-height: 1.2; text-wrap: balance; }
  h3 { --step: 2; line-height: 1.2; text-wrap: balance; }
  h4 { --step: 1; }
  h5, h6 { --step: 0; }
}
```

Each heading also gets the matching font-size expression. Layer `base` loses to Nuxt UI/Tailwind utilities, so components with explicit `text-sm` etc. are unaffected. **Do not** change heading margins or paragraph spacing in `core/base.css` in this PR (see §8).

Expected body/heading values (hand-computed, ±1px tolerance for engine float differences):

| step | base 16px (<48rem) | base 19.2px (≥48rem) |
|---|---|---|
| sm (−1) | 13 | 15 |
| 0 | 16 | 19 |
| 1 (body) | 20 | 24 |
| 2 (h3) | 25 | 30 |
| 3 (h2) | 32 | 38 |
| 4 | 40 | 48 |
| 5 | 51 | 61 |
| 6 | 64 | 77 |
| 7 | 81 | 97 |
| 8 | 102 | 122 |
| 9 | 128 | 154 |
| 10 | 161 | 194 |
| 11 | 203 | 244 |
| 12 | 256 | 307 |

`text-step-display` (h1): 5 → 7 across 360 → 1280px viewport, i.e. ≈51 → 81px below 48rem and ≈61 → 97px above. **Expected, not a bug:** every step jumps by ×1.2 at 48rem because the base switches there (h1 goes ≈62 → ≈75px at 768). If that discontinuity is unwanted, say so in the PR instead of smoothing it silently.

### 3.4 Components and types

- `types/…` : replace `FluidFontSize` with `TypeStep = 'sm' | 0 | 1 | … | 12 | 'display'`.
- `composables/typography.ts`: replace the 26-entry literal `FLUID_SIZE_CLASSES` with a literal `TYPE_STEP_CLASSES` map (`{ sm: 'text-step-sm', 0: 'text-step-0', … , display: 'text-step-display' }`). Keep it literal.
- `Headline.vue`: replace the `fluidSize` prop with `step` (precedence over `size`, as `fluidSize` had). Default step by level — **proposal, flag for review**: `1: 'display', 2: 3, 3: 2, 4: 1, 5: 0, 6: 0` (old defaults were `6xl, 5xl, 4xl, 3xl, xl, lg`; the new scale is coarser at the top, finer at the bottom).
- Update every usage found in §0.2. Replace `text-fluid-*` classes with the nearest step by **computed size at a 1280px viewport**, not by name; list each substitution in the PR (`text-fluid-xl` → `text-step-N`, was ~X px, now ~Y px) so a reviewer can veto individual choices.
- Utilities `measure` (`max-inline-size: var(--measure)`) is optional; add it only if the inventory shows a hand-rolled equivalent.

---

## 4. Spacing implementation

### 4.1 Tokens (`layers/core/app/assets/css/tokens/spacing-fluid.css`)

Remove all `--fluid-space-*` and `-cq` variants (subject to §4.5). Replace with:

```css
:root {
  --space-scale: 1.414;
  --space-base: clamp(0.5rem, 0.3333rem + 0.8333vw, 1rem);

  --space-none: 0px;
  --space-xs:  calc(var(--space-base) * pow(var(--space-scale), -1));
  --space-sm:  calc(var(--space-base) * pow(var(--space-scale), 0));
  --space-md:  calc(var(--space-base) * pow(var(--space-scale), 1));
  --space-lg:  calc(var(--space-base) * pow(var(--space-scale), 2));
  --space-xl:  calc(var(--space-base) * pow(var(--space-scale), 3));
  --space-2xl: calc(var(--space-base) * pow(var(--space-scale), 4));
  --space-3xl: calc(var(--space-base) * pow(var(--space-scale), 5));
}
```

The names are chosen so the existing `Spacing` union (`none | xs | sm | md | lg | xl | 2xl | 3xl`) is **unchanged**; only the values behind it move. Resulting ranges (px at ≤320 → ≥1280 viewport): xs 5.7→11.3, sm 8→16, md 11.3→22.6, lg 16→32, xl 22.6→45.2, 2xl 32→64, 3xl 45.2→90.4. Old ranges for comparison: xs 8→10, sm 12→16, md 16→24, lg 24→40, xl 32→56, 2xl 48→80, 3xl 64→112. **The new scale is smaller at the small end and grows faster mid-range; report this in the PR.** If a mapping looks wrong in the playground, shift the exponents (e.g. `md` → 2) rather than editing the base.

Known trap (document it in the file): these tokens are substituted at `:root`, so overriding `--space-base` on a subtree does **not** change `--space-md` there. Per-subtree spacing retuning is therefore not a supported extension point in this PR. Type retuning *is* (`--type-base`, `--type-scale` are read at the element using them).

### 4.2 Consumers

`useLayoutAttrs()` / `Element` / `ElementTw` / `Spacing` consumers: point `var(--fluid-space-X)` at `var(--space-X)`. No type changes expected. If any consumer builds the variable name by string interpolation, keep it working and add a unit test.

### 4.3 Line of least surprise

Rhythm values are not on a `1rlh` baseline. That is intended (the reference system is ratio-based, not baseline-snapped). The grid layer keeps its own `--unit` (§5).

### 4.4 Files you may touch outside typography/core tokens

`layers/structure/layout/**` only to change `--fluid-space-*` references (mechanical rename). Nothing else in `layout`.

### 4.5 Container-query variants

If the inventory finds real `-cq` consumers, port them by **scoping the base, not by cloning utilities**: type uses `--type-base` and spacing could use a `--space-base-cq` / `--space-*-cq` set (unregistered custom properties keep `cqi` unresolved until use, same as today). Example type scope: `.card { --type-base: clamp(0.9rem, 0.8rem + 2cqi, 1.1rem); }`. Note that `cqi` resolves against the nearest *ancestor* container, never the element's own. If there are no consumers, delete the `-cq` tokens outright.

---

## 5. Grid base (`layers/structure/grid/app/assets/css/grid.css`) — do this last, as its own commit

Why this is the delicate part: `grid` derives everything from `--fs` → `line-height` → `--unit: 1rlh` (`--edge-min`, `--lpf`, `--lines`, `--fields`, gaps). Changing `--fs` or the root line-height rescales the whole grid. `LAYOUT-SYSTEM.md` calls this the invariant that must not break: *the grid has no size values of its own, only ratios against `--unit`.* Nothing consumes `grid` yet (CLAUDE.md, ADR 0001), so blast radius is low; the risk is a changed feel, not breakage.

**Do not** derive the unit from the body text size (step 1, 20–24px at line-height 1.7 → a ~34–41px unit, roughly +70% on every margin, gap and field height). Instead, share the *endpoint tokens* and keep the grid continuous:

```css
:root {
  --fs: clamp(var(--type-min, 1rem), 0.9333rem + 0.3333svi, var(--type-max, 1.2rem));
  line-height: round(nearest, calc(var(--fs) * 1.5), 1px); /* unchanged: 1.5, not body's 1.7 */
}
```

- `0.9333rem + 0.3333svi` reaches the max at 1280px (same 320 → 1280 span as `--space-base`). It keeps a `rem` term (WCAG 1.4.4).
- The `var(--type-min, 1rem)` fallbacks keep `grid` valid without extending `typography` (`grid → core` only).
- `--fs` stays registered via `@property` as `<length>`. Root line-height stays 1.5; `rlh` resolves against **root**, so body's 1.7 does not leak into the unit.
- Expected `--unit`: 24px at ≤320px, ≈26px at 768px, ≈29px at ≥1280px (old: 24 → 27px). Report the before/after.
- The grid does **not** pick up the 48rem step of `--type-base`, so its rhythm stays continuous ("no breakpoints" — `LAYOUT-SYSTEM.md`).
- Leave all `@container` thresholds (`22rem`, `46rem`) alone; they are rem and unaffected.
- Check whether `grid.css` has any per-cell `cqi` type scale; if so it is out of scope here and stays as is.

**Decision gate:** if the before/after grid screenshots in the playground differ noticeably beyond the ~2px unit change, revert this commit and say so — the type and spacing work stands on its own without it. Do not touch `layout`'s Swiss grid or merge the two grid systems (CLAUDE.md, ADR 0001).

---

## 6. Accessibility (non-negotiable)

- Every `clamp()` keeps a `rem` term in the middle argument (`--space-base`, `--step-display`, grid `--fs` all do).
- Rounding interval in `rem` (`--type-snap: 0.0625rem`).
- With the browser default font size at 24px, every `text-step-*`, body and heading size must be visibly larger than at 16px at a fixed viewport width. `--step-display` must stay 5 → 7 (the `1rem` normalisation).
- 200% zoom: no clipping or overlap.

---

## 7. Verification

Run: `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test` (Vitest). Then in the playground:

1. **Inventory after:** the §0.2 greps return zero hits for removed names (except in the superseded spec and ADR text).
2. **Class/CSS parity test (add to Vitest):** read `typography.css`, assert every class in `TYPE_STEP_CLASSES` has a matching `@utility`, and the reverse. Prevents scanner/utility drift.
3. **Generated CSS:** each `text-step-*` emits the plain `calc()` plus the `@supports`-gated `round()`. Nothing hoisted wrongly.
4. **Computed values:** at 320 / 480 / 767 / 768 / 1024 / 1280 / 1440 / 1920px record computed `font-size` for each step utility and for `body`, `h1`–`h3`. Compare with the §3.3 table. Paste the table into the PR. (A throwaway Playwright script is fine; do not commit it.)
5. **Display step:** record `h1` at the same widths; confirm 5 → 7 behaviour and the expected ×1.2 jump at 768.
6. **Spacing:** record computed `--space-*` as px at 320 / 768 / 1280 / 1920 and compare with §4.1.
7. **Root font size 24px:** repeat 4 and 5; everything larger, `--step-display` unchanged.
8. **Zoom 200%.**
9. **Cross-browser:** Chrome, Safari, Firefox. Note divergences (especially `tan(atan2())` with `rem`), don't work around silently.
10. **Fallback path:** comment out the `@supports` block; text still renders sensibly.
11. **Nuxt UI regression:** buttons, inputs, dropdowns, nav menu pixel-identical to `main` (they set explicit `text-*` sizes). Components that *inherit* body size (cards, alerts, prose) will grow with the new body size; list any, don't "fix" them silently.
12. **Single Tailwind root:** in a **production** build, the nav `UNavigationMenu` link has `padding-top: 6px` (the `py-1.5` regression from the typography CSS bug doc); only one `@import 'tailwindcss/…'` exists across layers.
13. **Grid (if §5 kept):** before/after screenshots at 500 / 768 / 1024 / 1440 / 1920px with no horizontal scroll, and `getComputedStyle().gridTemplateColumns` unchanged in shape.

---

## 8. Out of scope (raise as separate issues)

- Heading margins / paragraph spacing in `core/base.css` using the new tokens (reference system: `h2 margin-block: xl m`, `h3: xl xs`). Needs a decision on first-child behaviour and Nuxt UI/Content prose.
- Baseline-snapping line-heights to the grid unit with `round(up, …, 1rlh)`.
- A theming-layer switch (e.g. `[data-type-scale="tight"]`) that retunes `--type-scale`. The seam exists (`--type-scale` is read per element) but is not built here.
- Merging `layout`'s Swiss grid with `grid`.

---

## 9. Docs

- Update the typography layer's `CLAUDE.md` / README: new API (`text-step-*`, `--step`, `--type-*`, `--space-*`), the per-element step override, the spacing-token substitution trap (§4.1), the 48rem jump.
- Add a short ADR (`docs/adr/0002-modular-step-system-replaces-fluid-clamps.md`): context (hand-tuned clamps → one ratio), decision, consequences (coarser top end, new body size, jump at 48rem, grid shares endpoints only).
- Add the "superseded" note to `fluid-type-round-ui-layer.md`.

---

## Acceptance criteria

- [ ] Inventory table posted before any edit; no unresolved stop-condition from §0.3.
- [ ] No `text-fluid-*`, `fluidSize`, `FluidFontSize`, `--fluid-text-*`, `--fluid-step` or `--fluid-space-*` remain (other than in superseded docs).
- [ ] No default Tailwind or Nuxt UI type token modified; `html` font-size unchanged.
- [ ] Rounding interval is `0.0625rem`; every `clamp()` middle term has a `rem` component; `round()` only in real declarations inside `@supports`, each preceded by a plain `calc()` fallback.
- [ ] `--space-*` outside `@theme`; `Spacing` union unchanged.
- [ ] Class/CSS parity Vitest test added and passing; typecheck, lint, build, tests green.
- [ ] Verification tables (§7.4–7.6) in the PR; per-usage substitution list in the PR.
- [ ] Grid change is its own commit, with before/after evidence or reverted per the decision gate.
- [ ] Single Tailwind root confirmed in a production build.
- [ ] No JavaScript runtime added; `core`'s Tailwind root, `motion`, `shader`, `theming` untouched.
