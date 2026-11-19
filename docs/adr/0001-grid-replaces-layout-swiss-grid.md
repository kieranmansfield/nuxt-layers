# 0001 — `grid` replaces `layout`'s Swiss grid; don't merge them piecemeal

Status: accepted (2026-10-20)

## Context

Tier 2 has two grid systems:

- `layout` — fixed 6/12/18 columns by breakpoint (`LayoutGridItem`, `useGridConfig`,
  `layoutLayer.ui.grid`). Seven `content` components and `Hero`/`Split`/`Gallery` assume 18
  numbered columns.
- `grid` — data-driven tracks (`useGridTracks`), named presets, rhythm derived from `--fs`,
  named-line placement. No layer consumes it yet; only two playground pages do.

`docs/superpowers/specs/2026-09-04-grid-layer-design.md` created `grid` as the replacement and
put `layout`'s grid components out of scope, deferring their migration.

## Decision

Treat the overlap as an in-flight migration, not accidental duplication. Do not fold either
system into the other, share a preset registry, or rename config namespaces in isolation.
Migrating `layout` to consume `grid` is its own brainstormed pass, covering `LayoutGridItem`,
the `content` components, and the 18-column assumptions.

## Consequences

- `layoutLayer.ui.grid` (including the z-index `layers` that `navigation` reads through
  `useGridConfig().useZIndex`) is consumer-facing app config and stays as is until that pass.
- Architecture reviews should not re-suggest merging `layout` and `grid` or picking a single
  "owner" for the `swiss` preset.
