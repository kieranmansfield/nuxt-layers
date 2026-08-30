<script setup lang="ts">
  import type { NuxtError } from '#app'

  const { error } = defineProps<{ error: NuxtError }>()

  const is404 = computed(() => error?.statusCode === 404)
  const statusCode = computed(() => error?.statusCode || 500)
  const title = computed(() => (is404.value ? 'Page Not Found' : 'Something Went Wrong'))
  const message = computed(() =>
    is404.value ? 'This page could not be found.' : error?.message || 'An unexpected error occurred.'
  )
  const icon = computed(() => (is404.value ? 'i-lucide-file-question' : 'i-lucide-alert-triangle'))

  const isDev = import.meta.dev

  const handleError = () => clearError({ redirect: '/' })
  const reloadPage = () => {
    if (import.meta.client) window.location.reload()
  }

  useSeoMeta({
    title: `${statusCode.value} - ${title.value}`,
    robots: 'noindex, nofollow',
  })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4 md:p-8">
    <UContainer>
      <div class="mx-auto max-w-2xl">
        <UEmpty :icon :title size="xl">
          <template #description>
            <div class="space-y-2">
              <p class="text-muted">{{ message }}</p>
              <code v-if="error?.statusMessage" class="block rounded bg-elevated px-2 py-1 text-sm">
                {{ error.statusMessage }}
              </code>
            </div>
          </template>

          <template #actions>
            <div class="flex flex-wrap justify-center gap-2">
              <UButton
                label="Go Home"
                icon="i-lucide-home"
                color="primary"
                variant="solid"
                @click="handleError"
              />
              <UButton
                v-if="!is404"
                label="Try Again"
                icon="i-lucide-refresh-cw"
                color="neutral"
                variant="outline"
                @click="reloadPage"
              />
            </div>
          </template>
        </UEmpty>

        <UCard v-if="error?.stack && isDev" class="mt-8">
          <template #header>
            <h3 class="text-sm font-semibold">Error Details (Development Only)</h3>
          </template>
          <pre class="overflow-x-auto text-xs">{{ error.stack }}</pre>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
