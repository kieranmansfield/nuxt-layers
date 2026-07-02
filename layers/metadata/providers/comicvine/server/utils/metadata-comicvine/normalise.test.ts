import { describe, expect, it } from 'vitest'

import { normaliseComicVineIssue, normaliseComicVineVolume } from './normalise'
import type { ComicVineIssue, ComicVineVolume } from './types'

function baseIssue(overrides: Partial<ComicVineIssue> = {}): ComicVineIssue {
  return {
    id: 1000,
    name: null,
    issue_number: '1',
    description: null,
    deck: null,
    cover_date: null,
    store_date: null,
    site_detail_url: 'https://comicvine.gamespot.com/issue/1000',
    image: null,
    volume: null,
    person_credits: null,
    publisher: null,
    ...overrides,
  }
}

function baseVolume(overrides: Partial<ComicVineVolume> = {}): ComicVineVolume {
  return {
    id: 2000,
    name: 'Amazing Spider-Man',
    description: null,
    deck: null,
    start_year: null,
    count_of_issues: null,
    site_detail_url: 'https://comicvine.gamespot.com/volume/2000',
    image: null,
    publisher: null,
    people: null,
    ...overrides,
  }
}

describe('normaliseComicVineIssue', () => {
  it('prefers volume name + issue number for the title', () => {
    const record = normaliseComicVineIssue(
      baseIssue({ volume: { id: 1, name: 'Amazing Spider-Man' }, issue_number: '5' })
    )
    expect(record.title).toBe('Amazing Spider-Man #5')
  })

  it('falls back to the issue name when there is no volume', () => {
    const record = normaliseComicVineIssue(baseIssue({ name: 'The Beginning', issue_number: '1' }))
    expect(record.title).toBe('The Beginning')
  })

  it('falls back to "Issue #n" when neither volume nor name are present', () => {
    const record = normaliseComicVineIssue(baseIssue({ issue_number: '7' }))
    expect(record.title).toBe('Issue #7')
  })

  it('sets subtitle to the issue name when present', () => {
    const record = normaliseComicVineIssue(baseIssue({ name: 'The Beginning' }))
    expect(record.subtitle).toBe('The Beginning')
  })

  it('leaves subtitle undefined when the issue has no name', () => {
    expect(normaliseComicVineIssue(baseIssue()).subtitle).toBeUndefined()
  })

  it('prefers deck over description', () => {
    const record = normaliseComicVineIssue(
      baseIssue({ deck: 'Short deck', description: 'Long description' })
    )
    expect(record.description).toBe('Short deck')
  })

  it('falls back to description when deck is absent', () => {
    const record = normaliseComicVineIssue(baseIssue({ description: 'Long description' }))
    expect(record.description).toBe('Long description')
  })

  it('leaves description undefined when both deck and description are absent', () => {
    expect(normaliseComicVineIssue(baseIssue()).description).toBeUndefined()
  })

  it('maps person_credits to creators', () => {
    const record = normaliseComicVineIssue(
      baseIssue({ person_credits: [{ id: 10, name: 'Stan Lee', role: 'writer' }] })
    )
    expect(record.creators).toEqual([{ name: 'Stan Lee', role: 'writer', providerId: '10' }])
  })

  it('leaves creators undefined when person_credits is empty or null', () => {
    expect(normaliseComicVineIssue(baseIssue({ person_credits: [] })).creators).toBeUndefined()
    expect(normaliseComicVineIssue(baseIssue({ person_credits: null })).creators).toBeUndefined()
  })

  it('prefers medium_url over original_url for coverUrl', () => {
    const record = normaliseComicVineIssue(
      baseIssue({ image: { medium_url: 'medium.jpg', original_url: 'original.jpg' } })
    )
    expect(record.coverUrl).toBe('medium.jpg')
  })

  it('falls back to original_url when medium_url is missing', () => {
    const record = normaliseComicVineIssue(
      baseIssue({
        image: { medium_url: undefined as unknown as string, original_url: 'original.jpg' },
      })
    )
    expect(record.coverUrl).toBe('original.jpg')
  })

  it('leaves coverUrl undefined when image is null', () => {
    expect(normaliseComicVineIssue(baseIssue()).coverUrl).toBeUndefined()
  })

  it('sets identifiers.comicVineId to the stringified id', () => {
    expect(normaliseComicVineIssue(baseIssue({ id: 42 })).identifiers).toEqual({
      comicVineId: '42',
    })
  })

  it('stamps lastSyncedAt as an ISO-ish string', () => {
    expect(normaliseComicVineIssue(baseIssue()).lastSyncedAt).toEqual(expect.any(String))
  })
})

describe('normaliseComicVineVolume', () => {
  it('appends the start year to the title when present', () => {
    expect(normaliseComicVineVolume(baseVolume({ start_year: '1963' })).title).toBe(
      'Amazing Spider-Man (1963)'
    )
  })

  it('omits the year suffix when start_year is absent', () => {
    expect(normaliseComicVineVolume(baseVolume()).title).toBe('Amazing Spider-Man')
  })

  it('pluralises the issue count subtitle for more than one issue', () => {
    expect(normaliseComicVineVolume(baseVolume({ count_of_issues: 5 })).subtitle).toBe('5 issues')
  })

  it('uses the singular issue count subtitle for exactly one issue', () => {
    expect(normaliseComicVineVolume(baseVolume({ count_of_issues: 1 })).subtitle).toBe('1 issue')
  })

  it('joins publisher and issue count with " · "', () => {
    const record = normaliseComicVineVolume(
      baseVolume({ publisher: { id: 1, name: 'Marvel' }, count_of_issues: 3 })
    )
    expect(record.subtitle).toBe('Marvel · 3 issues')
  })

  it('drops the null issue count and keeps only the publisher', () => {
    const record = normaliseComicVineVolume(
      baseVolume({ publisher: { id: 1, name: 'Marvel' }, count_of_issues: null })
    )
    expect(record.subtitle).toBe('Marvel')
  })

  it('subtitle is undefined when both publisher and issue count are absent', () => {
    expect(normaliseComicVineVolume(baseVolume()).subtitle).toBeUndefined()
  })

  it('maps people to creators', () => {
    const record = normaliseComicVineVolume(
      baseVolume({ people: [{ id: 5, name: 'Stan Lee', role: 'writer' }] })
    )
    expect(record.creators).toEqual([{ name: 'Stan Lee', role: 'writer', providerId: '5' }])
  })

  it('leaves creators undefined when people is empty or null', () => {
    expect(normaliseComicVineVolume(baseVolume({ people: [] })).creators).toBeUndefined()
    expect(normaliseComicVineVolume(baseVolume({ people: null })).creators).toBeUndefined()
  })

  it('prefers deck over description', () => {
    const record = normaliseComicVineVolume(
      baseVolume({ deck: 'deck text', description: 'desc text' })
    )
    expect(record.description).toBe('deck text')
  })

  it('prefers medium_url over original_url, falling back when missing', () => {
    const withMedium = normaliseComicVineVolume(
      baseVolume({ image: { medium_url: 'medium.jpg', original_url: 'original.jpg' } })
    )
    expect(withMedium.coverUrl).toBe('medium.jpg')

    const withoutMedium = normaliseComicVineVolume(
      baseVolume({
        image: { medium_url: undefined as unknown as string, original_url: 'original.jpg' },
      })
    )
    expect(withoutMedium.coverUrl).toBe('original.jpg')
  })

  it('sets identifiers.comicVineId to the stringified id', () => {
    expect(normaliseComicVineVolume(baseVolume({ id: 99 })).identifiers).toEqual({
      comicVineId: '99',
    })
  })
})
