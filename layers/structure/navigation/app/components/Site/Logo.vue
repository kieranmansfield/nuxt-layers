<script setup lang="ts">
  import type { SiteLogoConfig, SiteLogoSize } from '../../types/nav'

  // The site wordmark from `site.title`, sized on the step scale. Look comes from `siteLogo` in
  // app.config; `ui` overrides per instance. Replaces the deprecated SiteTitle/SiteSubtitle.
  const {
    as = 'span',
    size = 'sm',
    stacked = undefined,
    ui = undefined,
  } = defineProps<{
    as?: string
    size?: SiteLogoSize
    /** One word per line. Defaults to `siteLogo.stacked`. */
    stacked?: boolean
    ui?: Partial<SiteLogoConfig['ui']>
  }>()

  const config = useAppConfig().siteLogo as SiteLogoConfig
  const site = useSite()
  const isStacked = computed(() => stacked ?? config.stacked)
</script>

<template>
  <component :is="as" :class="[ui?.root ?? config.ui.root, config.sizes[size]]">
    <slot :words="site.titleWords" :title="site.title">
      <span
        v-for="(word, i) in site.titleWords"
        :key="i"
        :class="[isStacked && 'block', ui?.word ?? config.ui.word]"
        >{{ word }}{{ !isStacked && i < site.titleWords.length - 1 ? ' ' : '' }}</span
      >
    </slot>
  </component>
</template>
