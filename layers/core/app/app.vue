<script setup lang="ts">
const config = useAppConfig()
const coreLayer = config.coreLayer as { loading?: { enabled?: boolean } } | undefined
const loadingEnabled = coreLayer?.loading?.enabled !== false

console.log('[app.vue] loadingEnabled:', loadingEnabled)
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Loading screen for initial app load only - always render, let component control visibility -->
    <LoadingScreen v-if="loadingEnabled" />
  </div>
</template>
