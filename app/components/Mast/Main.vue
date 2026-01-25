<script setup lang="ts">
defineProps<{
  umain: Ref
}>()
</script>

<template>
  <UMain :ref="umain">
    <slot />
  </UMain>
</template>
