import type { AccentColor } from '#layers/theming/app/types/theme'
import twColors from 'tailwindcss/colors'

/**
 * Single source of truth for each accent's representative swatch colour
 * (the 500 shade of its real Tailwind palette). Shared by AccentButton.vue's
 * swatch rendering and accent-css.ts's per-accent CSS-var generation, so the
 * two never drift apart.
 */
export const ACCENT_SWATCH: Record<AccentColor, string> = {
  red: twColors.red[500],
  orange: twColors.orange[500],
  amber: twColors.amber[500],
  yellow: twColors.yellow[500],
  lime: twColors.lime[500],
  green: twColors.green[500],
  emerald: twColors.emerald[500],
  teal: twColors.teal[500],
  cyan: twColors.cyan[500],
  sky: twColors.sky[500],
  blue: twColors.blue[500],
  indigo: twColors.indigo[500],
  violet: twColors.violet[500],
  purple: twColors.purple[500],
  fuchsia: twColors.fuchsia[500],
  pink: twColors.pink[500],
  rose: twColors.rose[500],
}
