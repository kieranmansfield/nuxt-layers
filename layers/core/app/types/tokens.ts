/**
 * Design-system tokens — hand-written unions for this pass, kept in sync
 * with layers/core/app/assets/css/tokens/*.css by convention. Derived from a
 * config object only in Phase 2 (see nuxt-declarative-layout-system-spec.md §21).
 */
export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

/** Matches the existing GridContainerSize values (layers/layout/app/types/layouts.ts). */
// fallow-ignore-next-line unused-type — consumed by Container.vue's <script setup>; static analysis doesn't trace type-only imports into Vue SFCs
export type ContainerSize = 'content' | 'wide' | 'fluid' | 'full'

// ponytail: Breakpoint still has no consumer — add it when a primitive
// actually needs discrete breakpoint values, not speculatively.
