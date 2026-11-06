import { describe, expect, it } from 'vite-plus/test'

import { selectCollection } from './selectCollection'

type Item = { id: string; date?: string; tags?: string[]; draft?: boolean }

const items: Item[] = [
  { id: 'a', date: '2026-01-01', tags: ['x'] },
  { id: 'b', date: '2026-03-01', tags: ['y'], draft: true },
  { id: 'c', tags: ['x', 'y'] },
  { id: 'd', date: '2026-02-01' },
]

const ids = (list: Item[]) => list.map((item) => item.id)

describe('selectCollection', () => {
  it('keeps source order and returns a copy when given no options', () => {
    const selected = selectCollection(items)
    expect(ids(selected)).toEqual(['a', 'b', 'c', 'd'])
    expect(selected).not.toBe(items)
  })

  it('sorts both directions with a missing field last', () => {
    expect(ids(selectCollection(items, { sortKey: 'date' }))).toEqual(['b', 'd', 'a', 'c'])
    expect(ids(selectCollection(items, { sortKey: 'date', sortDirection: 'asc' }))).toEqual([
      'a',
      'd',
      'b',
      'c',
    ])
  })

  it('does not mutate its input when sorting', () => {
    selectCollection(items, { sortKey: 'date' })
    expect(ids(items)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('applies the filter before the limit', () => {
    const selected = selectCollection(items, {
      sortKey: 'date',
      filter: (item) => !item.draft,
      limit: 1,
    })
    expect(ids(selected)).toEqual(['d'])
  })

  it('matches any requested tag and drops untagged items', () => {
    expect(ids(selectCollection(items, { tags: ['y'] }))).toEqual(['b', 'c'])
    expect(ids(selectCollection(items, { tags: ['x', 'y'] }))).toEqual(['a', 'b', 'c'])
  })
})
