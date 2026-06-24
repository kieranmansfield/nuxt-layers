<script setup lang="ts">
  const featuredFeatures = [
    {
      id: 'css-grid',
      label: 'CSS Grid',
      description: 'Two-dimensional layout system',
    },
    {
      id: 'container-queries',
      label: 'Container Queries',
      description: 'Style based on container size',
    },
    {
      id: 'css-nesting',
      label: 'CSS Nesting',
      description: 'Native selector nesting without preprocessors',
    },
    {
      id: 'anchor-positioning',
      label: 'CSS Anchor Positioning',
      description: 'Tether elements to arbitrary anchors',
    },
    {
      id: 'view-transitions',
      label: 'View Transitions API',
      description: 'Animated transitions between DOM states',
    },
    {
      id: 'scroll-driven-animations',
      label: 'Scroll-driven Animations',
      description: 'Animations linked to scroll position',
    },
    {
      id: 'web-components',
      label: 'Web Components',
      description: 'Custom elements and shadow DOM',
    },
    {
      id: 'fetch',
      label: 'Fetch API',
      description: 'Promise-based HTTP requests',
    },
  ]

  const customFeatureId = ref('popover')

  const usageCode = `<BaselineStatus featureId="css-grid" />`

  const advancedCode = `<!-- Any web platform feature ID from webstatus.dev -->
<BaselineStatus featureId="container-queries" />
<BaselineStatus featureId="view-transitions" />
<BaselineStatus featureId="anchor-positioning" />`

  definePageMeta({ layout: false })
</script>

