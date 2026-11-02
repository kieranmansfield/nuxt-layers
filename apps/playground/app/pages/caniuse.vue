<script setup lang="ts">
  const features = [
    { slug: 'css-grid', label: 'CSS Grid', description: 'Two-dimensional layout system' },
    { slug: 'css-subgrid', label: 'Subgrid', description: 'Nested grids inherit parent tracks' },
    {
      slug: 'css-container-queries',
      label: 'Container Queries',
      description: 'Style based on container size',
    },
    { slug: 'css-nesting', label: 'CSS Nesting', description: 'Native selector nesting' },
    {
      slug: 'css-anchor-positioning',
      label: 'Anchor Positioning',
      description: 'Tether elements to arbitrary anchors',
    },
    {
      slug: 'view-transitions',
      label: 'View Transitions',
      description: 'Animated transitions between DOM states',
    },
    {
      slug: 'web-animation',
      label: 'Web Animations API',
      description: 'Programmatic animations via element.animate()',
    },
    { slug: 'dialog', label: 'Dialog', description: 'Native modal and non-modal dialogs' },
  ]

  const customSlug = ref('webgpu')

  const usageCode = `<CanIUseTable feature="css-grid" />

<!-- Choose which browser versions are shown -->
<CanIUseTable feature="webgpu" periods="future_1,current,past_1" />`

  definePageMeta({ layout: false })
</script>

<template>
  <LayoutPage title="Can I Use Demo" description="Embedded browser support tables from caniuse.com">
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="CAN I USE"
        description="Embed per-browser support tables for any web platform feature."
      />
      <UContainer class="space-y-12 py-8">
        <section class="space-y-6">
          <div>
            <h2 class="mb-2 text-2xl font-bold">Featured Features</h2>
            <p class="text-muted">
              Live tables from
              <code class="bg-accented rounded px-1.5 py-0.5 text-xs">caniuse.bitsofco.de</code>
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <UCard v-for="feature in features" :key="feature.slug">
              <template #header>
                <h3 class="font-semibold">{{ feature.label }}</h3>
                <p class="text-muted mt-0.5 text-sm">{{ feature.description }}</p>
              </template>

              <CanIUseTable :feature="feature.slug" />

              <template #footer>
                <code class="text-muted text-xs">feature="{{ feature.slug }}"</code>
              </template>
            </UCard>
          </div>
        </section>

        <section class="space-y-6">
          <h2 class="text-2xl font-bold">Try Any Feature</h2>
          <UCard>
            <div class="space-y-6">
              <UInput
                v-model="customSlug"
                placeholder="caniuse.com slug, e.g. webgpu, css-has, avif"
                icon="i-lucide-search"
                size="lg"
              />
              <CanIUseTable v-if="customSlug" :key="customSlug" :feature="customSlug" />
            </div>
            <template #footer>
              <p class="text-muted text-xs">
                The slug is the last segment of the
                <ULink to="https://caniuse.com" target="_blank" class="underline"
                  >caniuse.com</ULink
                >
                URL, e.g.
                <code class="bg-accented rounded px-1 py-0.5">css-has</code>
              </p>
            </template>
          </UCard>
        </section>

        <section class="space-y-6">
          <h2 class="text-2xl font-bold">Usage</h2>
          <UCard>
            <div class="bg-muted text-highlighted overflow-x-auto rounded-lg p-4 font-mono text-sm">
              <pre>{{ usageCode }}</pre>
            </div>
          </UCard>
          <ul class="text-muted list-disc space-y-1 pl-6 text-sm">
            <li><code class="text-xs">feature</code> — required, caniuse.com slug</li>
            <li>
              <code class="text-xs">periods</code> — comma list of
              <code class="text-xs">future_N, current, past_N</code> (default
              <code class="text-xs">future_1,current,past_1,past_2</code>)
            </li>
          </ul>
        </section>

        <div class="flex justify-center gap-4 pt-4">
          <UButton to="/baseline" variant="outline" icon="i-lucide-arrow-left">Baseline</UButton>
          <UButton to="/" icon="i-lucide-home">Back to Home</UButton>
        </div>
      </UContainer>
      <DemoPageFooter
        name="Can I Use"
        description="Embedded browser support tables from caniuse.com"
        :links="[{ label: 'Baseline', to: '/baseline', icon: 'i-lucide-shield-check' }]"
      />
    </div>
  </LayoutPage>
</template>
