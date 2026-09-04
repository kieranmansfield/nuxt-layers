# Layer Taxonomy Redesign — Part 2: Tier 2 (Structure)

## Scope

Forensic audit of `layout`, `navigation`, `routing` — every real file read, every component/
composable/util traced to actual consumers via grep, decisions recorded below. Continues the
process established in `2026-08-30-layer-taxonomy-tier-0-1-design.md` (Tier 0/1). No
implementation yet — design-doc recording only, per the brainstorming skill's hard gate.

## Tier 0 loose end — resolved

`core/app/assets/css/base.css` and `layout.css` (misleadingly named — lives in `core`, not
`layout`) were never actually read during the Tier 0 pass despite the doc claiming Tier 0 fully
closed. Read now: both are plain, correct CSS resets (`base.css` = typography/element defaults
under `@layer base`; `layout.css` = table/hr/media defaults under `@layer components`). Nothing
layout-specific, nothing that belongs in the `layout` tier. Correctly homed in `core`. No action.
Tier 0 is now genuinely fully closed.

## Decisions

### `layout`: delete `GridPlacement.ts` (dead code)

`app/composables/GridPlacement.ts` (`useGridPlacement`) — its own docstring admits it: "Currently
not used - BaseGridItem inlines this logic for better reactivity. Kept for reference or future
use." Confirmed via grep: zero consumers anywhere in the repo. `Grid/Item.vue` has its own
equivalent, more complete implementation in `utils/gridPlacementStyle.ts` (which **is** the real,
consumed implementation). Delete `GridPlacement.ts`.

### `layout`: delete `Section/Title.vue` (`LayoutSectionTitle`) — exact duplicate of `LayoutPageHeader`

`Layout/Section/Title.vue`'s JSDoc header literally still reads "PageHeader - Standard page header
component... Used by PageContainer for visible page headers" — a copy-paste leftover from
`Layout/Page/Header.vue`. Confirmed via grep: `LayoutSectionTitle` has **zero** real consumers
anywhere in the repo; `LayoutPageHeader` is the real, consumed one (used by `LayoutPage`, two
playground pages, `StarterDesignSystem.vue`). Title.vue is also a strictly weaker variant — no
`back`-button variant, no `text-highlighted`/`text-muted` semantic color classes, wraps in
`LayoutGridItem` instead of being a plain block. Delete `Section/Title.vue`.

### `layout`: `app.config.ts` — same defect pattern as `theme`/`routing`, fix identically

`layout/app/app.config.ts` uses a bare `export default {...}` (no `defineAppConfig()` wrapper),
and its `declare module '@nuxt/schema'` augmentation lives in a separate file
(`app/types/app-config.d.ts`) instead of the same file — both violate
`.claude/rules/nuxt-layers.md`'s documented rule (file must live in `app/`, use
`defineAppConfig()`, one `declare module` block, same file). This is the **same defect** already
found and fixed for `theme` in Tier 1, and independently found in `routing` here (see below).
Fix all three consistently: wrap in `defineAppConfig()`, merge the `declare module` block into
`app.config.ts` itself, delete the now-redundant `types/app-config.d.ts` files.

### `routing`: `app.config.ts` — third instance of the same defect

`routing/app/app.config.ts` — bare `export default {...}` (no `defineAppConfig()`), augmentation
split into `app/types/app-config.d.ts`. Functionally fine defaults (`preset: 'simple'`, everything
off by default — sane), but same structural violation as `layout`/`theme`. Fold into the
consolidated fix above.

### New finding while fixing the above: `core`'s own `app.config.ts` had the same defect

Not previously flagged — `core/app/app.config.ts` was also a bare `export default {...}` with its
`declare module` augmentation split into `core/app/types/app-config.d.ts`. Fixed identically
(`defineAppConfig()`, merged augmentation, deleted the `.d.ts`) while doing this batch. Also
dropped the `scrollGuard` config block and its type, now dead after `useScrollGuard`'s deletion.

### `navigation`: `app.config.ts` — correct, no action

Uses `defineAppConfig()` + same-file `declare module` block correctly. This is the pattern the
other three layers should match. No changes needed.

### `navigation`: `useMastNav` didn't use the `createModal` factory it sits next to — fixed

`app/utils/createModal.ts` is a well-designed generic factory (`createModal(Component)` →
`{ open, close, patch }`, wraps `createSharedComposable` + `useOverlay`) — real and consumed by
the playground's demo modals (`useConfirmModal`, `useInfoModal`, `useFormModal`) and documented in
`visual/Base/Modal.vue`'s own JSDoc as _the_ pattern to use. `useMastNav` (`mastNav.ts`) hand-rolled
the identical `overlay.create()` pattern manually instead of calling `createModal()`, plus wrapped
`open`/`close` with `useSmoothScroll().lockScrolling()`/`unlockScrolling()`.

**Resolved**: extended `createModal(component, options)` with optional `onOpen`/`onClose` hooks
(run before open / after close), and refactored `useMastNav` to `createModal(MastNavModal, {
onOpen, onClose })` — same 4 lines of scroll-lock logic, zero duplicated overlay wiring. Already
implemented in this pass (`createModal.ts`, `mastNav.ts`).

### `navigation`/`routing`: `ResponsiveValue<T>` triplication — already-deliberate, no new action

