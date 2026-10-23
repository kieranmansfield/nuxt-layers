<script setup lang="ts">
  // Positioning is the parent's call (e.g. `<MastNav class="fixed top-0 right-0" />`); the
  // z-index stays here so the trigger always sits on the dropdown layer.
  const { open } = useMastNav()
  const z = useGridConfig().useZIndex('dropdown')
</script>

<template>
  <button
    aria-label="Open navigation menu"
    class="flex cursor-pointer items-center justify-center border-0 bg-transparent p-4"
    :style="{ zIndex: z }"
    @click="() => open()"
  >
    <slot name="icon">
      <UIcon name="lucide:menu" class="size-7" />
    </slot>
  </button>
</template>
