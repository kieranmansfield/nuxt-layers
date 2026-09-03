<script setup lang="ts">
  import { computed, type CSSProperties } from 'vue'
  import { useLayoutAttrs } from '#layers/core/app/composables/useLayoutAttrs'

  import { useElementGrid } from '../composables/useElementGrid'
  import { useElementInteraction } from '../composables/useElementInteraction'
  import { useElementLayout } from '../composables/useElementLayout'
  import { useElementSizing } from '../composables/useElementSizing'
  import { useElementSurface } from '../composables/useElementSurface'
  import type { ElementProps } from '../types/element'

  const props = withDefaults(defineProps<ElementProps>(), {
    as: 'div',
  })

  const grid = computed(() => useElementGrid(props))

  const style = computed<CSSProperties>(() => ({
    ...useElementLayout(props),
    ...useLayoutAttrs(() => props).style.value,
    ...grid.value.style,
    ...useElementSizing(props),
    ...useElementSurface(props),
    ...useElementInteraction(props),
  }))
</script>

<template>
  <component :is="as" :style :class="grid.class">
    <slot />
  </component>
</template>

<style>
  /* stylelint-disable custom-property-pattern */
  /* Duplicated from Layout/Grid/Item.vue's .gi-placed rule (source of truth — keep in sync
     with it by hand). Not shared via import because it's a Vue SFC unscoped <style> block,
     which only ships to the page bundle when the owning component is actually rendered —
     Element.vue needs the rule available even on pages that never render LayoutGridItem. */
  .gi-placed {
    grid-row: var(--_rs, auto) / span var(--_re, 1);
    grid-column: var(--_cs, auto) / span var(--_ce, 1);
  }

  @media (width >= 48rem) {
    .gi-placed {
      grid-row: var(--_md-rs, var(--_rs, auto)) / span var(--_md-re, var(--_re, 1));
      grid-column: var(--_md-cs, var(--_cs, auto)) / span var(--_md-ce, var(--_ce, 1));
    }
  }

  @media (width >= 80rem) {
    .gi-placed {
      grid-row: var(--_lg-rs, var(--_md-rs, var(--_rs, auto))) / span
        var(--_lg-re, var(--_md-re, var(--_re, 1)));
      grid-column: var(--_lg-cs, var(--_md-cs, var(--_cs, auto))) / span
        var(--_lg-ce, var(--_md-ce, var(--_ce, 1)));
    }
  }
</style>
