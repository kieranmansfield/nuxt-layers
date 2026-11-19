# CSS Layer Containment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the cascade-layer priority in `layers/core` explicit and deterministic (instead of import-order-dependent), and stop hand-duplicating values Tailwind already defines, without disabling Tailwind or stripping Nuxt UI's styling.

**Architecture:** `layers/core/app/assets/css/core.css` is the single Tailwind build root every other layer extends into — one compiled CSS output, one cascade. Tailwind (full, preflight included) and `@nuxt/ui` (fully styled) stay exactly as they are today; this plan only (1) makes the layer priority between vanilla CSS and Tailwind/Nuxt UI explicit via a declared `@layer` order instead of relying on import sequence, (2) removes rules in `base.css`/`layout.css` that only re-state what Tailwind's preflight already does, and (3) converts two token files that currently hand-copy Tailwind's defaults into a single-sourced `@theme static` bridge, matching the pattern `layers/core` already uses correctly for its font tokens in `typography.css`.

**Tech Stack:** Tailwind CSS v4 (`@theme`, `@layer`, `@utility`, native cascade layers), Nuxt 4 layers, pnpm workspace, Vitest/Playwright already configured in-repo (no new test tooling).

**Spec:** This conversation's analysis (no separate spec doc exists). Reference points inspected directly in-repo:

- `layers/core/app/assets/css/core.css`
- `layers/core/app/assets/css/base.css`
- `layers/core/app/assets/css/layout.css`
- `layers/core/app/assets/css/tokens/breakpoints.css`
- `layers/design-system/theming/app/assets/css/tokens.css`
- `layers/design-system/theming/app/utils/themeAdapter.ts`
- `layers/design-system/typography/app/assets/css/typography.css` (existing correct pattern to copy)

## Global Constraints

