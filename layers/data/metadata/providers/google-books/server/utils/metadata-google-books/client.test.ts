import { describe, expect, it } from 'vitest'

import { googleBooksCoverUrl, googleBooksMediaType } from './client'

describe('googleBooksMediaType', () => {
  it('classifies manga from categories', () => {
    expect(googleBooksMediaType(['Comics & Graphic Novels / Manga'])).toBe('manga')
  })

  it('classifies comic as graphic-novel', () => {
    expect(googleBooksMediaType(['Comics & Graphic Novels / Comic'])).toBe('graphic-novel')
  })

  it('classifies "graphic novel" as graphic-novel', () => {
    expect(googleBooksMediaType(['Fiction / Graphic Novel'])).toBe('graphic-novel')
  })

  it('is case-insensitive', () => {
    expect(googleBooksMediaType(['MANGA'])).toBe('manga')
    expect(googleBooksMediaType(['COMIC'])).toBe('graphic-novel')
  })

  it('defaults to book for unrelated categories', () => {
    expect(googleBooksMediaType(['Fiction / Thriller'])).toBe('book')
  })

  it('defaults to book when categories is undefined', () => {
    expect(googleBooksMediaType(undefined)).toBe('book')
  })

  it('defaults to book when categories is empty', () => {
    expect(googleBooksMediaType([])).toBe('book')
  })

  it('prefers manga over comic when both are present', () => {
    expect(googleBooksMediaType(['Manga / Comic'])).toBe('manga')
  })
})

describe('googleBooksCoverUrl', () => {
  it('upgrades http to https', () => {
    const url = googleBooksCoverUrl('http://books.google.com/books/content?id=abc&zoom=1')
    expect(url.startsWith('https://')).toBe(true)
  })

  it('rewrites zoom=N to zoom=3', () => {
    const url = googleBooksCoverUrl('https://books.google.com/books/content?id=abc&zoom=1')
    expect(url).toContain('&zoom=3')
    expect(url).not.toContain('&zoom=1')
  })

  it('strips &edge=curl', () => {
    const url = googleBooksCoverUrl(
      'https://books.google.com/books/content?id=abc&zoom=1&edge=curl'
    )
    expect(url).not.toContain('edge=curl')
  })

  it('appends &fife=w{width} using the default width of 800', () => {
    const url = googleBooksCoverUrl('https://books.google.com/books/content?id=abc&zoom=1')
    expect(url.endsWith('&fife=w800')).toBe(true)
  })

  it('appends &fife=w{width} using a custom width', () => {
    const url = googleBooksCoverUrl('https://books.google.com/books/content?id=abc&zoom=1', 200)
    expect(url.endsWith('&fife=w200')).toBe(true)
  })

  it('applies all transformations together', () => {
    const url = googleBooksCoverUrl(
      'http://books.google.com/books/content?id=abc&zoom=5&edge=curl',
      400
    )
    expect(url).toBe('https://books.google.com/books/content?id=abc&zoom=3&fife=w400')
  })
})
