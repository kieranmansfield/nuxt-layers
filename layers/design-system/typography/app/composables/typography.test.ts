import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vite-plus/test'

import { TYPE_STEP_CLASSES, useTypography } from './typography'

// Tailwind only emits a class that appears literally in source AND has an @utility — a map
// entry without a utility renders unstyled, a utility without an entry is unreachable from the
// components. Both fail silently, so pin the two lists to each other.
const css = readFileSync(new URL('../assets/css/typography.css', import.meta.url), 'utf8')
const utilities = [...css.matchAll(/@utility\s+(text-step-[\w-]+)/g)].map(([, name]) => name)
const mapped = Object.values(TYPE_STEP_CLASSES)

describe('TYPE_STEP_CLASSES ↔ typography.css', () => {
  it('has an @utility for every mapped class', () => {
    for (const cls of mapped) expect(utilities).toContain(cls)
  })

  it('maps every text-step @utility', () => {
    for (const name of utilities) expect(mapped).toContain(name)
  })

  it('names each class after its step', () => {
    for (const [step, cls] of Object.entries(TYPE_STEP_CLASSES)) {
      expect(cls).toBe(`text-step-${step}`)
    }
  })
})

describe('useTypography step', () => {
  const classesOf = (props: Parameters<typeof useTypography>[0]) =>
    useTypography(props).classes.value.split(' ')

  it('emits step 0 rather than treating it as unset', () => {
    expect(classesOf({ step: 0 })).toContain('text-step-0')
  })

  it('wins over size instead of emitting two font sizes', () => {
    const classes = classesOf({ step: 3, size: 'sm' })
    expect(classes).toContain('text-step-3')
    expect(classes).not.toContain('text-sm')
  })

  it('falls back to size when no step is given', () => {
    expect(classesOf({ size: 'sm' })).toContain('text-sm')
  })
})
