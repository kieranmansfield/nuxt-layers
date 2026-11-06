import type { LinkProps } from '@nuxt/ui'
import type { PropType } from 'vue'
import type { UiColors } from '#layers/typography/types/colors'
import { ULink } from '#components'
import { defineComponent, h } from 'vue'

const warned = new Set<string>()

function warnRemoved(name: string, instead: string) {
  if (!import.meta.dev || warned.has(name)) return
  warned.add(name)
  // eslint-disable-next-line no-console -- one-time removal notice, dev only
  console.warn(`[navigation] <${name}> was removed and is a fallback now. Use ${instead}.`)
}

const siteWords = (name: string, key: 'titleWords' | 'subtitleWords', instead: string) =>
  defineComponent({
    name,
    setup() {
      warnRemoved(name, instead)
      const site = useSite()
      return () => site[key].map((word) => h('span', { class: 'site-word' }, word))
    },
  })

const LinksNamed = defineComponent({
  name: 'LinksNamed',
  props: {
    name: { type: String, required: true },
    params: { type: Object as PropType<Record<string, string>>, default: undefined },
    query: { type: Object as PropType<Record<string, string>>, default: undefined },
    variant: { type: String, default: undefined },
    color: { type: String as PropType<UiColors>, default: undefined },
  },
  setup(props, { slots }) {
    warnRemoved('LinksNamed', '<ULink :to="{ name }">')
    const colorClass = useColor(() => props.color, 'text')
    return () => {
      const { name, params = {}, query = {}, variant } = props
      // `name` is a plain string here, not one of the app's typed route names
      const to = { name, params, query } as unknown as LinkProps['to']
      return h(ULink, { to, variant, class: colorClass.value } as LinkProps, slots)
    }
  },
})

/**
 * Keeps old templates rendering now the components are gone. An app's own component with one of
 * these names still wins, because Nuxt resolves auto-imported components first.
 *
 * ponytail: registered globally, so these names have no template types. Delete this file in the
 * next major.
 */
export default defineNuxtPlugin({
  name: 'navigation:removed-components',
  setup({ vueApp }) {
    vueApp.component(
      'SiteTitle',
      siteWords('SiteTitle', 'titleWords', '<SiteLogo :stacked="false">')
    )
    vueApp.component(
      'SiteSubtitle',
      siteWords('SiteSubtitle', 'subtitleWords', 'useSite().subtitleWords')
    )
    vueApp.component('LinksNamed', LinksNamed)
  },
})
