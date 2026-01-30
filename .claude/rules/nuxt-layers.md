---
paths:
  - "layers/**/*"
---

# Nuxt Layers Development

## Layer Structure
Each layer is an independent package that extends Nuxt apps with:
- Components (`components/`)
- Composables (`composables/`)
- Utilities (`utils/`)
- Nuxt config (`nuxt.config.ts`)

## Best Practices
- Layers should be self-contained and composable
- Avoid circular dependencies between layers
- Test changes against the playground app

## Layer Dependencies
- `ui` → depends on nothing
- `layout` → may use `ui` components
- `core` → base utilities, no UI dependencies
