/**
 * Design-system tokens — hand-written unions for this pass, kept in sync
 * with layers/core/app/assets/css/tokens/*.css by convention. Derived from a
 * config object only in Phase 2 (see nuxt-declarative-layout-system-spec.md §21).
 */
export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

// ponytail: ContainerSize (alias of GridContainerSize) and Breakpoint land
// with Phase 2's Container/Stack components — no consumer for them yet.
