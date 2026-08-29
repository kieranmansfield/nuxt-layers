# Nuxt Declarative Layout & Design System Layer

## Implementation Specification (unified)

This document merges the original layout-primitives proposal and the follow-up type-vocabulary
proposal into one spec, reconciled against the decisions already locked in
`.claude/plans/1-they-won-t-collide-shimmying-valley.md` (approved the same day, before this
merge). Where the two source documents disagreed with that plan, the plan wins — it reflects
actual repo research (existing `ResponsiveValue` shapes, `layers/layout`'s current 100%
CSS-Grid implementation, `layers/ui`'s orchestrator role), not a fresh proposal. Sections below
call out where this reconciliation changed something from either original doc.

## 1. Purpose

Build a small, declarative layout and composition vocabulary for Nuxt applications, backed by
centrally normalized design tokens, sitting on top of Nuxt UI.

The system is **not**:

- a Tailwind CSS replacement
- a utility-class framework
- a generic `<div>` wrapper with every CSS property exposed as a prop
- a replacement for Nuxt UI
- a second interactive component library
- a new layer — the layout/type vocabulary lives in the layers that already occupy this
  architectural slot (`core`, `ui`), not a new `declarative-ui` package

The system **is**:

> A constrained, declarative layout language for Nuxt applications, backed by centrally
> normalized tokens (fluid CSS custom properties first, TypeScript vocabulary second), and
> designed to sit on top of Nuxt UI.

Goals:

1. Remove repetitive utility-class "class soup" from application templates.
2. Make layout structure obvious from component composition.
3. Use a small, consistent vocabulary — both in components and in the types behind them.
4. Restrict arbitrary values to encourage visual consistency.
5. Support responsive behaviour without repeated breakpoint utility classes, and prefer
   continuous (fluid) scaling over discrete breakpoints wherever the property is continuous.
6. Keep design decisions centrally configurable, with one canonical source per token category.
7. Work cleanly inside the existing Nuxt Layers architecture — reuse `core` and `ui`, don't
   invent a new layer.
8. Use Nuxt UI for interactive components and accessibility behaviour rather than rebuilding
   those concerns.

---

## 2. Architectural Position

```text
Application
    |
    v
Layout primitives (layers/ui)         Shared tokens + attributes (layers/core)
    |                                       |
    +-- HStack / VStack / ZStack / Spacer   +-- ResponsiveValue<T>
    +-- Container                           +-- useLayoutAttrs()
    |                                       +-- breakpoints.css / spacing-fluid.css
    v                                       |
Nuxt UI  <---------------------------------+
    |
    +-- Interactive components
    +-- Component variants
    +-- Semantic colours
    +-- Accessibility
    |
    v
Reka UI / Vue
    |
    v
HTML / CSS
```

### Responsibilities

#### `layers/core` owns

- `ResponsiveValue<T>` (the one canonical type — see §13)
- `useLayoutAttrs()` — shared gap/align/justify/padding resolution (see §12)
- `breakpoints.css`, `spacing-fluid.css` — the CSS custom properties every layer reads
- CSS-vocabulary types (Display, Position, Overflow, etc. — see §16) as reference vocabulary

#### `layers/ui` owns

- `HStack`, `VStack`, `ZStack`, `Spacer`, `Container` — new, root-level, unprefixed components
- composition of `typography`, `navigation`, `visual` (unchanged, existing role)

#### `layers/layout` owns (unchanged this pass — see §20)

- the Swiss Grid System: `LayoutMain`, `LayoutSection` and its variants, `LayoutGridItem`,
  `LayoutGridDebug`, `useGridConfig()`
- its own existing `GridConfig`/`GridPresetsItem`/`ResponsiveValue` types, untouched

#### Nuxt UI owns

- buttons, form controls, dialogs, popovers, menus, overlays
- component interaction, focus management, keyboard behaviour, accessibility primitives
- semantic colour system, component variant infrastructure

Do not unnecessarily wrap or duplicate Nuxt UI components. Application usage stays:

```vue
<UButton />
<UCard />
<UInput />
<UModal />
```

---

## 3. Core Principles

### 3.1 Composition over configuration

```vue
<Container size="wide">
  <VStack gap="lg">
    <Header />
    <Grid columns="1 2 3" gap="md">
      <UCard v-for="c in items" :key="c.id" />
    </Grid>
  </VStack>
</Container>
```

`Grid` above is illustrative of the eventual mental model — it is **explicitly deferred**, see
§20. The structure of the template should communicate the structure of the interface.

### 3.2 Explicit layout primitives

Use `HStack` / `VStack` / `ZStack`, not a generic `Stack` with a `direction` prop. The component
name should communicate the fundamental layout model.

### 3.3 Constrained vocabulary

`<VStack gap="md" />`, not `<VStack gap="4" />`. Named tokens (`xs`/`sm`/`md`/`lg`/`xl`), with
underlying values centrally configurable — see §14.

### 3.4 Familiar vocabulary

Where useful, borrow Tailwind's naming (`gap`, `align`, `justify`, `wrap`, `p`/`px`/`py`, `w`,
`h`, `rounded`, `shadow`, `bg`, `text`). Familiarity doesn't mean the implementation compiles to
Tailwind classes — native CSS/CSS variables are fine and preferred (§3.5).

