<script setup lang="ts">
  import { formatHex, oklch, parse } from 'culori'

  import type { BackgroundStyle, BrandColour } from '~/composables/useBrandState'
  import { generateScale } from '~/composables/useTailwindScale'

  const { colours, mode, backgroundStyle } = defineProps<{
    colours: BrandColour[]
    mode: 'light-only' | 'dark-only' | 'both'
    backgroundStyle: BackgroundStyle
  }>()

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

  function getBg(dark: boolean): string {
    const neutral = dark ? '#121214' : '#fafafa'
    const primary = colours.find((c) => c.role === 'primary')
    if (!primary || backgroundStyle === 'neutral') return neutral

    const scale = generateScale(primary.hex)
    const tinted = dark ? (scale[10]?.hex ?? neutral) : (scale[0]?.hex ?? neutral)

    if (backgroundStyle === 'tinted') return tinted
    // blended: 50% mix of tinted and neutral in Oklch
    return mixOklch(tinted, neutral, 0.5)
  }

  function getTextShade(dark: boolean): string {
    const primary = colours.find((c) => c.role === 'primary')
    if (!primary) return dark ? '#f0f0f0' : '#111111'
    const scale = generateScale(primary.hex)
    return dark ? (scale[1]?.hex ?? '#f0f0f0') : (scale[9]?.hex ?? '#111111')
  }

  function getAccentShade(): string {
    const primary = colours.find((c) => c.role === 'primary')
    if (!primary) return '#6366f1'
    return generateScale(primary.hex)[4]?.hex ?? primary.hex
  }
</script>

<template>
  <div class="flex gap-3">
    <!-- Light preview -->
    <div
      v-if="mode !== 'dark-only'"
      class="flex-1 rounded-xl p-5 border border-black/10 overflow-hidden"
      :style="{ backgroundColor: getBg(false) }"
    >
      <div class="flex items-center gap-2 mb-3">
        <div class="size-3 rounded-full" :style="{ backgroundColor: getAccentShade() }" />
        <div
          class="h-2 rounded w-16 opacity-40"
          :style="{ backgroundColor: getTextShade(false) }"
        />
      </div>
      <div
        class="h-2 rounded w-full mb-1.5 opacity-20"
        :style="{ backgroundColor: getTextShade(false) }"
      />
      <div
        class="h-2 rounded w-3/4 mb-4 opacity-20"
        :style="{ backgroundColor: getTextShade(false) }"
      />
      <div
        class="inline-block px-3 py-1.5 rounded-lg text-xs text-white font-medium"
        :style="{ backgroundColor: getAccentShade() }"
      >
        Button
      </div>
      <p class="text-[10px] mt-3 font-medium opacity-40" :style="{ color: getTextShade(false) }">
        Light
      </p>
    </div>

    <!-- Dark preview -->
    <div
      v-if="mode !== 'light-only'"
      class="flex-1 rounded-xl p-5 overflow-hidden"
      :style="{ backgroundColor: getBg(true) }"
    >
      <div class="flex items-center gap-2 mb-3">
        <div class="size-3 rounded-full" :style="{ backgroundColor: getAccentShade() }" />
        <div class="h-2 rounded w-16 opacity-40" :style="{ backgroundColor: getTextShade(true) }" />
      </div>
      <div
        class="h-2 rounded w-full mb-1.5 opacity-20"
        :style="{ backgroundColor: getTextShade(true) }"
      />
      <div
        class="h-2 rounded w-3/4 mb-4 opacity-20"
        :style="{ backgroundColor: getTextShade(true) }"
      />
      <div
        class="inline-block px-3 py-1.5 rounded-lg text-xs text-white font-medium"
        :style="{ backgroundColor: getAccentShade() }"
      >
        Button
      </div>
      <p class="text-[10px] mt-3 font-medium opacity-40" :style="{ color: getTextShade(true) }">
        Dark
      </p>
    </div>
  </div>
</template>
