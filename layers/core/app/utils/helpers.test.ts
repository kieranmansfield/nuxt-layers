import { describe, expect, it } from 'vitest'

import { clamp, groupBy, omit, pick, removeEmpty, safeJsonParse } from './helpers'

describe('core helpers', () => {
  it('parses JSON with a fallback', () => {
    expect(safeJsonParse('{"enabled":true}', { enabled: false })).toEqual({ enabled: true })
    expect(safeJsonParse('not-json', { enabled: false })).toEqual({ enabled: false })
  })

  it('removes nullish values without stripping other falsy values', () => {
    expect(
      removeEmpty({
        title: 'Nuxt Layers',
        count: 0,
        empty: '',
        missing: undefined,
        none: null,
      })
    ).toEqual({
      title: 'Nuxt Layers',
      count: 0,
      empty: '',
    })
  })

  it('groups, picks, omits, and clamps values', () => {
    const rows = [
      { kind: 'blog', id: 1 },
      { kind: 'docs', id: 2 },
      { kind: 'blog', id: 3 },
    ]

    expect(groupBy(rows, 'kind')).toEqual({
      blog: [
        { kind: 'blog', id: 1 },
        { kind: 'blog', id: 3 },
      ],
      docs: [{ kind: 'docs', id: 2 }],
    })
    expect(pick({ title: 'Nuxt', description: 'Layers', slug: 'nuxt-layers' }, ['title', 'slug'])).toEqual({
      title: 'Nuxt',
      slug: 'nuxt-layers',
    })
    expect(omit({ title: 'Nuxt', description: 'Layers', slug: 'nuxt-layers' }, ['description'])).toEqual({
      title: 'Nuxt',
      slug: 'nuxt-layers',
    })
    expect(clamp(12, 0, 10)).toBe(10)
  })
})
