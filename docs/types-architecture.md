# Type System Architecture — `kmcom-nuxt-layers`

## Guiding Principle

Types have two distinct jobs in this monorepo:

- **Internal types** — owned by a single layer, not exported, can change freely
- **Cross-layer contracts** — shared between two or more layers, or exposed to consuming apps; changes here are breaking changes

The rule: **if only one layer needs it, it lives in that layer. If two or more layers need it, it lives in root `types/`.**

---

## Directory Structure

```
kmcom-nuxt-layers/
│
├── types/                          # Cross-layer contracts & public API
│   ├── theme.ts                    # Accent + semantic UI colour types
│   ├── auth.ts                     # SessionUser
│   └── index.ts                    # Public barrel — consuming apps import from here
│
├── layers/
│   ├── core/
│   │   └── types/
│   │       ├── device.ts           # Browser/device detection internals
│   │       ├── network.ts          # Network status types
│   │       └── index.ts
│   │
│   ├── ui/
│   │   └── types/
│   │       ├── components.ts       # Component prop shapes
│   │       ├── typography.ts       # Type scale, font role types
│   │       └── index.ts
│   │
│   ├── layout/
│   │   └── types/
│   │       ├── grid.ts             # 18-col grid config types
│   │       ├── sections.ts         # Section/page component prop shapes
│   │       └── index.ts
│   │
│   ├── motion/
│   │   └── types/
│   │       ├── transitions.ts      # Transition component prop shapes
│   │       ├── scroll.ts           # Scroll composable internals
│   │       └── index.ts
│   │
│   ├── shader/
│   │   └── types/
│   │       ├── blocks.ts           # Block category interfaces (Primitives, Generators, etc.)
│   │       ├── pipeline.ts         # ShaderPipeline / useShaderStage internals
│   │       ├── colour.ts           # Colour utility types (oklch, hsla, hex, rgb)
│   │       └── index.ts
│   │
│   └── theme/
│       └── types/
│           ├── modes.ts            # dark/light/system mode internals
│           ├── colour.ts           # Accent/palette resolution internals
│           └── index.ts
│
└── package.json
```

---

## Root `types/` — Cross-Layer Contracts

These are the types that define how layers talk to each other. Treat them as a public API — changes here may require updates across multiple layers and in consuming apps.

### `theme.ts`

Accent and semantic UI colour types (`AccentColor`, `ColorUsage`, `UiColors`, …), consumed by
`theming`, `typography` and `visual` via the `#types` alias.

### `auth.ts`

`SessionUser` — session shape shared by the `auth` layer and consuming apps.

### `index.ts` — Public Barrel

Re-exports the above. Add a contract here only once a second layer actually consumes it.

---

## Per-Layer `types/` — Internal Types

Internal types are **not re-exported from root `types/index.ts`**. They are only accessible within their own layer. There is no rule against a layer importing from root `types/` — that's expected — but root `types/` should never import from a layer.

### Dependency direction

```
consuming app
      ↓
  root types/          ← cross-layer contracts
      ↓
  layer/types/         ← internal, layer-owned
```

**Never:** `root types/` ← `layer/types/`
**Never:** `layer-a/types/` ← `layer-b/types/`

If two layers both need a type that currently lives in one of them — move it to root `types/`.

---

## Recommended Type Packages

### Add now

| Package        | Rationale                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `type-fest`    | Utility types: `PartialDeep`, `RequireAtLeastOne`, `Simplify`, `SetOptional`. Eliminates most hand-rolled utility types. |
| `@types/three` | Required for shader layer — Three.js/TSL types for `ShaderNodeObject`, `MeshStandardNodeMaterial`, etc.                  |
| `csstype`      | Typed CSS properties — useful in the design system and any style object work in UI/Layout layers.                        |

### Consider later

| Package      | Rationale                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zod`        | Runtime validation for `runtimeConfig` shapes and any API responses in a Data layer. Pairs with `z.infer<>` to derive TypeScript types from schemas. |
| `ts-pattern` | Exhaustive pattern matching — useful in event bus handlers and shader block routing logic.                                                           |

### Skip

| Package              | Why                                                             |
| -------------------- | --------------------------------------------------------------- |
| `io-ts` / `runtypes` | Same space as Zod, less ecosystem momentum, more complex API.   |
| `@types/gsap`        | GSAP ships its own types — no separate `@types` package needed. |

---

## Migration Checklist

When moving existing types into this structure:

- [ ] Audit all `.ts` files and `.vue` `<script>` blocks for locally defined types
- [ ] Classify each type: internal (one layer) or cross-layer (two or more)
- [ ] Move cross-layer types to root `types/` and update all imports
- [ ] Move internal types to `layer/types/index.ts` and update local imports
- [ ] Add `type-fest`, `@types/three`, `csstype` to `package.json`
- [ ] Ensure root `types/index.ts` barrel only exports what consuming apps should see
- [ ] Verify no layer `types/` files are importing from another layer `types/` — any such coupling should be resolved via root `types/`
- [ ] Add a TSDoc comment to each type in root `types/` explaining which layers consume it

---

## Conventions

- **Type-only imports:** always use `import type { ... }` for type-only imports to keep the bundle clean
- **No circular deps:** root `types/` has zero imports from layers; layers may import from root `types/`
- **TSDoc all root types:** internal types can be lightly documented; root types should always have a JSDoc/TSDoc comment
- **Barrel per layer:** every `layer/types/` has an `index.ts` — no deep imports into layer type files from outside that layer
- **Naming:** prefer `interface` for object shapes (extensible), `type` for unions/aliases
