<script setup lang="ts">
  import type { TrackConfig, TrackSegment } from '#layers/grid/types/tracks'

  definePageMeta({ layout: false })

  const { resolve, toColumnsCss } = useGridTracks()

  type PresetName = 'editorial' | 'sidebar' | 'magazine' | 'holy-grail' | 'custom'

  const presetOptions: { label: string; value: PresetName }[] = [
    { label: 'Editorial', value: 'editorial' },
    { label: 'Sidebar', value: 'sidebar' },
    { label: 'Magazine', value: 'magazine' },
    { label: 'Holy grail', value: 'holy-grail' },
    { label: 'Custom', value: 'custom' },
  ]

  const activePresetName = ref<PresetName>('custom')

  // The shared unit that double/half operate against — independent of whatever
  // value a segment's own `size` currently holds, so repeated clicks are
  // predictable (always "2 units" / "half a unit") rather than compounding.
  const unitSize = ref(1)
  const columnCount = ref(3)
  const customSegments = ref<TrackSegment[]>([{ size: 1 }, { size: 1 }, { size: 2 }])

  const activeConfig = computed<TrackConfig>(() => {
    if (activePresetName.value === 'custom') {
      return { columns: customSegments.value }
    }
    return resolve(activePresetName.value)
  })

  const columnsCss = computed(() => toColumnsCss(activeConfig.value))

  const isCustom = computed(() => activePresetName.value === 'custom')

  function applyColumnCount() {
    const next = Math.max(1, Math.round(columnCount.value))
    columnCount.value = next
    customSegments.value = Array.from({ length: next }, () => ({ size: unitSize.value }))
  }

  function addSegment() {
    customSegments.value.push({ size: unitSize.value })
    columnCount.value = customSegments.value.length
  }

  function removeSegment(index: number) {
    customSegments.value.splice(index, 1)
    columnCount.value = customSegments.value.length
  }

  function moveSegment(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= customSegments.value.length) return
    const segments = customSegments.value
    ;[segments[index], segments[target]] = [segments[target]!, segments[index]!]
  }

  function doubleSize(index: number) {
    customSegments.value[index]!.size = unitSize.value * 2
  }

  function halveSize(index: number) {
    customSegments.value[index]!.size = unitSize.value / 2
  }

  // UInput's v-model type is `AcceptableValue` (string | number | ...), which doesn't
  // accept TrackSegment's `string | string[] | undefined` — this UI only ever writes
  // plain strings, so read/write through these instead of a direct v-model.
  function lineStartValue(segment: TrackSegment): string {
    return typeof segment.lineStart === 'string' ? segment.lineStart : ''
  }

  function updateLineStart(index: number, value: string) {
    customSegments.value[index]!.lineStart = value || undefined
  }

  function lineEndValue(segment: TrackSegment): string {
    return typeof segment.lineEnd === 'string' ? segment.lineEnd : ''
  }

  function updateLineEnd(index: number, value: string) {
    customSegments.value[index]!.lineEnd = value || undefined
  }

  const outputCode = computed(() => {
    const lines = customSegments.value.map((segment) => {
      const parts = [`size: ${segment.size}`]
      if (segment.lineStart) parts.push(`lineStart: '${segment.lineStart}'`)
      if (segment.lineEnd) parts.push(`lineEnd: '${segment.lineEnd}'`)
      return `    { ${parts.join(', ')} },`
    })
    return `{\n  name: 'custom',\n  columns: [\n${lines.join('\n')}\n  ],\n}`
  })
</script>

<template>
  <div class="max-w-5xl mx-auto p-8 space-y-8">
    <div class="space-y-1">
      <h1 class="text-2xl font-bold">Grid builder</h1>
      <p class="text-sm text-muted">
        Swiss grid preset now lives at
        <ULink to="/layout-swiss" class="underline">/layout-swiss</ULink>
        .
      </p>
    </div>

    <div class="flex gap-2 flex-wrap">
      <UButton
        v-for="option in presetOptions"
        :key="option.value"
        :label="option.label"
        :variant="activePresetName === option.value ? 'solid' : 'outline'"
        @click="activePresetName = option.value"
      />
    </div>

    <UCard v-if="isCustom">
      <template #header>
        <h2 class="font-semibold">Segments</h2>
      </template>

      <div class="space-y-4">
        <div class="flex gap-4 items-end flex-wrap">
          <UFormField label="Grid unit (fr)">
            <UInput v-model.number="unitSize" type="number" min="0.5" step="0.5" class="w-24" />
          </UFormField>
          <UFormField label="Number of columns">
            <div class="flex gap-2">
              <UInput v-model.number="columnCount" type="number" min="1" class="w-24" />
              <UButton label="Apply" variant="soft" @click="applyColumnCount" />
            </div>
          </UFormField>
        </div>

        <div class="space-y-2">
          <div
            v-for="(segment, index) in customSegments"
            :key="index"
            class="flex gap-2 items-end flex-wrap p-2 rounded-lg border border-default"
          >
            <UBadge :label="`#${index + 1}`" variant="subtle" color="neutral" />

            <UFormField label="size">
              <UInput
                v-model.number="segment.size"
                type="number"
                min="0.5"
                step="0.5"
                class="w-20"
              />
            </UFormField>

            <UButtonGroup>
              <UButton
                label="×2"
                size="xs"
                variant="soft"
                title="Set to double the grid unit"
                @click="doubleSize(index)"
              />
              <UButton
                label="½"
                size="xs"
                variant="soft"
                title="Set to half the grid unit"
                @click="halveSize(index)"
              />
            </UButtonGroup>

            <UFormField label="lineStart">
              <UInput
                :model-value="lineStartValue(segment)"
                class="w-32"
                @update:model-value="(v) => updateLineStart(index, String(v ?? ''))"
              />
            </UFormField>
            <UFormField label="lineEnd">
              <UInput
                :model-value="lineEndValue(segment)"
                class="w-32"
                @update:model-value="(v) => updateLineEnd(index, String(v ?? ''))"
              />
            </UFormField>

            <UButtonGroup>
              <UButton
                icon="i-lucide-arrow-up"
                size="xs"
                variant="ghost"
                color="neutral"
                @click="moveSegment(index, -1)"
              />
              <UButton
                icon="i-lucide-arrow-down"
                size="xs"
                variant="ghost"
                color="neutral"
                @click="moveSegment(index, 1)"
              />
              <UButton
                icon="i-lucide-trash-2"
                size="xs"
                variant="ghost"
                color="error"
                @click="removeSegment(index)"
              />
            </UButtonGroup>
          </div>

          <UButton
            label="Add segment"
            icon="i-lucide-plus"
            variant="outline"
            block
            @click="addSegment"
          />
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold">Preview</h2>
      </template>

      <div class="overflow-x-auto max-w-full">
        <div class="grid-tracks gap-2" :style="{ gridTemplateColumns: columnsCss }">
          <div
            v-for="(segment, index) in activeConfig.columns"
            :key="index"
            class="border border-default rounded-md p-2 text-center text-sm"
          >
            {{ segment.size }}fr
          </div>
        </div>
      </div>
    </UCard>

    <UCard v-if="isCustom">
      <template #header>
        <h2 class="font-semibold">Output — paste into app.config.ts as a new preset</h2>
      </template>
      <pre class="text-sm overflow-x-auto"><code>{{ outputCode }}</code></pre>
    </UCard>
  </div>
</template>
