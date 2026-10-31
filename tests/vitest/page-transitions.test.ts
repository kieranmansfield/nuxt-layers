import { describe, expect, it } from 'vitest'
import { pageTransitionPresets } from '../../layers/motion/page-transitions/app/utils/pageTransitionPresets'
import { resolvePageTransition } from '../../layers/motion/page-transitions/app/utils/resolvePageTransition'

const base = { from: '/blog/a', to: '/', fallback: { name: 'fade' } }

describe('resolvePageTransition', () => {
  it('falls back to the default', () => {
    expect(resolvePageTransition(base).name).toBe('fade')
  })

  it('matches rules by path prefix, first wins', () => {
    const rules = [{ from: '/blog', name: 'curved' }, { name: 'wipe' }]
    expect(resolvePageTransition({ ...base, rules }).name).toBe('curved')
    expect(resolvePageTransition({ ...base, from: '/x', rules }).name).toBe('wipe')
  })

  it('prioritises override > link > meta > rules', () => {
    const rules = [{ name: 'rule' }]
    const all = {
      ...base,
      rules,
      meta: 'meta',
      link: { name: 'link' },
      override: { name: 'override' },
    }
    expect(resolvePageTransition(all).name).toBe('override')
    expect(resolvePageTransition({ ...all, override: null }).name).toBe('link')
    expect(resolvePageTransition({ ...all, override: null, link: null }).name).toBe('meta')
    expect(
      resolvePageTransition({ ...all, override: null, link: null, meta: undefined }).name
    ).toBe('rule')
  })
})

describe('pageTransitionPresets', () => {
  it.each(Object.entries(pageTransitionPresets))('%s is css or has a JS hook', (_n, p) => {
    expect(p.css || p.leave || p.enter).toBeTruthy()
  })
})
