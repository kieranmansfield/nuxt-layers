// fallow-ignore-file unused-file — Phase 5 token foundation (spec §21); the
// theme adapter and CSS token file consume it by convention (hand-synced
// values), not by import, matching layers/core/app/types/tokens.ts's
// existing pattern. Future consumers (theme adapter component overrides,
// standalone token exports) will import it directly.
import type { UiColors } from '#types'
import type { FluidFontSize } from '#layers/typography/app/types/typography'

/**
 * Design-system tokens — first real config-object source of truth (Phase 5,
 * nuxt-declarative-layout-system-spec.md §21). Colours key off the existing
 * `UiColors` union rather than inventing new names; typography keys off the
 * existing `FluidFontSize` scale/CSS vars in layers/typography — this section
 * only gives them a config-object home so a Nuxt UI theme adapter and CSS
 * custom properties can derive from one place.
 */

const fluidTextVar = (size: FluidFontSize) => `var(--fluid-text-${size}-raw)`

export const designSystem = {
  colors: {
    dimmed: 'dimmed',
    muted: 'muted',
    toned: 'toned',
    default: 'default',
    highlighted: 'highlighted',
    inverted: 'inverted',
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
    primary: 'primary',
    neutral: 'neutral',
    secondary: 'secondary',
    accent: 'accent',
    black: 'black',
    white: 'white',
  } satisfies Record<UiColors, UiColors>,

  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  typography: {
    xs: fluidTextVar('xs'),
    sm: fluidTextVar('sm'),
    md: fluidTextVar('md'),
    lg: fluidTextVar('lg'),
    xl: fluidTextVar('xl'),
    '2xl': fluidTextVar('2xl'),
    '3xl': fluidTextVar('3xl'),
    '4xl': fluidTextVar('4xl'),
    '5xl': fluidTextVar('5xl'),
    '6xl': fluidTextVar('6xl'),
    '7xl': fluidTextVar('7xl'),
    '8xl': fluidTextVar('8xl'),
    '9xl': fluidTextVar('9xl'),
  },

  motion: {
    duration: {
      // `base` matches theme.css's existing `.theme-transition` value — not
      // a new default, just giving the real value in use a named token.
      fast: '150ms',
      base: '700ms',
      slow: '1000ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
} as const

/** Identity function — mirrors `defineAppConfig`'s pattern, exists purely for inference. */
export function defineDesignSystem<T extends typeof designSystem>(config: T): T {
  return config
}

export type DesignSystem = typeof designSystem

export type DesignSystemToken<K extends keyof DesignSystem> = keyof DesignSystem[K]
