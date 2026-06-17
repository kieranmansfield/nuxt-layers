# Fallow Complexity and Duplication Audit

This file is the entry point for the layer-by-layer Fallow refactor handoff. Each app or layer has its own document under `docs/fallow-refactor/`.

Use the split documents instead of one combined warning list. They separate complexity work from duplication work and identify whether the likely extraction target is a component, composable, utility, or local refactor.

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
- [layers/ui](./fallow-refactor/layers-ui.md)
- [layers/visual](./fallow-refactor/layers-visual.md)

## Non-Goals

Do not address unused exports, unused files, unused dependencies, circular dependencies, or catalog warnings as part of this specific task. Those warnings need separate verification and tracing.

Do not run `fallow fix` for this work. These refactors are structural and require manual review.
