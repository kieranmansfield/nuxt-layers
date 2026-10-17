<script setup lang="ts">
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
  const colorClass = useColor(color, 'text')
  // `name` is a plain string here, not one of the app's typed route names
  const to = computed(
    () =>
      ({ name, params: params ?? {}, query: query ?? {} }) as unknown as NonNullable<
        Parameters<typeof navigateTo>[0]
      >
  )
</script>

<template>
  <ULink :to="to" :variant :class="colorClass" v-bind="$attrs">
    <slot />
  </ULink>
</template>
