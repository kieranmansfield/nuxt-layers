# Grid Layer

Font-size-derived vertical rhythm + data-driven column composition for Nuxt 4 applications.
Named presets (`swiss`, `editorial`) or custom `TrackSegment[]` arrays resolve to
`grid-template-columns` strings via `useGridTracks()`. See
`docs/superpowers/specs/2026-09-04-grid-layer-design.md` for the full design.

## Layer Structure

```
layers/structure/grid/
├── app/
│   ├── assets/css/grid.css        # .grid-tracks rhythm custom properties
│   ├── composables/useGridTracks.ts  # resolve() + toColumnsCss()
│   ├── types/tracks.ts            # TrackSegment, TrackConfig, GridPreset
│   ├── utils/placement.ts         # placementFromLines, placementFromIndex
│   └── app.config.ts              # gridLayer.presets registry
├── nuxt.config.ts
└── package.json
```

## Quick Reference

```ts
const { resolve, toColumnsCss } = useGridTracks()

const config = resolve('swiss')          // named preset from app.config
const custom = resolve({ columns: [{ size: 1 }, { size: 2 }] })  // passthrough

const css = toColumnsCss(config)
// → 'minmax(var(--measure-min), 1fr) minmax(var(--measure-min), 1fr) ...'
```

```ts
import { placementFromIndex, placementFromLines } from '#layers/grid/app/utils/placement'

placementFromLines('feature-start', 'aside-end')  // → 'feature-start / aside-end'
placementFromIndex(2, 3)                          // → '2 / span 3'
placementFromIndex(2, 'full')                     // → '2 / -1'
```

## Out of scope (this layer, this phase)

- No `LayoutGridItem`-equivalent component — that's `layout`'s territory, deferred.
- No row-track presets beyond the rhythm-derived floor.
- No Bento-grid preset.
- `layers/structure/layout/**` is untouched — reworking it to consume this layer is a future pass.
- No automatic viewport-based column degradation — explicit track lists render at their configured sizes and scroll horizontally (`.grid-tracks` has `overflow-x: auto`) rather than dropping columns; pick a preset/`minTrackWidth` sized for your target viewport.