Confirmed three separate `ResponsiveValue<T>` shapes exist: `core`'s canonical 5-key
(`default/sm/md/lg/xl`, documented as canonical for `core`+`ui`), `layout/types/layouts.ts`'s own
5-key copy (explicitly documented in `core`'s own type file as intentionally _not_ migrated —
"stays as-is, used by GridConfig/GridPresetsItem"), and `gridPlacementStyle.ts`'s private
3-key (`default/md/lg`, module-local, unexported, matches the Swiss Grid's own 3-tier column
system). All three are already-considered, deliberate divergences from prior sessions, not new
findings. No action — confirms Tier 0's summary was correct on this point.

### `starter` layer — not in `.claude/rules/nuxt-layers.md`'s layer table, extends the dissolved `ui`

Found while grepping component usage: `layers/starter` (`extends: ['../core', '../ui', '../layout',
'../motion']`) exists on disk but is undocumented in the layer table, and depends on `ui`, which
Tier 1 decided to dissolve entirely. Out of scope for this Tier 2 pass (not `layout`/`navigation`/
`routing`), but flagging now since the `ui` dissolution will break its `extends` — needs its own
audit pass (either fold into a later tier or handle alongside the `ui` dissolution work item).

## Confirmed correct, no action

- `layout`'s `Section/*` components (`Gallery`, `Grid`, `Hero`, `Sidebar`, `Split`, `Stack`) — all
  real, distinct, pre-configured grid patterns with no overlap. `layout/CLAUDE.md`'s component
  table is stale (missing `Grid.vue`, `Sidebar.vue`, `Stack.vue`, `Title.vue` from its listing) —
  minor doc-drift, worth a pass when this tier's action items are implemented, not blocking.
- `Grid/Item.vue` (`LayoutGridItem`) — real, well-built, single canonical grid-placement
  implementation (via `gridPlacementStyle.ts`), presets resolve correctly against
  `app.config.ts`'s `layoutLayer.ui.grid.presets`.
- `Grid/Debug.vue` — real, Cmd/Ctrl+G toggle, correctly reads `core`'s `BREAKPOINT_PX` tokens.
- `Page/Header.vue`, `Page/index.vue` (`LayoutPage`) — real, canonical, correctly documented
  (`LayoutPage` is a fragment, doesn't double up the grid root).
- `useGridConfig.ts` — real, clean, backwards-compat `enabled`→`mode` shim is intentional and
  documented.
- `navigation`'s `Mast/Header.vue`, `Footer.vue`, `Nav.vue`, `NavModal.vue` — all real, all
  consumed (verified via grep across playground + `starter`). `Header.vue` has a dead commented-out
  `<template #toggle><MastNav /></template>` block — harmless doc cruft, can be deleted opportunistically.
- `Links/Group.vue`, `Links/Named.vue` — real, consumed.
- `Site/Title.vue`, `Site/Subtitle.vue`, `useSite.ts`, `utils/site.ts`, `utils/regex.ts`
  (`splitSpaces`) — real, consumed chain (`useSite` → `resolveSiteConfig` → `splitSpaces`). Note:
  `navigation` has its own `regex.ts` distinct from `core`'s now-deleted one — this one has a real
  consumer, correctly kept.
- `useAppToast` (`toast.ts`) — real, thin wrapper over `useToast()`.
- `routing`'s entire composable/middleware/plugin/server chain (`useRoutingConfig`,
  `useFeatureFlags`, `useMaintenance`, `resolveRoute`, both global middleware, both plugins, the
  `feature-flags` API route) — genuinely well-built, self-consistent governance system. Presets
  (`simple`/`marketing`/`product`/`enterprise`) are real and sane. No dead code found.
- `routing/app/middleware/02.governance.global.ts`'s `console.log` debug lines are gated behind
  `config.debug` (default `false`) — not a leftover, intentional.
- `scroll-routing.client.ts`'s `fallow-ignore-next-line code-duplication` suppression — flags a
  real near-duplicate of an `IntersectionObserver` pattern elsewhere (likely `scroll`/`motion`
  tier). Out of scope for Tier 2; carry forward to the Tier 5 (Motion) pass.

## Consolidated action list (Tier 2)

- [x] Delete `layout/app/composables/GridPlacement.ts` (dead, self-admitted unused)
- [x] Delete `layout/app/components/Layout/Section/Title.vue` (`LayoutSectionTitle`) — zero
      consumers, exact-duplicate copy-paste of `LayoutPageHeader`
- [x] Fix `app.config.ts` structural defect in `layout` and `routing` (join `theme`/`core` from
      Tier 0/1 — same 4th and 5th instance): wrapped in `defineAppConfig()`, merged
      `declare module '@nuxt/schema'` into the same file, deleted the redundant
      `app/types/app-config.d.ts` in each. `theme`'s own fix is still pending (Tier 1 item).
- [x] `useMastNav` refactored onto `createModal` with new `onOpen`/`onClose` hooks (implemented)
- [x] Delete dead commented-out `<template #toggle><MastNav /></template>` block in
      `navigation/Mast/Header.vue`
- [x] Update `layout/CLAUDE.md`'s component table to list `Grid.vue`, `Sidebar.vue`, `Stack.vue`
      (post `Title.vue` deletion, dropped from the listing)
- [ ] Separately audit `layers/starter` — extends the dissolved `ui` layer, needs its own decision
      once `ui`'s dissolution is implemented

## Not yet covered

Tiers 3 (Content), 4 (Data), 5 (Motion), 6 (Render), 7 (Delivery), and the Tier sub-layer/toggle
mechanism design are separate passes.
