# Fallow Complexity and Duplication Audit

This file is the entry point for the layer-by-layer Fallow refactor handoff. Each app or layer has its own document under `docs/fallow-refactor/`.

Use the split documents instead of one combined warning list. They separate complexity work from duplication work and identify whether the likely extraction target is a component, composable, utility, or local refactor.

## Latest Rerun (6 Nov 2026)

Fallow 2.92.1, on `feat/flip-views` at `8e469e8` plus uncommitted review fixes, after the tier
reorg. The split documents below still use the old flat paths and the 3 Sep numbers. Use them for
the refactor approach, and these numbers for current size.

| Measure                      | Result                                 |
| ---------------------------- | -------------------------------------- |
| Files, functions analysed    | 910, 4,390                             |
| Functions over a threshold   | 105 (7 critical, 28 high, 70 moderate) |
| Average cyclomatic, p90      | 1.6, 3                                 |
| Average maintainability      | 93                                     |
| Duplicated lines             | 5,495 of 78,759 (7.0%)                 |
| Clone groups, instances      | 140, 380                               |
| Circular dependencies        | 0                                      |
| Boundary violations          | 0                                      |
| Unused files, exports, types | 2, 6, 18                               |

Functions over a threshold, by area:

| Area                       | Findings | Critical | High |
| -------------------------- | -------- | -------- | ---- |
| `layers/render/shader`     | 26       | 1        | 8    |
| `apps/playground`          | 11       | 3        | 1    |
| `layers/core`              | 10       | 0        | 3    |
| `layers/motion/animations` | 8        | 0        | 5    |
| `layers/delivery/capture`  | 7        | 1        | 4    |
| `layers/motion/scroll`     | 7        | 0        | 0    |

The seven critical findings:

- `getActiveBlocks` in `apps/playground/app/pages/shader-background.vue`
- `getActiveBlocks` in `apps/playground/app/pages/shader-pipeline-background.vue`
- the arrow function at line 25 of `apps/playground/app/pages/motion.vue`
- `main` in `layers/delivery/capture/cli/capture.mjs`
- `padBlankLinesInComponents` in `layers/content/scripts/format-content.mjs`
- `cloneSerializable` in `vitest.config.mts`
- `updatePaperShadingUniforms` in `layers/render/shader/app/shaders/layers/paperShading.ts`

Duplication is concentrated in the shader layer, which appears in 109 of the 140 clone groups. The
largest clone is 248 lines shared by the two playground shader demo pages, so merging those pages
removes both the biggest clone and the two worst `getActiveBlocks` findings. The recommended order
below still holds.

## Source Data

The audit uses two sources:

- Complexity data from `fallow health --complexity --hotspots --targets --format json --quiet --explain`.
- Duplication data from the user-provided Fallow Problems export.

Run these commands before and after each implementation phase:

```bash
FALLOW_AGENT_SOURCE=codex fallow health --complexity --hotspots --targets --format json --quiet --explain 2>/dev/null || true
FALLOW_AGENT_SOURCE=codex fallow dupes --top 80 --format json --quiet --explain 2>/dev/null || true
pnpm typecheck
```

## Recommended Order

1. [apps/playground](./fallow-refactor/apps-playground.md)
2. [layers/shader](./fallow-refactor/layers-shader.md)
3. [layers/layout](./fallow-refactor/layers-layout.md)
4. [layers/core](./fallow-refactor/layers-core.md)
5. [layers/feeds](./fallow-refactor/layers-feeds.md)
6. Smaller cleanup documents, ordered by risk and locality.

## App Documents

- [apps/debug](./fallow-refactor/apps-debug.md)
- [apps/playground](./fallow-refactor/apps-playground.md)
- [apps/visual-identity](./fallow-refactor/apps-visual-identity.md)

## Layer Documents

- [layers/animations](./fallow-refactor/layers-animations.md)
- [layers/canvas](./fallow-refactor/layers-canvas.md)
- [layers/content](./fallow-refactor/layers-content.md)
- [layers/core](./fallow-refactor/layers-core.md)
- [layers/feeds](./fallow-refactor/layers-feeds.md)
- [layers/forms](./fallow-refactor/layers-forms.md)
- [layers/layout](./fallow-refactor/layers-layout.md)
- [layers/mailer](./fallow-refactor/layers-mailer.md)
- [layers/motion](./fallow-refactor/layers-motion.md)
- [layers/navigation](./fallow-refactor/layers-navigation.md)
- [layers/page-transitions](./fallow-refactor/layers-page-transitions.md)
- [layers/routing](./fallow-refactor/layers-routing.md)
- [layers/scroll](./fallow-refactor/layers-scroll.md)
- [layers/scripts](./fallow-refactor/layers-scripts.md)
- [layers/seo](./fallow-refactor/layers-seo.md)
- [layers/shader](./fallow-refactor/layers-shader.md)
- [layers/theme](./fallow-refactor/layers-theme.md)
- [layers/transitions](./fallow-refactor/layers-transitions.md)
- [layers/typography](./fallow-refactor/layers-typography.md)
- [layers/visual](./fallow-refactor/layers-visual.md)

## Non-Goals

Do not address unused exports, unused files, unused dependencies, circular dependencies, or catalog warnings as part of this specific task. Those warnings need separate verification and tracing.

Do not run `fallow fix` for this work. These refactors are structural and require manual review.
