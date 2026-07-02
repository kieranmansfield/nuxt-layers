import { describe, expect, it } from 'vitest'

import { resolveFeedAuthor, resolveFeedDate } from './feed-author'

describe('resolveFeedAuthor', () => {
  it('prefers the first entry of the authors array', () => {
    expect(
      resolveFeedAuthor({
        authors: [{ name: 'Kieran Mansfield' }, { name: 'Someone Else' }],
        author: 'Fallback Author',
      })
    ).toBe('Kieran Mansfield')
  })

  it('falls back to a string author when authors array is missing', () => {
    expect(resolveFeedAuthor({ author: 'Kieran Mansfield' })).toBe('Kieran Mansfield')
  })

  it('falls back to an object author.name when author is not a string', () => {
    expect(resolveFeedAuthor({ author: { name: 'Kieran Mansfield' } })).toBe('Kieran Mansfield')
  })

  it('returns undefined when no author information is present', () => {
    expect(resolveFeedAuthor({})).toBeUndefined()
  })

  it('ignores an authors array entry with an empty name and falls through', () => {
    expect(
      resolveFeedAuthor({ authors: [{ name: '' }], author: 'Kieran Mansfield' })
    ).toBe('Kieran Mansfield')
  })

  it('ignores an empty string author and falls through to object author', () => {
    expect(resolveFeedAuthor({ author: '' })).toBeUndefined()
  })

  it('returns undefined when authors array is empty and no author is set', () => {
    expect(resolveFeedAuthor({ authors: [] })).toBeUndefined()
  })
})

describe('resolveFeedDate', () => {
  it('prefers item.date when present', () => {
    const result = resolveFeedDate({ date: '2024-01-01T00:00:00.000Z' })
    expect(result).toEqual(new Date('2024-01-01T00:00:00.000Z'))
  })

  it('falls back to item.createdAt when date is missing', () => {
    const result = resolveFeedDate({ createdAt: '2023-06-15T00:00:00.000Z' })
    expect(result).toEqual(new Date('2023-06-15T00:00:00.000Z'))
  })

  it('falls back to now when neither date nor createdAt is present', () => {
    const before = Date.now()
    const result = resolveFeedDate({})
    const after = Date.now()

    expect(result.getTime()).toBeGreaterThanOrEqual(before)
    expect(result.getTime()).toBeLessThanOrEqual(after)
  })

  it('accepts a numeric timestamp', () => {
    const timestamp = 1700000000000
    expect(resolveFeedDate({ date: timestamp })).toEqual(new Date(timestamp))
  })

  it('accepts a Date instance', () => {
    const date = new Date('2022-03-03T00:00:00.000Z')
    expect(resolveFeedDate({ date })).toEqual(date)
  })
})