### 3.5 CSS-first implementation

Prefer CSS Grid, Flexbox, CSS custom properties, container queries, native responsive CSS.
Avoid runtime JS layout calculation. **Fluid-first**: a continuous property should resolve to a
`clamp()` token by default, with zero breakpoint knowledge required from the app author — see
§15.

---

## 4. Three Type Categories (from the type-vocabulary doc, reconciled)

Every exported type in this vocabulary falls into exactly one category. This replaces the
original types doc's `defineDesignSystem()`-derivation mechanism for **this pass** — see the
"What changed" callout at the end of this section for why.

### 4.1 Design-system tokens

Constrained choices: `Spacing`, `Radius`, `Shadow`, `Breakpoint`, `ContainerSize`. For this pass
these remain **hand-written unions**, sourced from and kept in sync with the CSS custom
properties in `breakpoints.css`/`spacing-fluid.css` (§14–15) — not derived from a TypeScript
config object. Example, matching the repo's real container vocabulary
(`layers/layout/app/types/layouts.ts`'s `GridContainerSize`, which this becomes an alias of
once `Container` moves — see §20):

```ts
export type ContainerSize = 'content' | 'wide' | 'fluid' | 'full'
export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
```

### 4.2 CSS vocabulary

Hand-written unions mirroring constrained native CSS keyword sets: `Display`, `Position`,
`Overflow`, `Visibility`, `TextAlign`, `ObjectFit`, `Cursor`, `UserSelect`. A type existing here
does **not** imply any component exposes it as a prop — exposing it is a separate, deliberate
decision made per component.

```ts
export type Display = 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'
export type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
export type Overflow = 'visible' | 'hidden' | 'clip' | 'auto' | 'scroll'
export type TextAlign = 'start' | 'center' | 'end' | 'justify'
export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
```

These are stable and exhaustive. Do not add one speculatively — only when a concrete component
in this spec will consume it.

### 4.3 Semantic design types

Meaning, not raw CSS: `BackgroundColor`, `TextColor`, `BorderColor`, `Alignment`,
`Justification`, `Placement`. **Explicitly out of scope for this pass** — see §21 (Phase 2).
Nothing in `layers/theme` or `layers/ui` defines these today, and defining them well requires
the Nuxt UI Unstyled + token-adapter work that is deliberately sequenced after this pass. Do not
invent a parallel semantic-colour system ahead of that work.

### What changed from the original types doc, and why

