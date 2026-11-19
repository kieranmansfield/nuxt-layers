<script setup lang="ts">
  import type {
    BackgroundStyle,
    BrandColour,
    ColourScheme,
    ContrastLevel,
  } from '~/composables/useBrandState'
  import { generateScale } from '~/composables/useTailwindScale'
  import { mixOklch } from '~/utils/oklchMix'

  const { colours, scheme, contrast, backgroundStyle } = defineProps<{
    colours: BrandColour[]
    scheme: ColourScheme
    contrast: ContrastLevel
    backgroundStyle: BackgroundStyle
  }>()

  const dark = computed(() => scheme === 'dark')

  // Scale index offsets per scheme + contrast
  const indices = computed(() => {
    if (scheme === 'light') {
      if (contrast === 'high') return { bg: 0, text: 10, accent: 5 }
      return { bg: 0, text: 9, accent: 4 }
    }
    if (contrast === 'high') return { bg: 10, text: 0, accent: 4 }
    return { bg: 9, text: 1, accent: 4 }
  })

  const neutralBg = computed(() => {
    if (!dark.value) return contrast === 'high' ? '#ffffff' : '#fafafa'
    return contrast === 'high' ? '#080808' : '#121214'
  })

  const bg = computed(() => {
    const primary = colours.find((c) => c.role === 'primary')
    if (!primary || backgroundStyle === 'neutral') return neutralBg.value
    const scale = generateScale(primary.hex)
    const tinted = scale[indices.value.bg]?.hex ?? neutralBg.value
    if (backgroundStyle === 'tinted') return tinted
    return mixOklch(tinted, neutralBg.value, 0.5)
  })

  const textColour = computed(() => {
    const primary = colours.find((c) => c.role === 'primary')
    if (!primary) return dark.value ? '#f0f0f0' : '#111111'
    return (
      generateScale(primary.hex)[indices.value.text]?.hex ?? (dark.value ? '#f0f0f0' : '#111111')
    )
  })

  const accentColour = computed(() => {
    const primary = colours.find((c) => c.role === 'primary')
    if (!primary) return '#6366f1'
    return generateScale(primary.hex)[indices.value.accent]?.hex ?? primary.hex
  })

  const label = computed(() => {
    const s = scheme === 'dark' ? 'Dark' : 'Light'
    const c = contrast === 'high' ? 'High contrast' : 'Standard'
    return `${s} · ${c}`
  })
</script>

<template>
  <div
    class="overflow-hidden rounded-xl p-5"
    :class="scheme === 'light' ? 'border border-black/10' : ''"
    :style="{ backgroundColor: bg }"
  >
    <div class="mb-3 flex items-center gap-2">
      <div class="size-3 rounded-full" :style="{ backgroundColor: accentColour }" />
      <div class="h-2 w-16 rounded opacity-40" :style="{ backgroundColor: textColour }" />
    </div>
    <div class="mb-1.5 h-2 w-full rounded opacity-20" :style="{ backgroundColor: textColour }" />
    <div class="mb-4 h-2 w-3/4 rounded opacity-20" :style="{ backgroundColor: textColour }" />
    <div
      class="inline-block rounded-lg px-3 py-1.5 text-xs font-medium text-white"
      :style="{ backgroundColor: accentColour }"
    >
      Button
    </div>
    <p class="mt-3 text-[10px] font-medium opacity-40" :style="{ color: textColour }">
      {{ label }}
    </p>
  </div>
</template>
