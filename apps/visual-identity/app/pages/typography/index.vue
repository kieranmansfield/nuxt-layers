<script setup lang="ts">
  import { DEFAULT_AXES, FONT_AXIS_META, type FontAxes } from '~/composables/useBrandState'

  const { state, updateFontAxis } = useBrandState()

  const activeFont = ref(state.value.typography[0]?.id ?? 'heading')

  const currentFont = computed(
    () => state.value.typography.find((f) => f.id === activeFont.value) ?? state.value.typography[0]
  )

  const previewText = ref('Aa')
  const previewSize = ref(220)

  // Computed directly from state so Vue tracks each axis property
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
</script>

<template>
  <div class="flex h-full overflow-hidden">
    <!-- LEFT: axes panel -->
    <div class="w-96 shrink-0 border-r border-(--ui-border) flex flex-col overflow-hidden">
      <!-- Sticky header -->
      <div class="p-5 border-b border-(--ui-border) bg-(--ui-bg) shrink-0">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-lg font-semibold text-(--ui-text)">Font & Axes</h1>
            <p class="text-xs text-(--ui-text-muted)">Roboto Flex variable axes</p>
          </div>
          <UButton variant="ghost" size="xs" color="neutral" @click="resetAxes"> Reset </UButton>
        </div>
        <!-- Font role tabs -->
        <div class="flex gap-1.5 flex-wrap">
          <UButton
            v-for="font in state.typography"
            :key="font.id"
            :variant="activeFont === font.id ? 'solid' : 'outline'"
            size="xs"
            class="capitalize"
            @click="activeFont = font.id"
          >
            {{ font.role }}
          </UButton>
        </div>
      </div>

      <!-- Scrollable axis controls -->
      <div class="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        <template v-if="currentFont">
          <TypographyAxisControl
            v-for="(meta, axis) in FONT_AXIS_META"
            :key="axis"
            :label="meta.label"
            :model-value="currentFont.axes[axis as keyof FontAxes]"
            :min="meta.min"
            :max="meta.max"
            :step="meta.step"
            @update:model-value="onAxisUpdate(axis as keyof FontAxes, $event)"
          />
        </template>
      </div>
    </div>

    <!-- RIGHT: preview -->
    <div class="flex-1 flex flex-col overflow-hidden bg-(--ui-bg-elevated)">
      <!-- Big preview area -->
      <div class="flex-1 flex items-center justify-center overflow-hidden px-8 select-none">
        <div class="text-(--ui-text) transition-all duration-75" :style="previewStyle">
          {{ previewText || 'Aa' }}
        </div>
      </div>

      <!-- Bottom controls bar -->
      <div class="shrink-0 border-t border-(--ui-border) bg-(--ui-bg) px-6 py-4">
        <div class="flex items-center gap-6 mb-3">
          <UInput v-model="previewText" class="w-32" size="sm" placeholder="Aa" />
          <div class="flex items-center gap-3 flex-1">
            <span class="text-xs text-(--ui-text-muted) shrink-0 tabular-nums w-12 text-right">
              {{ previewSize }}px
            </span>
            <USlider v-model="previewSize" :min="32" :max="400" class="flex-1" />
          </div>
        </div>
        <p class="text-[10px] font-mono text-(--ui-text-muted) break-all leading-relaxed">
          {{ variationSettingsString }}
        </p>
      </div>
    </div>
  </div>
</template>