The original `nuxt-design-system-types.md` proposed `defineDesignSystem(config)` +
`DesignSystemToken<K> = keyof typeof designSystem[K]` as the single source of truth, so that
adding a token to config automatically updates the type. That's a good idea, but it's **Phase 2
work** (§21): it only pays off once there's an actual `designSystem`/`tokens.ts` object feeding
both CSS variables and a Nuxt UI theme adapter, which doesn't exist yet. Introducing it now would
mean deriving types from a config object that has no other consumer, while the real token source
of truth for this pass is CSS (`spacing-fluid.css`, `breakpoints.css`). Hand-written unions here
are a deliberate, temporary trade — kept in sync by convention until Phase 2 replaces them with
derived types from one real config.

---

## 5. Initial Primitive API

```text
HStack
VStack
ZStack
Spacer
Container
```

`Grid` and `Section` are **not** in this pass's scope — see §20. Use existing `<USeparator />`
rather than a new `Divider`.

---

## 6. HStack

Horizontal, one-dimensional layout, Flexbox row.

```vue
<HStack gap="md" align="center" justify="between" wrap>
  <Logo />
  <Navigation />
</HStack>
```

```ts
interface HStackProps {
  gap?: ResponsiveValue<Spacing>
  align?: ResponsiveValue<'start' | 'center' | 'end' | 'stretch' | 'baseline'>
  justify?: ResponsiveValue<'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'>
  wrap?: boolean
}
```

`wrap` is a structural boolean, not itself responsive in the MVP — see §15 for why structural
props are the one place `ResponsiveValue` objects are actually needed, and `wrap` isn't one of
them yet (add `ResponsiveValue<boolean>` only if a real use case needs it).

---

## 7. VStack

Vertical, one-dimensional layout, Flexbox column.

```vue
<VStack gap="lg" align="center" justify="between">
  <Heading />
  <Text />
</VStack>
```

```ts
interface VStackProps {
  gap?: ResponsiveValue<Spacing>
  align?: ResponsiveValue<'start' | 'center' | 'end' | 'stretch'>
  justify?: ResponsiveValue<'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'>
}
```

---

## 8. ZStack

Layered content. `position: relative` wrapper; children `position: absolute; inset: 0` unless a
child opts out. Do not expose raw `position` as the primary public abstraction — the component
should communicate "these are intentionally layered."

```vue
<ZStack>
  <img src="/hero.jpg" alt="" />
  <div class="overlay" />
  <VStack align="center" justify="center">
    <h1>Heading</h1>
  </VStack>
</ZStack>
```

Placement vocabulary starts constrained (`start` / `center` / `end`); do not over-engineer the
full 9-point grid in the first pass.

---

## 9. Spacer

`flex: 1 1 auto` (or `1 0 0` cross-axis). Single-purpose. No arbitrary size props initially —
only an optional fixed `size` if a concrete need arises.

```vue
<HStack>
  <Logo />
  <Spacer />
  <Navigation />
</HStack>
```

---

## 10. Container

Width-constraint wrapper. **Migrates from `layers/layout` to `layers/ui`** this pass (see §20)
— same API, same values, no visual change.

```vue
<Container size="wide">
  ...
</Container>
```

```ts
interface ContainerProps {
  size?: ContainerSize // 'content' | 'wide' | 'fluid' | 'full' — matches existing GridContainerSize values
}
```

`layers/layout/app/components/Layout/Container.vue` becomes a thin back-compat wrapper around
the new `ui` component so existing `<LayoutContainer>` call sites keep working. Both `layout`
and `ui` read the shared `Container` implementation from `layers/core` (avoids a new
cross-layer dependency and keeps it next to the shared tokens) — see §20 for the exact
placement decision and why.

---

## 11. Section — deferred, unchanged

`Section` (and all `Section/*` variants) stay in `layers/layout` untouched this pass. It's a
genuine subgrid participant in the existing Swiss Grid System, used across the playground and
`layers/content` — moving or redesigning it is explicitly parked for a dedicated grid/flex
redesign session (§20).

---

## 12. Shared Attribute System

Rather than each of `HStack`/`VStack`/`ZStack` independently reimplementing gap/align/justify
resolution, add one shared composable both consume:

```text
layers/core/app/composables/useLayoutAttrs.ts
```

