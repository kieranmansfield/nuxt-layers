<script setup lang="ts">
  const mobileNavOpen = ref(false)
  const route = useRoute()

  // Close drawer on navigation
  watch(
    () => route.path,
    () => {
      mobileNavOpen.value = false
    }
  )
</script>

<template>
  <div class="flex flex-col md:flex-row h-dvh overflow-hidden bg-default">
    <!-- Mobile header -->
    <header
      class="md:hidden flex items-center justify-between px-4 h-14 border-b border-default shrink-0 bg-default"
    >
      <p class="text-sm font-semibold text-default tracking-wide">Visual Identity</p>

      <UDrawer v-model:open="mobileNavOpen" direction="left" :handle="false">
        <UButton icon="i-lucide-menu" variant="ghost" color="neutral" size="sm" />
        <template #content>
          <div class="w-64 h-full flex flex-col">
            <BrandNav />
          </div>
        </template>
      </UDrawer>
    </header>

    <!-- Desktop sidebar -->
    <div class="hidden md:flex flex-col w-56 shrink-0 border-r border-default">
      <BrandNav />
    </div>

    <!-- Page content -->
    <main class="flex-1 overflow-y-auto min-h-0">
      <slot />
    </main>
  </div>
</template>
