<script setup lang="ts">
useSeoMeta({
  title: 'Nuxt Layers Playground',
  description: 'Testing the layers architecture',
})

const layers = [
  {
    name: 'Core',
    description: 'Foundation utilities, error handling, device detection, PWA support',
    loaded: true,
    icon: 'i-lucide-box',
    to: '/core',
    features: ['Browser Detection', 'Screen Info', 'Network Status', 'Feature Detection', 'Loading States', 'PWA Support'],
  },
  {
    name: 'UI',
    description: 'Typography, colors, responsive media components',
    loaded: true,
    icon: 'i-lucide-palette',
    to: '/ui',
    features: ['Typography System', 'Color Tokens', 'Responsive Images', 'Headline Components', 'Code Blocks'],
  },
  {
    name: 'Layout',
    description: 'Layout components and page structures',
    loaded: true,
    icon: 'i-lucide-layout',
    to: undefined,
    features: ['Coming Soon'],
  },
]
</script>

<template>
  <div class="min-h-screen p-8">
    <UContainer>
      <div class="space-y-12">
        <!-- Header -->
        <div class="text-center space-y-4">
          <h1 class="text-4xl sm:text-5xl font-bold">Nuxt Layers Playground</h1>
          <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Explore the features of each layer in this monorepo architecture demo
          </p>
        </div>

        <!-- Layer Cards -->
        <div class="grid gap-6 md:grid-cols-3">
          <UCard v-for="layer in layers" :key="layer.name" class="relative">
            <div class="space-y-4">
              <!-- Header -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UIcon :name="layer.icon" class="text-xl text-primary" />
                  </div>
                  <div>
                    <h2 class="font-semibold text-lg">{{ layer.name }}</h2>
                    <UBadge :color="layer.loaded ? 'success' : 'neutral'" variant="subtle" size="xs">
                      {{ layer.loaded ? 'Loaded' : 'Not configured' }}
                    </UBadge>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ layer.description }}
              </p>

              <!-- Features -->
              <div class="flex flex-wrap gap-1.5">
                <UBadge
                  v-for="feature in layer.features"
                  :key="feature"
                  variant="subtle"
                  color="neutral"
                  size="xs"
                >
                  {{ feature }}
                </UBadge>
              </div>

              <!-- Action -->
              <div class="pt-2">
                <UButton
                  v-if="layer.to"
                  :to="layer.to"
                  variant="soft"
                  block
                  trailing-icon="i-lucide-arrow-right"
                >
                  Explore {{ layer.name }}
                </UButton>
                <UButton
                  v-else
                  variant="soft"
                  color="neutral"
                  block
                  disabled
                >
                  Coming Soon
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Quick Links -->
        <div class="flex flex-wrap gap-4 justify-center pt-4">
          <UButton to="/diagnostics" variant="outline" icon="i-lucide-activity">
            System Diagnostics
          </UButton>
          <UButton
            href="https://github.com/your-org/nuxt-layers"
            target="_blank"
            variant="outline"
            icon="i-lucide-github"
          >
            View Source
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
