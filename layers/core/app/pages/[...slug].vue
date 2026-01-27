<script setup lang="ts">
// Type definition for notFound config
interface NotFoundConfig {
  icon?: string
  title?: string
  description?: string
  showPath?: boolean
  showHomeButton?: boolean
  homeButtonLabel?: string
  homeButtonTo?: string
  showBackButton?: boolean
  backButtonLabel?: string
  actions?: Array<{
    label: string
    to?: string
    icon?: string
    color?: 'primary' | 'neutral' | 'error' | 'success'
    variant?: 'solid' | 'outline' | 'ghost' | 'soft'
    click?: () => void
  }>
  suggestions?: {
    enabled?: boolean
    title?: string
    links?: Array<{
      label: string
      to: string
      icon?: string
    }>
  }
}

// App configuration
const appConfig = useAppConfig()
const config = computed(() => {
  const coreLayer = appConfig.coreLayer as { notFound?: NotFoundConfig } | undefined
  return (coreLayer?.notFound ?? {}) as NotFoundConfig
})

// Route information
const route = useRoute()
const router = useRouter()
const attemptedPath = computed(() => route.path)

// Visual configuration with defaults
const icon = computed(() => config.value.icon || 'i-lucide-file-question')
const title = computed(() => config.value.title || 'Page Not Found')
const description = computed(
  () => config.value.description || "The page you're looking for doesn't exist or has been moved."
)

// Action buttons
const homeButton = computed(() => ({
  enabled: config.value.showHomeButton !== false,
  label: config.value.homeButtonLabel || 'Go Home',
  to: config.value.homeButtonTo || '/',
  icon: 'i-lucide-home',
}))

const backButton = computed(() => ({
  enabled: config.value.showBackButton !== false,
  label: config.value.backButtonLabel || 'Go Back',
  icon: 'i-lucide-arrow-left',
}))

// Combine all actions (built-in + custom from config)
const allActions = computed(() => {
  const actions = []

  if (homeButton.value.enabled) {
    actions.push({
      label: homeButton.value.label,
      to: homeButton.value.to,
      icon: homeButton.value.icon,
      color: 'primary',
      variant: 'solid',
    })
  }

  if (backButton.value.enabled) {
    actions.push({
      label: backButton.value.label,
      icon: backButton.value.icon,
      color: 'neutral',
      variant: 'outline',
      click: () => router.back(),
    })
  }

  return [...actions, ...(config.value.actions || [])]
})

// Suggestions configuration
const suggestions = computed(() => config.value.suggestions || {})
const showSuggestions = computed(
  () => suggestions.value.enabled && (suggestions.value.links?.length ?? 0) > 0
)

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
          <template v-if="config.showPath !== false" #description>
            <p class="mb-2 text-[var(--ui-text-muted)]">
              {{ description }}
            </p>
            <code class="rounded bg-[var(--ui-bg-elevated)] px-2 py-1 text-sm">
              {{ attemptedPath }}
            </code>
          </template>

          <!-- Action Buttons -->
          <template #actions>
            <div class="flex flex-wrap justify-center gap-2">
              <UButton
                v-for="(action, index) in allActions"
                :key="index"
                :label="action.label"
                :icon="action.icon"
                :to="action.to"
                :color="(action.color as any) || 'neutral'"
                :variant="(action.variant as any) || 'outline'"
                @click="action.click"
              />
            </div>
          </template>
        </UEmpty>

        <!-- Suggestions Section -->
        <div v-if="showSuggestions" class="mt-12">
          <h3 class="mb-4 text-center text-lg font-semibold">
            {{ suggestions.title || 'You might be looking for:' }}
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
