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

  const usageCode = '<BaselineStatus featureId="css-grid" />'

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
              <strong>Baseline</strong> is a Web Platform initiative by the W3C WebDX Community
              Group that gives each web feature a clear availability signal:
            </p>
            <div class="not-prose mt-4 grid gap-4 md:grid-cols-3">
              <div
                class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
              >
                <div class="mb-2 flex items-center gap-2">
                  <span class="text-lg font-bold text-green-600">✓</span>
                  <h3 class="font-semibold text-green-800 dark:text-green-200">Widely Available</h3>
                </div>
                <p class="text-sm text-green-700 dark:text-green-300">
                  Supported in all major browsers for 2.5+ years — safe to use
                </p>
              </div>
              <div
                class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
              >
                <div class="mb-2 flex items-center gap-2">
                  <span class="text-lg font-bold text-blue-600">◎</span>
                  <h3 class="font-semibold text-blue-800 dark:text-blue-200">Newly Available</h3>
                </div>
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  Landed in all major browsers recently — use with care
                </p>
              </div>
              <div class="bg-accented border-default rounded-lg border p-4">
                <div class="mb-2 flex items-center gap-2">
                  <span class="text-muted text-lg font-bold">✗</span>
                  <h3 class="font-semibold">Limited Availability</h3>
                </div>
                <p class="text-toned text-sm">
                  Not yet in all major browsers — check support tables
                </p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Live demo — featured features -->
        <section class="space-y-6">
          <div>
            <h2 class="mb-2 text-2xl font-bold">Featured Features</h2>
            <p class="text-muted">
              Live status badges fetched from
              <code class="bg-accented rounded px-1.5 py-0.5 text-xs">api.webstatus.dev</code>
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <UCard v-for="feature in featuredFeatures" :key="feature.id">
              <template #header>
                <div>
                  <h3 class="font-semibold">{{ feature.label }}</h3>
                  <p class="text-muted mt-0.5 text-sm">{{ feature.description }}</p>
                </div>
              </template>

              <BaselineStatus :feature-id="feature.id" />

              <template #footer>
                <code class="text-muted text-xs">featureId="{{ feature.id }}"</code>
              </template>
            </UCard>
          </div>
        </section>

        <!-- Interactive sandbox -->
        <section class="space-y-6">
          <div>
            <h2 class="mb-2 text-2xl font-bold">Try Any Feature</h2>
            <p class="text-muted">
              Enter any feature ID from
              <code class="bg-accented rounded px-1.5 py-0.5 text-xs">webstatus.dev</code>
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
                <p class="text-muted text-sm">
                  Status for
                  <code class="bg-accented rounded px-1.5 py-0.5 text-xs">{{
                    customFeatureId
                  }}</code
                  >:
                </p>
                <BaselineStatus :feature-id="customFeatureId" />
              </div>
            </div>

            <template #footer>
              <p class="text-muted text-xs">
                Find feature IDs at
                <ULink to="https://webstatus.dev" target="_blank" class="underline"
                  >webstatus.dev</ULink
                >
                — the ID is the last segment of the URL, e.g.
                <code class="bg-accented rounded px-1 py-0.5">intl-list-format</code>
              </p>
            </template>
          </UCard>
        </section>

        <!-- Usage -->
        <section class="space-y-6">
          <div>
            <h2 class="mb-2 text-2xl font-bold">Usage</h2>
            <p class="text-muted">
              <code class="bg-accented rounded px-1.5 py-0.5 text-xs">BaselineStatus</code>
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
                class="bg-muted text-highlighted overflow-x-auto rounded-lg p-4 font-mono text-sm"
              >
                <pre>{{ usageCode }}</pre>
              </div>

              <div
                class="bg-muted text-highlighted overflow-x-auto rounded-lg p-4 font-mono text-sm"
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
                    <th class="px-3 py-2 text-left">Prop</th>
                    <th class="px-3 py-2 text-left">Type</th>
                    <th class="px-3 py-2 text-left">Required</th>
                    <th class="px-3 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="px-3 py-2 font-mono text-xs">featureId</td>
                    <td class="px-3 py-2 font-mono text-xs">string</td>
                    <td class="px-3 py-2">
                      <UBadge color="error" variant="subtle" size="xs">required</UBadge>
                    </td>
                    <td class="px-3 py-2">
                      Web platform feature slug from
                      <code class="bg-accented rounded px-1 text-xs">webstatus.dev</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </UCard>
        </section>

        <!-- Navigation -->
        <div class="flex justify-center gap-4 pt-4">
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