<template>
  <LayoutPage
    title="Baseline Layer Demo"
    description="Browser compatibility badges from the Web Platform Baseline initiative"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="BASELINE"
        description="Show browser compatibility status for any web platform feature using the Baseline initiative."
      />
      <UContainer class="space-y-12 py-8">
              <!-- Overview -->
              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-info" class="text-primary" />
                    <h2 class="text-xl font-semibold">What is Baseline?</h2>
                  </div>
                </template>

                <div class="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    <strong>Baseline</strong> is a Web Platform initiative by the W3C WebDX
                    Community Group that gives each web feature a clear availability signal:
                  </p>
                  <div class="grid gap-4 md:grid-cols-3 not-prose mt-4">
                    <div
                      class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-green-600 font-bold text-lg">✓</span>
                        <h3 class="font-semibold text-green-800 dark:text-green-200">
                          Widely Available
                        </h3>
                      </div>
                      <p class="text-sm text-green-700 dark:text-green-300">
                        Supported in all major browsers for 2.5+ years — safe to use
                      </p>
                    </div>
                    <div
                      class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-blue-600 font-bold text-lg">◎</span>
                        <h3 class="font-semibold text-blue-800 dark:text-blue-200">
                          Newly Available
                        </h3>
                      </div>
                      <p class="text-sm text-blue-700 dark:text-blue-300">
                        Landed in all major browsers recently — use with care
                      </p>
                    </div>
                    <div
                      class="p-4 bg-accented rounded-lg border border-default"
                    >
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-muted font-bold text-lg">✗</span>
                        <h3 class="font-semibold">Limited Availability</h3>
                      </div>
                      <p class="text-sm text-toned">
                        Not yet in all major browsers — check support tables
                      </p>
                    </div>
                  </div>
                </div>
              </UCard>

              <!-- Live demo — featured features -->
              <section class="space-y-6">
                <div>
                  <h2 class="text-2xl font-bold mb-2">Featured Features</h2>
                  <p class="text-muted">
                    Live status badges fetched from
                    <code class="text-xs bg-accented px-1.5 py-0.5 rounded">api.webstatus.dev</code>
                  </p>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                  <UCard v-for="feature in featuredFeatures" :key="feature.id">
                    <template #header>
                      <div>
                        <h3 class="font-semibold">{{ feature.label }}</h3>
                        <p class="text-sm text-muted mt-0.5">{{ feature.description }}</p>
                      </div>
                    </template>

                    <BaselineStatus :featureId="feature.id" />

                    <template #footer>
                      <code class="text-xs text-muted">featureId="{{ feature.id }}"</code>
                    </template>
                  </UCard>
                </div>
              </section>

              <!-- Interactive sandbox -->
              <section class="space-y-6">
                <div>
                  <h2 class="text-2xl font-bold mb-2">Try Any Feature</h2>
                  <p class="text-muted">
                    Enter any feature ID from
                    <code class="text-xs bg-accented px-1.5 py-0.5 rounded">webstatus.dev</code>
                    to see its Baseline status
                  </p>
                </div>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-flask-conical" class="text-primary" />
                      <h3 class="text-xl font-semibold">Live Sandbox</h3>
                    </div>
                  </template>

                  <div class="space-y-6">
                    <UInput
                      v-model="customFeatureId"
                      placeholder="e.g. popover, scroll-driven-animations, css-grid"
                      icon="i-lucide-search"
                      size="lg"
                    />

                    <div v-if="customFeatureId" class="space-y-2">
                      <p class="text-sm text-muted">
                        Status for
                        <code class="text-xs bg-accented px-1.5 py-0.5 rounded">{{
                          customFeatureId
                        }}</code
                        >:
                      </p>
                      <BaselineStatus :featureId="customFeatureId" />
                    </div>
                  </div>

                  <template #footer>
                    <p class="text-xs text-muted">
                      Find feature IDs at
                      <ULink
                        to="https://webstatus.dev"
                        target="_blank"
                        class="underline"
                      >webstatus.dev</ULink>
                      — the ID is the last segment of the URL, e.g.
                      <code class="bg-accented px-1 py-0.5 rounded">intl-list-format</code>
                    </p>
                  </template>
                </UCard>
              </section>

              <!-- Usage -->
              <section class="space-y-6">
                <div>
                  <h2 class="text-2xl font-bold mb-2">Usage</h2>
                  <p class="text-muted">
                    <code class="text-xs bg-accented px-1.5 py-0.5 rounded">BaselineStatus</code>
                    is auto-imported — no manual import needed
                  </p>
                </div>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-code" class="text-primary" />
                      <h3 class="text-xl font-semibold">Basic Usage</h3>
                    </div>
                  </template>

                  <div class="space-y-6">
                    <div
                      class="bg-muted text-highlighted p-4 rounded-lg font-mono text-sm overflow-x-auto"
                    >
                      <pre>{{ usageCode }}</pre>
                    </div>

                    <div
                      class="bg-muted text-highlighted p-4 rounded-lg font-mono text-sm overflow-x-auto"
                    >
                      <pre>{{ advancedCode }}</pre>
                    </div>
                  </div>
                </UCard>

                <UCard>
                  <template #header>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-table" class="text-primary" />
                      <h3 class="text-xl font-semibold">Props</h3>
                    </div>
                  </template>

                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="border-b">
                          <th class="text-left py-2 px-3">Prop</th>
                          <th class="text-left py-2 px-3">Type</th>
                          <th class="text-left py-2 px-3">Required</th>
                          <th class="text-left py-2 px-3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="py-2 px-3 font-mono text-xs">featureId</td>
                          <td class="py-2 px-3 font-mono text-xs">string</td>
                          <td class="py-2 px-3">
                            <UBadge color="error" variant="subtle" size="xs">required</UBadge>
                          </td>
                          <td class="py-2 px-3">
                            Web platform feature slug from
                            <code class="text-xs bg-accented px-1 rounded">webstatus.dev</code>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </UCard>
              </section>

              <!-- Navigation -->
              <div class="flex gap-4 justify-center pt-4">
                <UButton to="/content" variant="outline" icon="i-lucide-arrow-left">
                  Content Layer
                </UButton>
                <UButton to="/" icon="i-lucide-home">Back to Home</UButton>
              </div>
      </UContainer>
      <DemoPageFooter
        name="Baseline Layer"
        description="Browser compatibility badges from the Web Platform Baseline initiative"
        :links="[
          { label: 'Content', to: '/content', icon: 'i-lucide-file-text' },
          { label: 'SEO', to: '/seo', icon: 'i-lucide-search' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
