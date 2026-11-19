<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  const { resetState } = useBrandState()
  const confirmOpen = ref(false)

  function handleClear() {
    resetState()
    confirmOpen.value = false
  }

  // Array-of-arrays groups nav items; type:'label' renders section headers.
  // UNavigationMenu handles active state automatically via NuxtLink.
  const navItems: NavigationMenuItem[][] = [
    [
      { label: 'Colour', type: 'label' },
      { label: 'Foundation', icon: 'i-lucide-pipette', to: '/colour/foundation' },
      { label: 'Harmony', icon: 'i-lucide-circle-dot', to: '/colour/harmony' },
      { label: 'Scales', icon: 'i-lucide-layers', to: '/colour/scales' },
      { label: 'Modes', icon: 'i-lucide-sun-moon', to: '/colour/modes' },
      { label: 'Themes', icon: 'i-lucide-swatch-book', to: '/colour/themes' },
    ],
    [
      { label: 'Typography', type: 'label' },
      { label: 'Font & Axes', icon: 'i-lucide-type', to: '/typography', exact: true },
      { label: 'Scale', icon: 'i-lucide-ruler', to: '/typography/scale' },
    ],
    [{ label: 'Export', icon: 'i-lucide-download', to: '/export' }],
  ]
</script>

<template>
  <nav class="bg-default flex h-full flex-col overflow-y-auto">
    <div class="border-default shrink-0 border-b px-4 py-4">
      <p class="text-muted text-xs font-semibold tracking-widest uppercase">Visual Identity</p>
    </div>

    <div class="flex-1 overflow-y-auto px-2 py-2">
      <UNavigationMenu orientation="vertical" :items="navItems" highlight class="w-full" />
    </div>

    <div class="border-default shrink-0 border-t px-2 pt-3 pb-4">
      <UButton
        icon="i-lucide-trash-2"
        variant="ghost"
        color="error"
        size="sm"
        class="w-full justify-start"
        @click="() => (confirmOpen = true)"
      >
        Clear all
      </UButton>
    </div>
  </nav>

  <UModal v-model:open="confirmOpen" title="Clear everything?">
    <template #body>
      <p class="text-muted text-sm">
        This will remove all colours, typography settings, and saved state. This cannot be undone.
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" color="neutral" @click="() => (confirmOpen = false)"
          >Cancel</UButton
        >
        <UButton color="error" @click="handleClear">Clear everything</UButton>
      </div>
    </template>
  </UModal>
</template>
