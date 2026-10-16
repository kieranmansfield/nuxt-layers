<script setup lang="ts">
  const {
    label,
    modelValue,
    min,
    max,
    step = 1,
  } = defineProps<{
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
      <p class="text-default text-xs font-medium">{{ label }}</p>
      <p class="text-muted font-mono text-[10px]">{{ min }} – {{ max }}</p>
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
      <span class="text-default font-mono text-xs tabular-nums">{{ modelValue }}</span>
    </div>
  </div>
</template>
