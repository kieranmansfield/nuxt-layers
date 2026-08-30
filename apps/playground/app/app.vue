<script setup lang="ts">
  const { transitionName } = usePageTransition()
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage :transition="{ name: transitionName, mode: 'out-in' }" />
    </NuxtLayout>

    <ClientOnly>
      <div class="fixed top-4 right-4 z-60">
        <ThemePickerMenu />
      </div>
      <template #fallback>
        <div class="fixed top-4 right-4 z-60">
          <UButton color="neutral" variant="ghost" icon="i-lucide-swatch-book" />
        </div>
      </template>
    </ClientOnly>

    <UOverlayProvider />
  </UApp>
</template>
