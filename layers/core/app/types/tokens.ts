/**
 * Design-system tokens — hand-written unions for this pass, kept in sync
 * with layers/core/app/assets/css/tokens/*.css by convention. Derived from a
 * config object only in Phase 2 (see nuxt-declarative-layout-system-spec.md §21).
 */
export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

/**
 * Matches the existing GridContainerSize values (layers/layout/app/types/layouts.ts).
 * Only consumed by Container.vue's <script setup> — static analysis doesn't trace
 * type-only imports into Vue SFCs, hence the suppression below.
 */
// fallow-ignore-next-line unused-type
export type ContainerSize = 'content' | 'wide' | 'fluid' | 'full'

/**
 * Canonical breakpoint pixel values — mirrors breakpoints.css's `--breakpoint-*`
 * vars (rem). JS/TS consumers that need a number (matchMedia, resize
 * listeners) read this instead of hand-duplicating Tailwind's defaults.
 * Consumed cross-package (layers/layout, layers/visual) via the
 * `#layers/core/types` alias — static analysis doesn't trace that either.
 */
// fallow-ignore-next-line unused-export
export const BREAKPOINT_PX = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

// fallow-ignore-next-line unused-type
export type Breakpoint = keyof typeof BREAKPOINT_PX
