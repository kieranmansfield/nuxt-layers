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
  <div class="bg-default flex h-dvh flex-col overflow-hidden md:flex-row">
    <!-- Mobile header -->
    <header
      class="border-default bg-default flex h-14 shrink-0 items-center justify-between border-b px-4 md:hidden"
    >
      <p class="text-default text-sm font-semibold tracking-wide">Visual Identity</p>

      <UDrawer v-model:open="mobileNavOpen" direction="left" :handle="false">
        <UButton icon="i-lucide-menu" variant="ghost" color="neutral" size="sm" />
        <template #content>
          <div class="flex h-full w-64 flex-col">
            <BrandNav />
          </div>
        </template>
      </UDrawer>
    </header>

    <!-- Desktop sidebar -->
    <div class="border-default hidden w-56 shrink-0 flex-col border-r md:flex">
      <BrandNav />
    </div>

    <!-- Page content -->
    <main class="min-h-0 flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
