<script setup lang="ts">
  import type { NotFoundConfig } from '#layers/core/types/notFound'

  // App configuration
  const appConfig = useAppConfig()
  const config = computed(() => {
    const coreLayer = appConfig.coreLayer as { notFound?: NotFoundConfig } | undefined
    return (coreLayer?.notFound ?? {}) as NotFoundConfig
  })

  const route = useRoute()
  const router = useRouter()
  const attemptedPath = computed(() => route.path)

  const notFound = computed(() => resolveNotFoundConfig(config.value, () => router.back()))
  const icon = computed(() => notFound.value.icon)
  const title = computed(() => notFound.value.title)
  const description = computed(() => notFound.value.description)
  const suggestions = computed(() => notFound.value.suggestions)

  // SEO & Status Code
  useSeoMeta({
    title: '404 - Page Not Found',
    description: 'The page you are looking for could not be found.',
    robots: 'noindex, nofollow',
  })

  // Set 404 status code
  if (import.meta.server) {
    setResponseStatus(404)
  }
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4 md:p-8">
    <UContainer>
      <div class="mx-auto max-w-2xl">
        <!-- Main 404 State -->
        <UEmpty :icon :title :description size="xl">
          <!-- Show attempted path -->
          <template v-if="notFound.showPath" #description>
            <p class="text-muted mb-2">
              {{ description }}
            </p>
            <code class="bg-elevated rounded px-2 py-1 text-sm">
              {{ attemptedPath }}
            </code>
          </template>

          <!-- Action Buttons -->
          <template #actions>
            <div class="flex flex-wrap justify-center gap-2">
              <UButton v-for="(action, index) in notFound.actions" :key="index" v-bind="action" />
            </div>
          </template>
        </UEmpty>

        <!-- Suggestions Section -->
        <div v-if="suggestions.links.length" class="mt-12">
          <h3 class="mb-4 text-center text-lg font-semibold">
            {{ suggestions.title }}
          </h3>

          <UCard>
            <div class="grid gap-2 md:grid-cols-2">
              <UButton
                v-for="(link, index) in suggestions.links"
                :key="index"
                :label="link.label"
                :to="link.to"
                :icon="link.icon"
                variant="ghost"
                block
                class="justify-start"
              />
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>
