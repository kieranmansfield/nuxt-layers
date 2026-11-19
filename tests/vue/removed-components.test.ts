import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import { describe, expect, it, vi } from 'vite-plus/test'

vi.stubGlobal('defineNuxtPlugin', (plugin: unknown) => plugin)
vi.stubGlobal('useSite', () => ({ titleWords: ['Site', 'Name'], subtitleWords: ['Sub'] }))
vi.stubGlobal('useColor', () => computed(() => 'text-primary'))

const { default: plugin } =
  (await import('../../layers/structure/navigation/app/plugins/removed-components')) as unknown as {
    default: { setup: (nuxtApp: { vueApp: unknown }) => void }
  }

const usePlugin = { install: (vueApp: unknown) => plugin.setup({ vueApp }) }

const render = (template: string) => mount({ template }, { global: { plugins: [usePlugin] } })

describe('removed navigation components', () => {
  it('SiteTitle and SiteSubtitle still render their words', () => {
    const wrapper = render('<div><SiteTitle /><SiteSubtitle /></div>')
    expect(wrapper.findAll('.site-word').map((w) => w.text())).toEqual(['Site', 'Name', 'Sub'])
  })

  it('LinksNamed still links to the named route with its colour and slot', () => {
    const link = render('<LinksNamed name="blog" :params="{ slug: \'a\' }">Read</LinksNamed>')
    expect(JSON.parse(link.attributes('data-to') as string)).toEqual({
      name: 'blog',
      params: { slug: 'a' },
      query: {},
    })
    expect(link.classes()).toContain('text-primary')
    expect(link.text()).toBe('Read')
  })
})
