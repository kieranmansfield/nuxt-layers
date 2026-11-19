import { describe, expect, it } from 'vite-plus/test'

import { hoistFrontmatter } from './hoistFrontmatter'

describe('hoistFrontmatter', () => {
  it('lifts meta fields onto the item', () => {
    const item = { title: 'Marché', meta: { year: 2026, tags: ['nuxt'] } }
    expect(hoistFrontmatter(item)).toMatchObject({ title: 'Marché', year: 2026, tags: ['nuxt'] })
  })

  it('keeps top-level fields over meta', () => {
    expect(hoistFrontmatter({ title: 'Real', meta: { title: 'Shadow' } }).title).toBe('Real')
  })

  it('passes through null and items without meta', () => {
    expect(hoistFrontmatter(null)).toBeNull()
    const bare = { title: 'Bare' }
    expect(hoistFrontmatter(bare)).toBe(bare)
  })
})
