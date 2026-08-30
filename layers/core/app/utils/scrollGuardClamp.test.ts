import { describe, expect, it } from 'vitest'

import { isOverflowing, shouldExclude } from './scrollGuardClamp'

describe('isOverflowing', () => {
  it('is true when scrollWidth exceeds the viewport width', () => {
    expect(isOverflowing(1200, 1024)).toBe(true)
  })

  it('is false when scrollWidth is within the viewport width', () => {
    expect(isOverflowing(800, 1024)).toBe(false)
  })

  it('is false when scrollWidth equals the viewport width', () => {
    expect(isOverflowing(1024, 1024)).toBe(false)
  })
})

describe('shouldExclude', () => {
  it('is true when any selector matches', () => {
    const matches = (sel: string) => sel === '.carousel'
    expect(shouldExclude(matches, ['.overflow-intent', '.carousel'])).toBe(true)
  })

  it('is false when no selector matches', () => {
    const matches = () => false
    expect(shouldExclude(matches, ['.carousel', '.overflow-intent'])).toBe(false)
  })

  it('swallows an invalid selector and treats it as non-matching', () => {
    const matches = () => {
      throw new DOMException('invalid selector')
    }
    expect(shouldExclude(matches, ['::not-a-real-selector'])).toBe(false)
  })
})
