import { describe, expect, it } from 'vitest'

import { resolveSiteConfig } from './site'

describe('resolveSiteConfig', () => {
  it('defaults title, subtitle, and description to empty values when omitted', () => {
    expect(resolveSiteConfig({})).toEqual({
      title: '',
      titleWords: [''],
      subtitle: '',
      subtitleWords: [''],
      description: '',
    })
  })

  it('splits the title and subtitle into words', () => {
    expect(
      resolveSiteConfig({ title: 'Nuxt Layers', subtitle: 'Composable Vue apps' })
    ).toEqual({
      title: 'Nuxt Layers',
      titleWords: ['Nuxt', 'Layers'],
      subtitle: 'Composable Vue apps',
      subtitleWords: ['Composable', 'Vue', 'apps'],
      description: '',
    })
  })

  it('passes description through unchanged when provided', () => {
    expect(resolveSiteConfig({ description: 'A monorepo of Nuxt layers' })).toEqual({
      title: '',
      titleWords: [''],
      subtitle: '',
      subtitleWords: [''],
      description: 'A monorepo of Nuxt layers',
    })
  })

  it('handles a single-word title with no spaces', () => {
    expect(resolveSiteConfig({ title: 'Solo' }).titleWords).toEqual(['Solo'])
  })
})
