<script setup lang="ts">
  import { formatHex, oklch, parse } from 'culori'

  import type {
    BackgroundStyle,
    BrandColour,
    ColourScheme,
    ContrastLevel,
  } from '~/composables/useBrandState'
  import { generateScale } from '~/composables/useTailwindScale'

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

  function mixOklch(hexA: string, hexB: string, t: number): string {
    const a = oklch(parse(hexA) ?? { mode: 'rgb', r: 1, g: 1, b: 1 })
    const b = oklch(parse(hexB) ?? { mode: 'rgb', r: 0, g: 0, b: 0 })
    if (!a || !b) return hexA
    return (
      formatHex({
        mode: 'oklch',
        l: a.l + (b.l - a.l) * t,
        c: (a.c ?? 0) + ((b.c ?? 0) - (a.c ?? 0)) * t,
        h: (a.h ?? 0) + ((b.h ?? 0) - (a.h ?? 0)) * t,
      }) ?? hexA
    )
  }

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
    class="rounded-xl p-5 overflow-hidden"
    :class="scheme === 'light' ? 'border border-black/10' : ''"
    :style="{ backgroundColor: bg }"
  >
    <div class="flex items-center gap-2 mb-3">
      <div class="size-3 rounded-full" :style="{ backgroundColor: accentColour }" />
      <div class="h-2 rounded w-16 opacity-40" :style="{ backgroundColor: textColour }" />
    </div>
    <div class="h-2 rounded w-full mb-1.5 opacity-20" :style="{ backgroundColor: textColour }" />
    <div class="h-2 rounded w-3/4 mb-4 opacity-20" :style="{ backgroundColor: textColour }" />
    <div
      class="inline-block px-3 py-1.5 rounded-lg text-xs font-medium text-white"
      :style="{ backgroundColor: accentColour }"
    >
      Button
    </div>
    <p class="text-[10px] mt-3 font-medium opacity-40" :style="{ color: textColour }">
      {{ label }}
    </p>
  </div>
</template>
