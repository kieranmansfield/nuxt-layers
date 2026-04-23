<script setup lang="ts">
const props = defineProps<{
  label: string
  min: number
  max: number
  step: number
}>()

const model = defineModel<number>()
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="text-xs text-white/50 w-24 shrink-0 leading-none">{{ label }}</span>
    <input
      v-model.number="model"
      type="range"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      class="flex-1 h-0.5 accent-violet-400 cursor-pointer"
    />
    <span class="text-xs text-white/30 w-10 text-right tabular-nums">{{ Number(model).toFixed(2) }}</span>
  </div>
</template>
