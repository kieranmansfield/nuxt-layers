<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
import { fieldConfigs } from '../../config/fields'
import type { FieldSize, FieldType } from '../../types/fields'

const {
  type = 'text',
  name,
  label,
  required = false,
  size = 'md',
  placeholder,
  icon,
  class: className,
} = defineProps<{
  /** Field type determines validation, icon, and input behavior */
  type?: FieldType
  /** Field name for form binding */
  name: string
  /** Label text displayed above the field */
  label?: string
  /** Whether the field is required */
  required?: boolean
  /** Field size (xs, sm, md, lg, xl) */
  size?: FieldSize
  /** Override default placeholder */
  placeholder?: string
  /** Override default icon */
  icon?: string
  /** Additional CSS classes */
  class?: string
}>()

const model = defineModel<string | number>()

const config = computed(() => fieldConfigs[type])

const resolvedPlaceholder = computed(() => placeholder ?? config.value.placeholder)
const resolvedIcon = computed(() => icon ?? config.value.icon)

const isTextarea = computed(() => config.value.component === 'UTextarea')
const isNumber = computed(() => config.value.component === 'UInputNumber')

const currencyOptions = computed((): Intl.NumberFormatOptions | undefined => {
  if (config.value.format === 'currency') {
    return {
      style: 'currency' as const,
      currency: 'USD',
    }
  }
  return undefined
})
</script>

<template>
  <UFormField :name :label :required :size :class="className">
    <UTextarea
      v-if="isTextarea"
      v-model="model as string"
      :placeholder="resolvedPlaceholder"
      :size
      autoresize
    />

    <UInputNumber
      v-else-if="isNumber"
      v-model="model as number"
      :placeholder="resolvedPlaceholder"
      :leading-icon="resolvedIcon"
      :size
      :format-options="currencyOptions"
    />

    <UInput
      v-else
      v-model="model as string"
      :type="config.inputType"
      :inputmode="config.inputMode"
      :autocomplete="config.autocomplete"
      :placeholder="resolvedPlaceholder"
      :leading-icon="resolvedIcon"
      :size
    />
  </UFormField>
</template>
