<script setup lang="ts">
  import type { LinkProps } from '@nuxt/ui'
  import type { UiColors } from '#layers/typography/types/colors'

  defineOptions({ inheritAttrs: false })

  const {
    name,
    params = undefined,
    query = undefined,
    variant = undefined,
    color = undefined,
  } = defineProps<{
    name: string
    params?: Record<string, string>
    query?: Record<string, string>
    variant?: string
    color?: UiColors
  }>()

  /**
   * @deprecated Thin wrapper over `ULink` — use `<ULink :to="{ name, params, query }">`.
   * Unused in this repo and KMCOMv5; remove in the next major.
   */
  if (import.meta.dev)
    // eslint-disable-next-line no-console -- one-time deprecation notice, dev only
    console.warn('[navigation] <LinksNamed> is deprecated — use <ULink :to="{ name }">.')

  const colorClass = useColor(() => color, 'text')
  // `name` is a plain string here, not one of the app's typed route names
  const to = computed(
    () => ({ name, params: params ?? {}, query: query ?? {} }) as unknown as LinkProps['to']
  )
</script>

<template>
  <ULink :to :variant :class="colorClass" v-bind="$attrs">
    <slot />
  </ULink>
</template>
