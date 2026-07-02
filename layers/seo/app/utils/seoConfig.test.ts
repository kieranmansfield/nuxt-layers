import { describe, expect, it } from 'vitest'

import type { SiteConfig } from '#layers/core/app/types/site'
import { resolveSeoConfig } from './seoConfig'

const site: SiteConfig = { title: 'Nuxt Layers', description: 'A composable layer system' }

describe('resolveSeoConfig', () => {
  it('applies all defaults when no seoLayer config is given', () => {
    expect(resolveSeoConfig(site)).toEqual({
      site,
      ogImageComponent: 'OgImageBasic',
      ogImageProps: {},
      twitterCard: 'summary_large_image',
      schemaOrgEnabled: true,
      identity: null,
    })
  })

  it('applies all defaults when seoLayer is an empty object', () => {
    expect(resolveSeoConfig(site, {})).toEqual({
      site,
      ogImageComponent: 'OgImageBasic',
      ogImageProps: {},
      twitterCard: 'summary_large_image',
      schemaOrgEnabled: true,
      identity: null,
    })
  })

  it('uses the configured og:image component and props when provided', () => {
    const result = resolveSeoConfig(site, {
      ogImage: { component: 'OgImageCustom', props: { title: 'Custom' } },
    })

    expect(result.ogImageComponent).toBe('OgImageCustom')
    expect(result.ogImageProps).toEqual({ title: 'Custom' })
  })

  it('uses the configured twitter card type', () => {
    expect(resolveSeoConfig(site, { twitterCard: 'summary' }).twitterCard).toBe('summary')
  })

  it('allows schemaOrg to be disabled explicitly', () => {
    const result = resolveSeoConfig(site, { schemaOrg: { enabled: false } })
    expect(result.schemaOrgEnabled).toBe(false)
  })

  it('passes through a configured schemaOrg identity', () => {
    const identity = { type: 'Organization', name: 'Nuxt Layers' }
    const result = resolveSeoConfig(site, { schemaOrg: { identity } })
    expect(result.identity).toBe(identity)
  })

  it('preserves the site object reference in the result', () => {
    expect(resolveSeoConfig(site).site).toBe(site)
  })
})