It resolves `gap`, `align`, `justify`, `p`/`px`/`py` props (each a `ResponsiveValue<Token>`)
into a `CSSProperties` object, reading the fluid/breakpoint tokens from §14–15. Mirror the
existing orchestrator pattern in `layers/visual/app/composables/gradient.ts` — resolve preset →
merge override → build style → return. This composable is also the seam other existing
components (`Section/*`, `GridItem`) can adopt incrementally later; it is not a one-off baked
into each Stack component.

---

## 13. `ResponsiveValue<T>` — canonical shape

**This is the one place the original layout spec and types doc most directly conflicted with
the repo, and the reconciliation is a hard rule, not a preference:**

```ts
// layers/core/app/types/responsive.ts
export type ResponsiveValue<T> = {
  default: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}
```

- **Object shape only. No array shorthand** (`T[]` is rejected). The codebase already models
  responsive values as objects in two slightly inconsistent shapes
  (`layers/layout/app/types/layouts.ts`, `utils/gridPlacementStyle.ts`); positional
  array-to-breakpoint mapping is not an existing convention here and would be a second, implicit
  system to learn. The object form is self-documenting.
- Static value stays the common case: `gap="md"` is a `ResponsiveValue<T>` with only `default`
  set — the component API accepts a bare token and normalizes it internally.
- This is the **new canonical export**. `layers/layout`'s existing `ResponsiveValue` (used by
  `GridConfig`/`GridPresetsItem`) is left as-is — different export, not migrated this pass, no
  regression risk on shipped Grid code. Do not let any barrel file (`layers/layout/app/types/index.ts`)
  wildcard-re-export both into one namespace.

```vue
<VStack gap="md" />
<VStack :gap="{ default: 'sm', lg: 'md' }" />
```

---

## 14. Design Tokens — CSS-first for this pass

