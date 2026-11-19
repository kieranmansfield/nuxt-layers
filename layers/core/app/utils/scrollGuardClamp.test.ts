import { describe, expect, it } from 'vite-plus/test'

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

const matchesCarousel = (sel: string) => sel === '.carousel'
const matchesNothing = () => false
const throwsInvalidSelector = () => {
  throw new DOMException('invalid selector')
}

describe('shouldExclude', () => {
  it('is true when any selector matches', () => {
    expect(shouldExclude(matchesCarousel, ['.overflow-intent', '.carousel'])).toBe(true)
  })

  it('is false when no selector matches', () => {
    expect(shouldExclude(matchesNothing, ['.carousel', '.overflow-intent'])).toBe(false)
  })

  it('swallows an invalid selector and treats it as non-matching', () => {
    expect(shouldExclude(throwsInvalidSelector, ['::not-a-real-selector'])).toBe(false)
  })
})