- Never remove `@import 'tailwindcss'` or `@import '@nuxt/ui'` from `core.css` — both stay fully enabled, this is containment/ordering work, not a strip-down.
- Never touch `layers/design-system/theming/server/utils/accent-css.ts` or `themeAdapter.ts` — the runtime per-accent color system is a different mechanism (JS-computed `--ui-color-*` vars for switchable theming) and is out of scope.
- Every CSS change must be verified by building `layers/core/.playground` (`pnpm --filter core dev` or the layer's existing playground script) and visually diffing the rendered page — there is no visual-regression test harness in this repo, so manual check against the playground is the acceptance test for each task.
- Run `pnpm lint:css` (stylelint, per root `package.json`) after every task; it must pass before commit.
- One commit per task, following the repo's existing commit style (check `git log --oneline -10` in `nuxt-layers` before writing messages).

---

## File Structure

| File                                                     | Responsibility                           | Change                                                                      |
| -------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------- |
| `layers/core/app/assets/css/core.css`                    | Single Tailwind build root, import order | Add explicit `@layer` priority statement                                    |
| `layers/core/app/assets/css/base.css`                    | Vanilla element defaults                 | Remove rules preflight already covers                                       |
| `layers/core/app/assets/css/layout.css`                  | Vanilla table/hr/media defaults          | Remove rules preflight already covers                                       |
| `layers/core/app/assets/css/tokens/breakpoints.css`      | Breakpoint values                        | Convert to `@theme static` bridge, drop manual Tailwind-default duplication |
| `layers/design-system/theming/app/assets/css/tokens.css` | Radius/shadow/duration values            | Convert to `@theme static` bridge over new vanilla source vars              |

No new files needed — every change is inside an existing file's existing responsibility.

---

## Task 1: Explicit `@layer` priority order in `core.css`

**Files:**

- Modify: `layers/core/app/assets/css/core.css`
- Test: manual — `layers/core/.playground`

**Interfaces:**

- Consumes: nothing from other tasks (first task).
- Produces: a named layer order that Task 2 and Task 3 files continue to register into (`base`, `components`, `utilities` stay the layer names already used by Nuxt UI and Tailwind — this task does not rename them, it only makes their relative order explicit instead of implicit-via-import-sequence).

Currently `core.css` has no `@layer` order statement — the priority of `base` vs `components` vs `utilities` is established implicitly by Tailwind's own `@import 'tailwindcss'` internals, and where _your own_ `base.css`/`layout.css` land relative to `@nuxt/ui`'s rules depends entirely on import order (today: `@nuxt/ui` imported before `layout.css`/`base.css`, so on an equal-specificity conflict your own rules currently win — but only because of source order, which breaks silently if anyone reorders the imports later).

- [ ] **Step 1: Read current import order and confirm today's winner**

Run:

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers
sed -n '1,30p' layers/core/app/assets/css/core.css
```

Confirm the order is: `tailwindcss` → `@nuxt/ui` → `@config`/`@source` → `layout.css` → `base.css` → token files → `typography.css`. This is the baseline you are about to make explicit and layer-priority-driven instead of source-order-driven.

- [ ] **Step 2: Add the explicit `@layer` statement**

Edit `layers/core/app/assets/css/core.css` — insert immediately after the `@custom-variant dark (...)` line and before `@import 'tailwindcss'`:

```css
/* Explicit cascade-layer priority (low -> high). Tailwind's own
   `@import 'tailwindcss'` and `@nuxt/ui` register into `theme`/`base`/
   `components`/`utilities` — naming this order up front means any future
   re-ordering of the @import statements below this line can never change
   which layer wins. Vanilla element defaults (base.css/layout.css) are
   deliberately ranked ABOVE Nuxt UI's own base/components rules so project
   overrides always win regardless of import order. */
@layer theme, base, components, utilities;
```

- [ ] **Step 3: Verify the statement doesn't fight the existing named layers**

Run:

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers
grep -rn "@layer" layers/core/app/assets/css/*.css layers/*/*/app/assets/css/*.css 2>/dev/null
```

Confirm every `@layer base {}` / `@layer components {}` usage in the codebase uses exactly these four names (`theme`, `base`, `components`, `utilities`) — no stray layer name needs adding to the order list. If a layer name turns up that isn't in the list (e.g. a `@layer utilities` inside a design-system file using a different name), add it to the `@layer` statement in the position that matches its current effective priority.

- [ ] **Step 4: Build the playground and visually check**

Run:

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers/layers/core
pnpm dev
```

Open the playground in a browser. Compare against a screenshot taken before this change (or against `git stash` toggling). Confirm: body font/color, heading margins, link color, button chrome all render identically to before. No visual diff is expected — this task only makes an already-true ordering explicit.

- [ ] **Step 5: Lint and commit**

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers
pnpm lint:css
git add layers/core/app/assets/css/core.css
git commit -m "chore(core): declare explicit cascade-layer priority order

Layer priority between vanilla base.css/layout.css and Nuxt UI's own
base/components rules was implicit (import-order-dependent). Naming the
order up front makes it robust to future import reordering."
```

---

## Task 2: Remove base.css/layout.css rules that duplicate preflight

**Files:**

- Modify: `layers/core/app/assets/css/base.css`
- Modify: `layers/core/app/assets/css/layout.css`
- Test: manual — `layers/core/.playground`

**Interfaces:**

- Consumes: Task 1's explicit `@layer` order (so removed rules are known to be genuinely redundant, not silently relying on a specific import position that Task 1 might have changed).
- Produces: nothing new consumed by later tasks — this is a pure cleanup, and Task 3 is independent of it.

Tailwind's preflight (already active via the plain `@import 'tailwindcss'` — this is NOT being disabled) already sets: `box-sizing: border-box` on every element, `margin: 0` on `body`/`h1-h6`/`p`/`blockquote`/`figure`/`hr`/`dl`/`dd`, `list-style: none` + `margin: 0` + `padding: 0` on `ol`/`ul`/`menu`, `border-collapse: collapse` + `text-indent: 0` on `table`, and `display: block; vertical-align: middle` on `img`/`svg`/`video`/`canvas`. `base.css` and `layout.css` currently re-state several of these by hand.

- [ ] **Step 1: Diff base.css against preflight**

Run:

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers
cat layers/core/app/assets/css/base.css
```

Identify and delete these rules (they are fully covered by preflight, with identical values):

- `ol, ul { margin-top: 0; margin-bottom: 1rem; padding-left: 2rem; list-style: none; }` and the adjoining `ol ol, ul ul, ol ul, ul ol { margin-bottom: 0; }` — preflight already zeroes margin/padding and list-style on `ol/ul/menu`. **Do not delete silently** — if the project wants a `2rem` left indent for lists (preflight sets `padding: 0`, meaning bullets/numbers would currently be invisible-but-indented; after removing this rule, indentation goes to `0`), that indent needs to be re-added intentionally in a follow-up rule for content lists that opt back into visible list markers (out of scope for this task — flag it, don't silently drop the visual behavior). For this task: keep the rule as-is if it is currently relied on for indentation, and only remove `list-style: none` (which is the exact duplicate of preflight, no value or side-effect difference). Everything else in this rule (margin/padding) sets values preflight does NOT set the same way (preflight zeroes padding, this rule sets `padding-left: 2rem`), so it is not a true duplicate — leave it.
- `figure { margin: 0 0 1rem; }` — differs from preflight's `figure { margin: 0; }` (this rule adds a `1rem` bottom margin back). Not a duplicate — leave it.

Re-run the diff mentally against every rule in `base.css`: `body` (font-family/color differ from preflight, not a dup — keep), `h1-h6` (margin-top/bottom + font-weight/line-height, preflight only sets `margin: 0` unconditionally on headings — this rule adds `margin-bottom: 1rem` back, not a dup — keep), `small`/`b,strong`/`abbr[title]`/`address`/`blockquote`/`dt`/`dd`/`a`/`a:hover` — none of these match a preflight rule exactly; preflight's `a { color: inherit; text-decoration: inherit }` is a _different value_ from this file's `a { color: inherit; text-decoration: none }`, so it's a real override (Task 1's layer order + this file being declared after `@nuxt/ui`/preflight in source is what makes it win) — keep, do not touch.

**Net result of this step: no line deletions in `base.css`.** The audit shows every rule in this file sets a genuinely different value from preflight's equivalent (that's WHY it was written by hand) rather than blindly re-stating it — the only literal one-for-one duplicate found was `list-style: none` inside a rule that also sets non-duplicate `padding-left`/`margin` values. Leaving `list-style: none` in place is harmless (idempotent with preflight) and removing just that one declaration from a multi-declaration rule saves nothing meaningful. **Skip Step 1's edit — do not modify `base.css`.**

- [ ] **Step 2: Diff layout.css against preflight**

Run:

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers
cat layers/core/app/assets/css/layout.css
```

Compare rule by rule:

- `table { border-color: inherit; border-collapse: collapse; }` — preflight sets `table { text-indent: 0; border-color: inherit; border-collapse: collapse; }`. This is a **full duplicate** for both declared properties. Delete this rule from `layout.css`.
- `th { vertical-align: top; padding: 0; font-weight: bold; text-align: left; }` / `td { vertical-align: top; padding: 0; }` — preflight has no `th`/`td` rules at all. Not a duplicate — keep both.
- `hr { margin: 1rem 0; border: 0; border-top: 1px solid #ccc; height: 0; color: inherit; }` — preflight sets `hr { height: 0; color: inherit; border-top-width: 1px; }` (no color/style for the border, no margin). This rule's `height: 0` and `color: inherit` ARE exact duplicates; `margin: 1rem 0` and `border: 0; border-top: 1px solid #ccc;` are not (preflight leaves border-style/color un-set beyond width, so this rule's `#ccc` line color is the actual visible line — without it, preflight's `border-top-width: 1px` combined with `*,::before,::after{border-style:solid;border-color:currentcolor}` from preflight itself would already draw a solid `currentcolor` line at 1px, meaning this rule's `border: 0; border-top: 1px solid #ccc;` OVERRIDES that back to a specific gray instead of inheriting text color). Keep the rule, but remove the two literal duplicate declarations:

