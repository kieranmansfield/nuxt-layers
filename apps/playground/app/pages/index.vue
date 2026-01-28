<script setup lang="ts">
useSeoMeta({
  title: 'Core Layer Playground',
  description: 'Testing the core layer functionality',
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8">
    <UContainer>
      <div class="text-center space-y-6">
        <div>
          <h1 class="text-5xl font-bold mb-3">Core Layer</h1>
          <p class="text-xl text-gray-500 dark:text-gray-400">
            Foundation layer for Nuxt applications
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <UButton
            to="/diagnostics"
            size="lg"
            icon="i-lucide-activity"
          >
            View Diagnostics
          </UButton>

          <UButton
            to="https://github.com/kieranmansfield/layer-core"
            target="_blank"
            size="lg"
            variant="outline"
            icon="i-lucide-github"
          >
            View on GitHub
          </UButton>
        </div>

        <UCard class="mt-8">
          <div class="text-left space-y-3">
            <h2 class="text-lg font-semibold">Features</h2>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                <span>App initialization & module registration</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                <span>Global error handling</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                <span>Feature & capability detection</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                <span>Device, browser & network detection</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                <span>Loading states & screens</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                <span>PWA support</span>
              </li>
            </ul>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
