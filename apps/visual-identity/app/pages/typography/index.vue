<script setup lang="ts">
  import { DEFAULT_AXES, FONT_AXIS_META, type FontAxes } from '~/composables/useBrandState'

  const { state, updateFontAxis } = useBrandState()

  const activeFont = ref(state.value.typography[0]?.id ?? 'heading')

  const currentFont = computed(
    () => state.value.typography.find((f) => f.id === activeFont.value) ?? state.value.typography[0]
  )

  const previewText = ref('Aa')
  const previewSize = ref(220)

  const variationSettingsString = computed(() => {
    const font = currentFont.value
    if (!font) return ''
    return (Object.keys(font.axes) as (keyof FontAxes)[])
      .map((k) => `'${k}' ${font.axes[k]}`)
      .join(', ')
  })

  const previewStyle = computed(() => ({
    fontFamily: `'${currentFont.value?.family ?? 'Roboto Flex'}', sans-serif`,
    fontVariationSettings: variationSettingsString.value,
    fontSize: `${previewSize.value}px`,
    lineHeight: 1,
  }))

  function resetAxes() {
    if (!currentFont.value) return
    for (const key of Object.keys(FONT_AXIS_META) as (keyof FontAxes)[]) {
      updateFontAxis(currentFont.value.id, key, DEFAULT_AXES[key])
    }
  }

  function onAxisUpdate(axis: keyof FontAxes, v: number | undefined) {
    if (!currentFont.value || v === undefined) return
    updateFontAxis(currentFont.value.id, axis, v)
  }

  const fontTabs = computed(() =>
    state.value.typography.map((f) => ({ label: f.role, value: f.id }))
  )
</script>

<template>
  <!--
    Mobile: preview pinned at top (h-52), axes scroll below.
    Desktop: axes panel left (w-96), preview right (flex-1).
  -->
  <div class="flex h-full flex-col overflow-hidden md:flex-row">
    <!-- Preview — top on mobile, right on desktop -->
    <div
      class="bg-elevated border-default flex h-80 flex-col overflow-hidden border-b md:order-2 md:h-full md:flex-1 md:border-b-0"
    >
      <div class="flex flex-1 items-center justify-center overflow-hidden px-6 py-8 select-none">
        <div class="text-default overflow-hidden transition-all duration-75" :style="previewStyle">
          {{ previewText || 'Aa' }}
        </div>
      </div>

      <div class="border-default bg-default shrink-0 border-t px-4 py-3">
        <div class="mb-2 flex items-center gap-3">
          <UInput v-model="previewText" class="w-24" size="sm" placeholder="Aa" />
          <div class="flex min-w-0 flex-1 items-center gap-2">
            <span class="text-muted w-12 shrink-0 text-right text-xs tabular-nums">
              {{ previewSize }}px
            </span>
            <USlider v-model="previewSize" :min="32" :max="400" class="min-w-0 flex-1" />
          </div>
        </div>
        <!-- Only shown on desktop where there's room -->
        <p class="text-muted hidden font-mono text-[10px] leading-relaxed break-all md:block">
          {{ variationSettingsString }}
        </p>
      </div>
    </div>

    <!-- Axes panel — bottom on mobile, left on desktop -->
    <div
      class="border-default flex min-h-0 flex-1 flex-col overflow-hidden md:order-1 md:w-96 md:flex-none md:border-r"
    >
      <!-- Header -->
      <div class="border-default bg-default shrink-0 border-b p-4 md:p-5">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h1 class="text-default text-base font-semibold">Font & Axes</h1>
            <p class="text-muted text-xs">Roboto Flex variable axes</p>
          </div>
          <UButton variant="ghost" size="xs" color="neutral" @click="resetAxes">Reset</UButton>
        </div>
        <!-- Font role tabs via UTabs -->
        <UTabs
          v-model="activeFont"
          :content="false"
          :items="fontTabs"
          size="sm"
          color="neutral"
          variant="pill"
          class="w-full"
        />
      </div>

      <!-- Scrollable axis controls -->
      <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-4 md:gap-4 md:p-5">
        <template v-if="currentFont">
          <TypographyAxisControl
            v-for="(meta, axis) in FONT_AXIS_META"
            :key="axis"
            :label="meta.label"
            :model-value="currentFont.axes[axis as keyof FontAxes]"
            :min="meta.min"
            :max="meta.max"
            :step="meta.step"
            @update:model-value="($event) => onAxisUpdate(axis as keyof FontAxes, $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>