All system values are centrally normalized, but the *mechanism* for this pass is CSS custom
properties, not a TypeScript config object (see §4's "what changed" callout).

```text
layers/core/app/assets/css/tokens/
├── breakpoints.css       # single source of truth for breakpoint px/rem values
└── spacing-fluid.css     # clamp()-based fluid spacing scale, --fluid-space-xs … --fluid-space-3xl
```

`spacing-fluid.css` follows the same `clamp()` + container-query (`cqi`) variant pattern already
established in `layers/typography/app/assets/css/typography.css`'s fluid type scale — reuse
that pattern, don't invent a new one.

Existing duplicated breakpoint values get normalized to point at this source **as values only,
not logic**:

- `layers/layout/app/assets/css/layout/grids.css` (media queries)
- `layers/layout/app/components/Layout/Grid/Item.vue` (`<style>` block)
- `layers/layout/app/components/Layout/Grid/Debug.vue` (`matchMedia` calls — read via
  `getComputedStyle` or a small exported constant, not re-hardcoded)
- `layers/visual/app/types/breakpoints.ts` (`BREAKPOINT_VALUES`, `DEVICE_BREAKPOINT_VALUES`)

This also fixes a latent bug: the grid's `lg` (80rem) currently silently diverges from
Tailwind's default `lg` (64rem) because the value is hand-duplicated. None of this changes
column math, subgrid placement, or the Section `Grid`'s `auto-fit` logic — see §20.

---

## 15. Fluid-First Strategy: Continuous vs Structural

This directly answers the original docs' open question ("can breakpoints be eliminated?").

- **Continuous** (gap, padding, container max-width): default to the fluid `clamp()` scale.
  `gap="md"` resolves to `--fluid-space-md`, scaling continuously with viewport (or container,
  via the `cqi` variant, when nested inside a sized container like a card) width. **No
  breakpoint object needed** for the common case.
- **Structural** (direction flip, wrap behaviour): genuine step-changes; `clamp()` doesn't
  apply. These are the only props where the discrete `ResponsiveValue<T>` object (§13) is
  actually needed — an escape hatch, not the default authoring path.

Net effect: `gap`/`align`/`justify`/`p` need zero breakpoint knowledge from the app author.
Breakpoints only re-enter for genuine structural changes at a size threshold.

---

## 16. CSS Vocabulary Types — reference only

See §4.2. These exist as typed vocabulary for future component authors; their existence does
not obligate any current primitive to expose them as props. Do not add to this list
speculatively — add only when a concrete prop needs it.

---

## 17. Nuxt UI Integration

- **Nuxt UI stays the component foundation, not something replaced.** No `<MyButton>`/`<MyCard>`
  wrappers — use `<UButton>`/`<UCard>` directly. The new primitives are layout-only; they
  compose around Nuxt UI components, never wrap them.
- **Don't modify Nuxt UI's public prop API.** `useLayoutAttrs()` is a resolver our own
  primitives call — it is not injected into `UButton`/`UCard`'s prop set. Apply spacing by
  wrapping (`<HStack p="lg"><UButton /></HStack>`), not by teaching `UCard` a new `p` prop.
- **Component semantics vs. layout stay conceptually separate**, even reading the same token
  source: `<UButton size="lg" variant="solid">` is Nuxt UI's job; `<VStack gap="lg">` is ours.
- `layers/ui` already occupies the "design system" position in the dependency graph
  (`ui → typography, navigation, visual → core → @nuxt/ui`) — no new layer needed.

```vue
<Container size="lg">
  <VStack gap="lg">
    <VStack gap="sm">
      <h1>Projects</h1>
      <p>Things I have been working on.</p>
    </VStack>
    <HStack gap="sm" align="center" justify="between">
      <UButton size="sm">View project</UButton>
      <UBadge>{{ project.status }}</UBadge>
    </HStack>
  </VStack>
</Container>
```

---

## 18. What Is Explicitly Out of Scope (this pass)

- `ViewThatFits`, `AlignmentGuide`, `Frame`, `Label`, `Material`/`Surface` components — parked,
  no change from the original docs' reasoning.
- Do not introduce separate `Material`/`Surface` public components for background levels; prefer
  Nuxt UI's semantic background vocabulary once it's brought in (§21).
- A new semantic colour system ahead of Nuxt UI Unstyled adoption (§4.3, §21).
- `defineDesignSystem()`/config-derived types (§4, deferred to §21).

---

## 19. Recommended Layer Structure (corrected)

No new layer. Additions land in existing layers:

```text
layers/core/app/
├── composables/
│   └── useLayoutAttrs.ts
├── types/
│   └── responsive.ts
└── assets/css/tokens/
    ├── breakpoints.css
    └── spacing-fluid.css

layers/ui/app/components/        # root-level, unprefixed — no subfolder (avoids name-prefixing)
├── HStack.vue
├── VStack.vue
├── ZStack.vue
├── Spacer.vue
└── Container.vue

layers/layout/app/components/Layout/
└── Container.vue                # back-compat shim, re-renders ui's <Container>
```

---

## 20. Scope Decisions Locked This Pass

1. **Move `Container`** from `layers/layout` to `layers/ui`, with a thin back-compat wrapper
   left in `layout` so `<LayoutContainer>` keeps working (light usage — one playground demo
   page). Shared implementation lives in `layers/core` so neither `layout` nor `ui` needs a new
   cross-layer dependency, and it sits next to the shared tokens it depends on.
2. **Grid/flex structural redesign is explicitly parked.** No new `Grid` primitive, no touching
   `Grid/Item.vue` or `Section/Grid.vue`'s placement/auto-fit logic. `layers/layout` is
   currently 100% CSS Grid/subgrid with zero Flexbox — that's being deliberately left in place,
   not migrated, in this pass.
3. **`Section` stays in `layout`** — it's structurally part of the grid engine being deferred,
   not a decoupled primitive like `Container` was.
4. Token *values* those systems read from are normalized now (§14); the placement *logic* is
   untouched.

---

## 21. Phase 2 (separate initiative, not started this pass): Nuxt UI Unstyled + Token-Derived Types

The original two documents both pointed toward switching Nuxt UI to its **unstyled theme** and
rebuilding variants from project tokens, plus deriving TypeScript types from one config object
(`defineDesignSystem`). Both are real and worth doing, but materially larger and riskier than
this pass, and depend on this pass's token-normalization foundation landing first.

- **Mechanics:** `ui: { theme: { unstyled: true } }` in `nuxt.config.ts`, global-only, 4.9+
  (installed version resolves to `4.11.0` after the dependency-maintenance bump already done
  this session — no additional bump needed). It strips **structural** classes too (positioning,
  flex/grid, transitions), not just cosmetic ones — `Modal`/`Drawer`/`Calendar` lose working
  layout, not just theme, until re-supplied.
- **Current state:** `@nuxt/ui` loads at `layers/core/nuxt.config.ts:16` with no `unstyled`
  config — full default theme active everywhere. `layers/layout/app/app.config.ts:15-19`
  already carries live overrides against the *default* (styled) theme; other layers likely do
  too (not yet fully audited).
- **Blast radius:** flipping the flag immediately strips styling from every Nuxt UI component,
  every layer, every page — `apps/playground`, `layers/content`'s Gallery/Portfolio, everything
  — until variants are rebuilt. The flag has no per-component staging, so the full
  variant/theme-adapter rebuild must be ready *before* the flip, not staged after.
- **Scope this phase actually covers:** the full token set the original docs described —
  colours, radii, shadows, typography scale, motion — assembled into one `designSystem`/
  `tokens.ts` source of truth (`layers/core` or `layers/theme`, which currently only holds
  accessibility/motion state and has room). That config then feeds three consumers: our
  primitives (already built this pass), a new Nuxt UI "theme adapter" (translates tokens into
  Nuxt UI's theme/variant format, replacing `layers/layout/app/app.config.ts`'s ad hoc `ui.*`
  overrides), and raw CSS custom properties for hand-written CSS.
- **This is also where `defineDesignSystem()`/`DesignSystemToken<K>` (§4) and the semantic
  colour types (`BackgroundColor`/`TextColor`/`BorderColor`, §4.3) get implemented for real** —
  once there's an actual config object with a real consumer (the theme adapter) to derive
  from, instead of a `keyof typeof` exercise with no downstream use yet.
- **Sequencing:** after this pass ships and is verified — it depends on the same
  token-normalization foundation (breakpoints, spacing, and the extended colour/radius/shadow
  tokens) being in one place first. This pass's token work
  (`core/app/types/responsive.ts`, `core/app/assets/css/tokens/*`) is deliberately structured
  to be extended by Phase 2, not superseded by it.

---

## 22. Escape Hatch

Common things should be easy and constrained; uncommon things should still be possible via
normal CSS. Do not expose every CSS property through component props.

---

## 23. Testing Requirements

### Responsive values

- static value, explicit breakpoint object, missing values, precedence
- reject array shorthand at the type level (`// @ts-expect-error` on `gap={['sm','md']}`)
- reject an invalid token string (`// @ts-expect-error`)

### Layout

- nested HStack/VStack combinations
- Spacer inside HStack and VStack
- ZStack intrinsic sizing
- Container width tokens, and the `LayoutContainer` back-compat shim rendering identically to
  before the migration

### Token migration regression

- `Grid/Debug.vue`'s column-count switch (6/12/18) fires at identical viewport widths after
  breakpoint values move to `core` — confirms `matchMedia` calls reading the shared token
  resolve to the same px values, zero behavioural change to the existing Swiss grid.

### SSR

No hydration mismatch or viewport-dependent SSR issue introduced by the responsive/fluid system.

### Accessibility

No unnecessary ARIA added merely because a layout component exists.

Use the project's existing type-testing setup if present (check for `tsd` or vitest's
`expectTypeOf`/`assertType` before adding a new dependency) for the type-level assertions above.

