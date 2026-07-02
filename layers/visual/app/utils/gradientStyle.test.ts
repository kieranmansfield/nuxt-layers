import { describe, expect, it } from 'vitest'

import type { GradientConfig } from '../types/gradient'
import { buildGradientStyle, resolveGradientColor } from './gradientStyle'

describe('resolveGradientColor', () => {
  it('delegates to resolveUiColorToken for a gradient stop', () => {
    expect(resolveGradientColor({ color: 'primary', shade: 500 })).toBe(
      'var(--ui-color-primary-500)'
    )
  })

  it('applies opacity for a gradient stop', () => {
    expect(resolveGradientColor({ color: 'secondary', shade: 300, opacity: 50 })).toBe(
      'color-mix(in srgb, var(--ui-color-secondary-300) 50%, transparent)'
    )
  })
})

describe('buildGradientStyle', () => {
  const from = { color: 'primary', shade: 500 } as const
  const to = { color: 'secondary', shade: 500 } as const

  it('builds a linear gradient defaulting direction to "to bottom right"', () => {
    const cfg: GradientConfig = { from, to }
    expect(buildGradientStyle(cfg)).toEqual({
      backgroundImage:
        'linear-gradient(to bottom right, var(--ui-color-primary-500), var(--ui-color-secondary-500))',
    })
  })

  it('maps every named linear direction', () => {
    const directions: Array<[NonNullable<GradientConfig['direction']>, string]> = [
      ['to-t', 'to top'],
      ['to-tr', 'to top right'],
      ['to-r', 'to right'],
      ['to-br', 'to bottom right'],
      ['to-b', 'to bottom'],
      ['to-bl', 'to bottom left'],
      ['to-l', 'to left'],
      ['to-tl', 'to top left'],
    ]

    for (const [direction, expected] of directions) {
      const cfg: GradientConfig = { from, to, direction }
      expect(buildGradientStyle(cfg)).toEqual({
        backgroundImage: `linear-gradient(${expected}, var(--ui-color-primary-500), var(--ui-color-secondary-500))`,
      })
    }
  })

  it('includes the via stop between from and to when provided', () => {
    const via = { color: 'info', shade: 400 } as const
    const cfg: GradientConfig = { from, to, via }
    expect(buildGradientStyle(cfg)).toEqual({
      backgroundImage:
        'linear-gradient(to bottom right, var(--ui-color-primary-500), var(--ui-color-info-400), var(--ui-color-secondary-500))',
    })
  })

  it('builds a radial gradient', () => {
    const cfg: GradientConfig = { from, to, shape: 'radial' }
    expect(buildGradientStyle(cfg)).toEqual({
      backgroundImage:
        'radial-gradient(circle, var(--ui-color-primary-500), var(--ui-color-secondary-500))',
    })
  })

  it('builds a conic gradient', () => {
    const cfg: GradientConfig = { from, to, shape: 'conic' }
    expect(buildGradientStyle(cfg)).toEqual({
      backgroundImage:
        'conic-gradient(var(--ui-color-primary-500), var(--ui-color-secondary-500))',
    })
  })
})
