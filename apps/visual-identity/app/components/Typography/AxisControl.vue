<script setup lang="ts">
  const { label, modelValue, min, max, step } = defineProps<{
    label: string
    modelValue: number
    min: number
    max: number
    step?: number
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: number]
  }>()

  function onSliderUpdate(v: number | undefined) {
    if (v !== undefined) emit('update:modelValue', v)
  }
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="w-28 shrink-0">
      <p class="text-xs font-medium text-default">{{ label }}</p>
      <p class="text-[10px] text-muted font-mono">{{ min }} – {{ max }}</p>
    </div>
    <USlider
      :model-value
      :min
      :max
      :step="step ?? 1"
      class="flex-1"
      @update:model-value="onSliderUpdate"
    />
    <div class="w-14 shrink-0 text-right">
      <span class="text-xs font-mono tabular-nums text-default">{{ modelValue }}</span>
    </div>
  </div>
</template>