---

## 24. Implementation Phases

### Phase 0 (prerequisite, already completed this session)

Dependency maintenance bump (`@nuxt/ui` → 4.11.0, `nuxt` → 4.5.2, patch-level bumps) — required
before Phase 2's Unstyled work, harmless prerequisite for this pass too.

### Phase 1: Shared tokens and attribute resolver

`layers/core/app/types/responsive.ts`, `layers/core/app/assets/css/tokens/{breakpoints,spacing-fluid}.css`,
`layers/core/app/composables/useLayoutAttrs.ts`.

### Phase 2: Layout primitives

`HStack`, `VStack`, `ZStack`, `Spacer`, `Container` in `layers/ui/app/components/`. Container
migration + back-compat shim in `layers/layout`.

### Phase 3: Token migration (values only)

Repoint `grids.css`, `Grid/Item.vue`, `Grid/Debug.vue`, `layers/visual/app/types/breakpoints.ts`
at the new `core` breakpoint tokens. No placement-logic changes.

### Phase 4: Verification

Run the checks in §23 plus:

1. `PLAYGROUND_LAYERS=core,ui pnpm dev` — confirm unprefixed auto-import names.
2. `apps/playground/app/pages/layout.vue` — visual diff of `<LayoutContainer>` before/after shim.
3. `pnpm typecheck` — confirm the new `core` `ResponsiveValue<T>` doesn't collide with
   `layers/layout`'s existing one (different export; check no barrel wildcard-merges them).
