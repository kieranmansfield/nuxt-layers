<script setup lang="ts">
  import type { TrackConfig, TrackSegment } from '#layers/grid/types/tracks'

  definePageMeta({ layout: false })

  const { resolve, toColumnsCss } = useGridTracks()

  const activePresetName = ref<'swiss' | 'editorial' | 'custom'>('custom')
  const customSegments = ref<TrackSegment[]>([{ size: 1 }, { size: 1 }, { size: 2 }])

  const activeConfig = computed<TrackConfig>(() => {
    if (activePresetName.value === 'custom') {
      return { columns: customSegments.value }
    }
    return resolve(activePresetName.value)
  })

  const columnsCss = computed(() => toColumnsCss(activeConfig.value))

  const isCustom = computed(() => activePresetName.value === 'custom')

  function addSegment() {
    customSegments.value.push({ size: 1 })
  }

  function removeSegment(index: number) {
    customSegments.value.splice(index, 1)
  }

  function moveSegment(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= customSegments.value.length) return
    const segments = customSegments.value
    ;[segments[index], segments[target]] = [segments[target]!, segments[index]!]
  }

  function updateSize(index: number, value: number) {
    customSegments.value[index]!.size = Math.max(1, value)
  }

  function updateLineStart(index: number, value: string) {
    customSegments.value[index]!.lineStart = value || undefined
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
  <div style="padding: 2rem; display: grid; gap: 2rem">
    <h1>Grid builder</h1>

    <div style="display: flex; gap: 0.5rem">
      <button type="button" @click="activePresetName = 'swiss'">Swiss (18 equal)</button>
      <button type="button" @click="activePresetName = 'editorial'">Editorial</button>
      <button type="button" @click="activePresetName = 'custom'">Custom</button>
    </div>

    <section v-if="isCustom" style="display: grid; gap: 0.5rem">
      <div
        v-for="(segment, index) in customSegments"
        :key="index"
        style="display: flex; gap: 0.5rem; align-items: center"
      >
        <span>#{{ index + 1 }}</span>
        <label>
          size
          <input
            type="number"
            min="1"
            :value="segment.size"
            @input="updateSize(index, Number(($event.target as HTMLInputElement).value))"
          />
        </label>
        <label>
          lineStart
          <input
            type="text"
            :value="segment.lineStart ?? ''"
            @input="updateLineStart(index, ($event.target as HTMLInputElement).value)"
          />
        </label>
        <label>
          lineEnd
          <input
            type="text"
            :value="segment.lineEnd ?? ''"
            @input="updateLineEnd(index, ($event.target as HTMLInputElement).value)"
          />
        </label>
        <button type="button" @click="moveSegment(index, -1)">↑</button>
        <button type="button" @click="moveSegment(index, 1)">↓</button>
        <button type="button" @click="removeSegment(index)">Remove</button>
      </div>
      <button type="button" @click="addSegment">Add segment</button>
    </section>

    <section>
      <h2>Preview</h2>
      <div class="grid-tracks" :style="{ gridTemplateColumns: columnsCss }">
        <div
          v-for="(segment, index) in activeConfig.columns"
          :key="index"
          style="border: 1px solid currentColor; padding: 0.5rem; text-align: center"
        >
          {{ segment.size }}fr
        </div>
      </div>
    </section>

    <section v-if="isCustom">
      <h2>Output — paste into app.config.ts as a new preset</h2>
      <pre><code>{{ outputCode }}</code></pre>
    </section>
  </div>
</template>
