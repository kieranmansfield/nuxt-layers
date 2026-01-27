<template>
  <div>
    <p>error</p>
  </div>
</template>

<!-- <script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

// Determine if this is a 404 or other error
const is404 = computed(() => props.error?.statusCode === 404)

// Error details
const statusCode = computed(() => props.error?.statusCode || 500)
const message = computed(() => {
  if (is404.value) {
    return 'This page could not be found.'
  }
  return props.error?.message || 'An unexpected error occurred.'
})

// Error icon
const icon = computed(() => {
  if (is404.value) return 'i-lucide-file-question'
  return 'i-lucide-alert-triangle'
})

// Error title
const title = computed(() => {
  if (is404.value) return 'Page Not Found'
  return 'Something Went Wrong'
})

// Clear error and redirect home
const handleError = () => clearError({ redirect: '/' })

// Reload page
const reloadPage = () => {
  if (import.meta.client) {
    window.location.reload()
  }
}

// SEO
useSeoMeta({
  title: `${statusCode.value} - ${title.value}`,
  robots: 'noindex, nofollow',
})
</script> -->

<!-- <template>
  <div class="flex min-h-screen items-center justify-center p-4 md:p-8">
    <UContainer>
      <div class="mx-auto max-w-2xl">
        <UEmpty :icon :title size="xl">
          <template #description>
            <div class="space-y-2">
              <p class="text-[var(--ui-text-muted)]">{{ message }}</p>
              <code
                v-if="error?.statusMessage"
                class="block rounded bg-[var(--ui-bg-elevated)] px-2 py-1 text-sm"
              >
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
        </UEmpty> -->

<!-- Stack trace for development -->
<!-- <UCard v-if="error?.stack && import.meta.dev" class="mt-8">
          <template #header>
            <h3 class="text-sm font-semibold">Error Details (Development Only)</h3>
          </template>
          <pre class="overflow-x-auto text-xs">{{ error.stack }}</pre>
        </UCard>
      </div>
    </UContainer>
  </div>
</template> -->
