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
  <nav class="flex flex-col h-full bg-default overflow-y-auto">
    <div class="px-4 py-4 border-b border-default shrink-0">
      <p class="text-xs font-semibold tracking-widest text-muted uppercase">Visual Identity</p>
    </div>

    <div class="flex-1 py-2 px-2 overflow-y-auto">
      <UNavigationMenu orientation="vertical" :items="navItems" highlight class="w-full" />
    </div>

    <div class="shrink-0 px-2 pb-4 pt-3 border-t border-default">
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
      <p class="text-sm text-muted">
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