Edit `layers/core/app/assets/css/layout.css`, change:

```css
hr {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid #ccc;
  height: 0;
  color: inherit;
}
```

to:

```css
hr {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid #ccc;
}
```

(`height: 0` and `color: inherit` deleted — preflight already sets both identically.)

- `img, svg, canvas, video, picture { display: block; vertical-align: middle; max-width: 100%; }` — preflight sets `img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle; }` (no `picture`, no `max-width`) plus separately `img, video { max-width: 100%; height: auto; }` (no `svg`/`canvas`/`picture`). This rule's `display`/`vertical-align` for `img,svg,canvas,video` ARE duplicates; `picture` is not covered by preflight at all, and `max-width: 100%` for `svg`/`canvas`/`picture` is not covered either (preflight's `max-width`+`height:auto` only applies to `img,video`). Keep the rule as a single block (splitting it into "duplicate vs not" pieces is not worth the diff for one property that's harmless when repeated) — no change needed here since `picture` alone justifies keeping the full selector list together.

Delete the `table` rule entirely:

```css
table {
  border-color: inherit;
  border-collapse: collapse;
}
```

- [ ] **Step 3: Build the playground and visually check**

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers/layers/core
pnpm dev
```

Check any page rendering a `<table>` and an `<hr>` in the playground. Both must render identically to before (table border-collapse still collapsed via preflight; hr still shows the `#ccc` 1px line with `1rem 0` margin).

- [ ] **Step 4: Lint and commit**

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers
pnpm lint:css
git add layers/core/app/assets/css/layout.css
git commit -m "chore(core): remove layout.css rules already covered by preflight

table border-collapse/border-color and hr height/color were exact
duplicates of Tailwind preflight's own table/hr resets. base.css was
audited too — every rule there sets a value different from preflight's
equivalent, so it is left untouched."
```

---

## Task 3: Single-source radius/shadow/duration tokens via `@theme static`

**Files:**

- Modify: `layers/design-system/theming/app/assets/css/tokens.css`
- Test: manual — `layers/design-system/theming/.playground`

**Interfaces:**

- Consumes: nothing from Task 1/2 (independent file, independent layer namespace — `@theme` is not part of the `theme/base/components/utilities` cascade-layer order from Task 1, it is Tailwind's separate theme-variable mechanism).
- Produces: `--radius-token-*`, `--shadow-token-*`, `--duration-token-*` vanilla custom properties as the new source of truth, still exposed to Tailwind utilities under their existing unprefixed names (`--radius-*`, `--shadow-*`, `--duration-*`) so no consuming component or utility class changes.

Today `tokens.css` defines `--radius-*`/`--shadow-*`/`--duration-*` directly inside `@theme { ... }` — Tailwind's theme namespace IS the source of truth, there is no vanilla-CSS-only version of these values a non-Tailwind consumer (e.g. a plain `<style>` block, or a future non-Tailwind layer) could reference without depending on Tailwind's own generated variable names. This mirrors the gap already flagged in `breakpoints.css`'s own comment ("matches Tailwind's defaults" — a hand-kept-in-sync duplicate, not a bridge). This task converts radius/shadow/duration to the same static-bridge pattern the color system already uses correctly at runtime (`resolveUiColors`/`accent-css.ts` — that one stays untouched, it's dynamic; this task is for the genuinely static values only).

- [ ] **Step 1: Read the current file**

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers
cat layers/design-system/theming/app/assets/css/tokens.css
```

- [ ] **Step 2: Rewrite as vanilla source + static bridge**

Replace the full contents of `layers/design-system/theming/app/assets/css/tokens.css` with:

```css
/**
 * Radius/shadow/duration — vanilla custom properties are the source of
 * truth (:root block below); the @theme static block bridges them into
 * Tailwind's namespace so `rounded-md`, `shadow-lg`, etc. and any future
 * non-Tailwind consumer read the same values from one place. `static` is
 * required — Tailwind v4 tree-shakes @theme entries that no utility in
 * the scanned source actually uses; without it, an unused shade here
 * silently disappears from the theme namespace instead of just being
 * unused. Mirrors layers/core's colour bridge pattern in tw-test's
 * tailwind.css and the font-token pattern in
 * layers/design-system/typography/app/assets/css/typography.css.
 *
 * Colours are NOT here — they're already single-sourced dynamically via
 * accent-css.ts's per-accent --ui-color-* generation (runtime accent
 * switching), a different mechanism this file does not touch.
 */
:root {
  --radius-token-none: 0;
  --radius-token-sm: 0.25rem;
  --radius-token-md: 0.5rem;
  --radius-token-lg: 0.75rem;
  --radius-token-xl: 1rem;
  --radius-token-full: 9999px;

  --shadow-token-none: none;
  --shadow-token-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-token-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-token-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-token-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* --duration-token-base matches theme.css's .theme-transition value —
     not a new default, just giving the real value in use a named token. */
  --duration-token-fast: 150ms;
  --duration-token-base: 700ms;
  --duration-token-slow: 1000ms;
}

@theme static {
  --radius-none: var(--radius-token-none);
  --radius-sm: var(--radius-token-sm);
  --radius-md: var(--radius-token-md);
  --radius-lg: var(--radius-token-lg);
  --radius-xl: var(--radius-token-xl);
  --radius-full: var(--radius-token-full);

  --shadow-none: var(--shadow-token-none);
  --shadow-sm: var(--shadow-token-sm);
  --shadow-md: var(--shadow-token-md);
  --shadow-lg: var(--shadow-token-lg);
  --shadow-xl: var(--shadow-token-xl);

  --duration-fast: var(--duration-token-fast);
  --duration-base: var(--duration-token-base);
  --duration-slow: var(--duration-token-slow);
}
```

- [ ] **Step 3: Confirm `theme.css`'s hardcoded `700ms` still matches**

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers
grep -n "700ms" layers/design-system/theming/app/assets/css/theme.css
```

`.theme-transition`'s `transition-duration: 700ms` is a literal value, not a `var()` reference — it is not wired to `--duration-token-base` by this change (out of scope: that file wasn't asked about). Leave it as-is; the comment in `tokens.css` already documents that the two values are meant to match by convention, not by reference.

- [ ] **Step 4: Build the playground and visually check**

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers/layers/design-system/theming
pnpm dev
```

Check any element using `rounded-*`, `shadow-*` Tailwind utilities, or the theme picker's transition. All must render pixel-identical to before — this is a pure refactor of where the value is declared, no value changed.

- [ ] **Step 5: Lint and commit**

```bash
cd /Users/kieranmansfield/Developer/layers/nuxt-layers
pnpm lint:css
git add layers/design-system/theming/app/assets/css/tokens.css
git commit -m "refactor(theming): single-source radius/shadow/duration tokens

Values were declared directly inside @theme, making Tailwind's generated
variable names the only source of truth. Moved the values to plain
:root custom properties and bridged them into @theme static, matching
the pattern typography.css already uses for font tokens — any future
non-Tailwind consumer can now read --radius-token-md etc directly."
```

---

## Explicitly Out of Scope (raised in conversation, not part of this plan)

- **`breakpoints.css`'s manual sync with Tailwind's defaults** — flagged during Task 1 Step 3's audit as the same class of issue Task 3 fixes for radius/shadow/duration, but breakpoints feed Tailwind's _responsive variant_ generation (`sm:`, `md:`, etc.), which has additional constraints (must resolve before any `@source` content scan) not yet verified safe to convert — needs its own follow-up plan, not bundled here.
- **Spacing** — `layers/core`'s `--fluid-space-*` tokens (`spacing-fluid.css`) already live in a separate namespace from Tailwind's reserved `--spacing` var, exactly like tw-test's `--space-inline-*`/`--space-block-*`. No collision exists today; no change needed.
- **Accent color runtime system** — dynamic, JS-computed, intentionally different from the static bridge pattern. Do not convert.
