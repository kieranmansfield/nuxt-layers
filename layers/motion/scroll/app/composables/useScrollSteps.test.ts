import { describe, expect, it } from 'vite-plus/test'

import { isStepActive } from './useScrollSteps'

describe('isStepActive', () => {
  it('is active only inside its own slice of progress', () => {
    expect(isStepActive(0.1, 0, 2)).toBe(true)
    expect(isStepActive(0.5, 0, 2)).toBe(false)
    expect(isStepActive(0.5, 1, 2)).toBe(true)
  })

  it('keeps the last step active at the end and nothing active with no steps', () => {
    expect(isStepActive(1, 1, 2)).toBe(true)
    expect(isStepActive(0, 0, 0)).toBe(false)
  })
})
