import twColors from 'tailwindcss/colors'
import { describe, expect, it } from 'vitest'

import { buildAccentCSS } from './accent-css'

const ACCENTS = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
] as const

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

describe('buildAccentCSS', () => {
  const css = buildAccentCSS()

  it('emits one html[data-theme-colour] rule per accent', () => {
    for (const accent of ACCENTS) {
      expect(css).toContain(`html[data-theme-colour="${accent}"]{`)
    }
    expect(css.match(/html\[data-theme-colour="/g)).toHaveLength(ACCENTS.length)
  })

  it('never emits the literal string "undefined"', () => {
    expect(css).not.toContain('undefined')
  })

  it('includes every shade for the primary palette of each accent', () => {
    for (const accent of ACCENTS) {
      const ruleMatch = css.match(
        new RegExp(`html\\[data-theme-colour="${accent}"\\]\\{([^}]*)\\}`)
      )
      expect(ruleMatch).not.toBeNull()
      const rule = ruleMatch?.[1] ?? ''

      for (const shade of SHADES) {
        expect(rule).toContain(`--ui-color-primary-${shade}:`)
      }
    }
  })

  it('uses the actual tailwind colour values for the primary palette', () => {
    const redPalette = twColors.red as unknown as Record<number, string>
    expect(css).toContain(`--ui-color-primary-500:${redPalette[500]};`)
    expect(css).toContain(`--ui-color-primary-50:${redPalette[50]};`)
  })

  it('includes secondary and info palettes derived from the accent map', () => {
    // blue -> secondary: indigo, info: sky
    const indigoPalette = twColors.indigo as unknown as Record<number, string>
    const skyPalette = twColors.sky as unknown as Record<number, string>

    const blueRule = css.match(/html\[data-theme-colour="blue"\]\{([^}]*)\}/)?.[1] ?? ''
    expect(blueRule).toContain(`--ui-color-secondary-500:${indigoPalette[500]};`)
    expect(blueRule).toContain(`--ui-color-info-500:${skyPalette[500]};`)
  })
})
