import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vite-plus/test'

import type { Spacing } from '../types/tokens'
import { useLayoutAttrs } from './useLayoutAttrs'

// spacingVar() builds the custom-property name by string interpolation, so a token
// with no matching declaration resolves to an undefined var() — silent in CSS.
describe('useLayoutAttrs spacing tokens', () => {
  const css = readFileSync(
    new URL('../assets/css/tokens/spacing-fluid.css', import.meta.url),
    'utf8'
  )
  // Record, not an array, so typecheck fails if the Spacing union gains a member.
  const tokens: Record<Exclude<Spacing, 'none'>, true> = {
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
    '2xl': true,
    '3xl': true,
  }

  it('resolves every token to a property spacing-fluid.css declares', () => {
    for (const token of Object.keys(tokens) as Spacing[]) {
      const { style } = useLayoutAttrs(() => ({ gap: token }))
      const name = /^var\((--[\w-]+)\)$/.exec(String(style.value.gap))?.[1]
      expect(css).toMatch(new RegExp(`^\\s*${name}:`, 'm'))
    }
  })
})

describe('useLayoutAttrs margin support', () => {
  it('sets margin from a static token', () => {
    const { style } = useLayoutAttrs(() => ({ m: 'md' }))
    expect(style.value.margin).toBe('var(--space-md)')
  })

  it('sets marginInline from px-equivalent mx', () => {
    const { style } = useLayoutAttrs(() => ({ mx: 'lg' }))
    expect(style.value.marginInline).toBe('var(--space-lg)')
  })

  it('sets marginBlock from my', () => {
    const { style } = useLayoutAttrs(() => ({ my: 'sm' }))
    expect(style.value.marginBlock).toBe('var(--space-sm)')
  })

  it('resolves none to 0px for margin', () => {
    const { style } = useLayoutAttrs(() => ({ m: 'none' }))
    expect(style.value.margin).toBe('0px')
  })

  it('omits margin keys entirely when not passed', () => {
    const { style } = useLayoutAttrs(() => ({ gap: 'md' }))
    expect(style.value.margin).toBeUndefined()
    expect(style.value.marginInline).toBeUndefined()
    expect(style.value.marginBlock).toBeUndefined()
  })

  it('does not regress existing gap/align/justify/padding behavior', () => {
    const { style } = useLayoutAttrs(() => ({
      gap: 'md',
      align: 'center',
      justify: 'between',
      p: 'lg',
    }))
    expect(style.value).toEqual({
      gap: 'var(--space-md)',
      padding: 'var(--space-lg)',
      alignItems: 'center',
      justifyContent: 'space-between',
    })
  })
})
