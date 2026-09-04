<script setup lang="ts">
  definePageMeta({ layout: false })

  const { resolve, toColumnsCss } = useGridTracks()

  const swissConfig = resolve('swiss')
  const columnsCss = toColumnsCss(swissConfig)
</script>

<template>
  <div style="padding: 2rem; display: grid; gap: 1.5rem">
    <h1>Layout: Swiss Grid</h1>
    <p style="font-size: 0.875rem; opacity: 0.75">
      Built from the <code>grid</code> layer's <code>swiss</code> preset (18 equal columns) via
      <code>useGridTracks()</code>. Try the full builder at
      <NuxtLink to="/grid-builder" style="text-decoration: underline">/grid-builder</NuxtLink>.
    </p>

    <div style="overflow-x: auto; max-width: 100%">
      <div class="grid-tracks" :style="{ gridTemplateColumns: columnsCss }">
        <div
          v-for="(segment, index) in swissConfig.columns"
          :key="index"
          style="border: 1px solid currentColor; padding: 0.5rem; text-align: center"
        >
          {{ segment.size }}fr
        </div>
      </div>
    </div>
  </div>
</template>
