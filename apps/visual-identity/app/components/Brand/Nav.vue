<script setup lang="ts">
const route = useRoute()
const { resetState } = useBrandState()

const sections = [
  {
    label: 'Colour',
    items: [
      { label: 'Foundation', to: '/colour/foundation', icon: 'i-lucide-pipette' },
      { label: 'Harmony', to: '/colour/harmony', icon: 'i-lucide-circle-dot' },
      { label: 'Scales', to: '/colour/scales', icon: 'i-lucide-layers' },
      { label: 'Modes', to: '/colour/modes', icon: 'i-lucide-sun-moon' },
    ],
  },
  {
    label: 'Typography',
    items: [
      { label: 'Font & Axes', to: '/typography', icon: 'i-lucide-type' },
      { label: 'Scale', to: '/typography/scale', icon: 'i-lucide-ruler' },
    ],
  },
]

const isActive = (to: string) => {
  if (to === '/typography') return route.path === '/typography'
  return route.path.startsWith(to)
}

const confirmOpen = ref(false)

function handleClear() {
  resetState()
  confirmOpen.value = false
}
</script>

<template>
  <nav
    class="vi-sidebar border-r border-(--ui-border) bg-(--ui-bg) flex flex-col gap-1 py-4 overflow-y-auto shrink-0"
  >
    <div class="px-4 pb-4 border-b border-(--ui-border) mb-2">
      <p class="text-xs font-semibold tracking-widest text-(--ui-text-muted) uppercase">
        Visual Identity
      </p>
    </div>

    <div v-for="section in sections" :key="section.label" class="mb-2">
      <p class="px-4 py-1 text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">
        {{ section.label }}
      </p>
      <NuxtLink
        v-for="item in section.items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-sm transition-colors"
        :class="
          isActive(item.to)
            ? 'bg-(--ui-primary) text-white font-medium'
            : 'text-(--ui-text-muted) hover:text-(--ui-text) hover:bg-(--ui-bg-elevated)'
        "
      >
        <UIcon :name="item.icon" class="size-4 shrink-0" />
        {{ item.label }}
      </NuxtLink>
    </div>

    <div class="mt-auto px-2 pt-3 border-t border-(--ui-border) flex flex-col gap-1">
      <NuxtLink
        to="/export"
        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full"
        :class="
          route.path === '/export'
            ? 'bg-(--ui-primary) text-white font-medium'
            : 'text-(--ui-text-muted) hover:text-(--ui-text) hover:bg-(--ui-bg-elevated)'
        "
      >
        <UIcon name="i-lucide-download" class="size-4 shrink-0" />
        Export
      </NuxtLink>

      <button
        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
        @click="confirmOpen = true"
      >
        <UIcon name="i-lucide-trash-2" class="size-4 shrink-0" />
        Clear all
      </button>
    </div>
  </nav>

  <UModal v-model:open="confirmOpen" title="Clear everything?">
    <template #body>
      <p class="text-sm text-(--ui-text-muted)">
        This will remove all colours, typography settings, and saved state. This cannot be undone.
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" color="neutral" @click="confirmOpen = false">Cancel</UButton>
        <UButton color="error" @click="handleClear">Clear everything</UButton>
      </div>
    </template>
  </UModal>
</template>
