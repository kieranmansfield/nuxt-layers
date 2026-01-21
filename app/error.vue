<script lang="ts" setup>
defineProps<{
  error: {
    statusCode?: number
    message?: string
  }
}>()
</script>

<template>
  <div>
    <h1>Error</h1>
    <p>{{ error?.statusCode }}</p>
    <p>{{ error?.message }}</p>
  </div>
</template>
