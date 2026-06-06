<script setup lang="ts">
const { open } = useMastNav()
const z = useGridConfig().useZIndex('dropdown')
</script>

<template>
  <button
    aria-label="Open navigation menu"
    class="fixed right-0 top-0 flex cursor-pointer items-center justify-center border-0 bg-transparent p-4"
    :style="{ zIndex: z }"
    @click="open"
  >
    <slot name="icon">
      <UIcon name="lucide:menu" class="size-7" />
    </slot>
  </button>
</template>