4. `pnpm lint` across `layers/ui`, `layers/core`, `layers/layout`, `layers/visual`.
5. Manual: build the §17 project-card example on a playground page, resize the browser, confirm
   continuous fluid scaling with no breakpoint "jump."

### Phase 5 (later, separate effort): Nuxt UI Unstyled + token-derived types

See §21. Not started, not scoped to files yet, deliberately sequenced after Phase 4 ships.

---

## 25. Success Criteria

1. Common page layouts expressible without repetitive flex/grid utility classes.
2. Public API stays small; developers never need to remember arbitrary numeric scales.
3. `ResponsiveValue<T>` has exactly one canonical new definition (`layers/core`), coexisting
   safely with `layers/layout`'s pre-existing one — no silent collision.
4. Continuous properties (gap, padding, container width) require zero breakpoint knowledge from
   app authors; breakpoints only appear for genuine structural changes.
5. Nuxt UI remains the source of truth for interactive components and semantic colour, now and
   through Phase 2.
6. CSS remains available as an escape hatch.
7. The existing Swiss Grid System (`layers/layout`) is untouched in placement logic; only its
   duplicated token *values* are normalized.
8. No hand-written union exists for a token that Phase 2's `designSystem` config will
   eventually own — but Phase 2 is not blocked on, or conflated with, this pass.
9. `Container`'s migration is invisible to existing call sites (`<LayoutContainer>` still works).

---

## 26. Final Mental Model

```text
Need horizontal layout?      -> HStack
Need vertical layout?        -> VStack
Need layered content?        -> ZStack
Need flexible remaining space? -> Spacer
Need constrained page width? -> Container
Need page-level rhythm / subgrid section? -> Section (existing, layers/layout, unchanged)
Need rows and columns?       -> Grid (existing Swiss system only — new primitive deferred)
Need an interactive component? -> Nuxt UI
Need consistent spacing?     -> gap="md" (fluid clamp() by default)
Need a genuine breakpoint change? -> :gap="{ default: 'sm', lg: 'md' }"
Need unusual behaviour?      -> CSS
Need a config-derived token type? -> Phase 2, not yet
```

---

## 27. Guiding Statement

> Build a small declarative layout language for Nuxt applications, landing in the layers that
> already own this responsibility (`core` for tokens/attributes, `ui` for primitives). Use one
> canonical `ResponsiveValue<T>` object shape — no array shorthand. Prefer fluid CSS tokens for
> continuous scaling; reach for discrete responsive values only for structural step-changes. Let
> Nuxt UI handle interactive components, accessibility, and — eventually, in Phase 2 — the
> semantic colour and config-derived type system. Do not expand the API simply because CSS has a
> property for something, and do not build Phase 2's token-derivation machinery before Phase 2
> has a real consumer for it.
