<script setup lang="ts">
  import type { PortfolioColor } from '../../types/content'

  const { name, colors } = defineProps<{
    name?: string
    colors: PortfolioColor[]
  }>()

  const grounds = [
    { label: 'On white', bg: '#ffffff' },
    { label: 'On black', bg: '#000000' },
  ]
</script>

<template>
  <div class="space-y-3">
    <p v-if="name" class="text-highlighted text-lg font-medium tracking-tight">{{ name }}</p>
    <div class="border-default/20 flex h-16 overflow-hidden rounded-lg border">
      <div
        v-for="color in colors"
        :key="color.value"
        class="flex-1"
        :style="{ backgroundColor: color.value }"
        :title="`${color.name} ${color.value}`"
      />
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      <div
        v-for="ground in grounds"
        :key="ground.bg"
        class="border-default/20 rounded-lg border p-4"
        :style="{ backgroundColor: ground.bg }"
      >
        <p
          class="mb-3 font-mono text-xs tracking-widest uppercase"
          :style="{ color: ground.bg === '#ffffff' ? '#00000080' : '#ffffff80' }"
        >
          {{ ground.label }}
        </p>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="color in colors"
            :key="color.value"
            class="flex items-center gap-2"
            :style="{ color: ground.bg === '#ffffff' ? '#000000cc' : '#ffffffe6' }"
          >
            <span
              class="size-8 rounded-full border border-current/20"
              :style="{ backgroundColor: color.value }"
            />
            <span class="font-mono text-xs uppercase">{{ color.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
