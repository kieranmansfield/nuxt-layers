import { _api } from '@iconify/vue'

// @nuxt/icon@2.5.0 wires `_api.setFetch(useRequestFetch().native)`, but this
// Nuxt/ofetch version doesn't expose `.native` on the request-scoped fetch,
// so every icon lookup gets `undefined` as its fetch fn and fails instantly.
// Re-point it at the global fetch after @nuxt/icon's own plugin has run.
export default defineNuxtPlugin({
  name: 'icon-fetch-fix',
  setup() {
    _api.setFetch(fetch)
  },
})
