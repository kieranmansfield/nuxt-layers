<script setup lang="ts">
  const { min, max, step } = defineProps<{
    label: string
    min: number
    max: number
    step: number
  }>()

  const model = defineModel<number>()
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="text-highlighted/50 w-24 shrink-0 text-xs leading-none">{{ label }}</span>
    <input
      v-model.number="model"
      type="range"
      :min
      :max
      :step
      class="h-0.5 flex-1 cursor-pointer accent-violet-400"
    />
    <span class="text-highlighted/30 w-10 text-right text-xs tabular-nums">{{
      Number(model).toFixed(2)
    }}</span>
  </div>
</template>
