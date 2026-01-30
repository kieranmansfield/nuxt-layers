---
paths:
  - "**/*.vue"
---

# Vue Component Conventions

## Script Setup
- Always use `<script setup lang="ts">`
- Use type-based declarations with destructuring

## Block Order
`<script>` → `<template>` → `<style>`

## Macro Ordering
`defineProps` → `defineEmits` → `defineExpose` → `withDefaults`

## Component Names
- Use PascalCase in templates

## Example

```vue
<script setup lang="ts">
const { title, count = 0 } = defineProps<{
  title: string
  count?: number
}>()

const emit = defineEmits<{
  update: [value: string]
}>()
</script>
```
