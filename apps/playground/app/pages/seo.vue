<script setup lang="ts">
  definePageMeta({ layout: false })

  const { setPageAccent } = useAccentColor()
  setPageAccent('sky')
  onUnmounted(() => setPageAccent(null))

  const { site, ogImageComponent, twitterCard, schemaOrgEnabled } = useSeoConfig()

  useSeoMeta({
    title: 'SEO Layer — Nuxt Layers Playground',
    description: '@nuxtjs/seo wrapper with robots, sitemap, OG images, and schema-org.',
    ogTitle: 'SEO Layer Demo',
    ogDescription: '@nuxtjs/seo wrapper: robots, sitemap, OG images, and schema-org.',
    twitterCard: 'summary_large_image',
  })

  const modules = [
    {
      name: 'nuxt-robots',
      icon: 'i-lucide-bot',
      description: 'Generate robots.txt and configure crawling rules per route',
      snippet: "robots: [{ UserAgent: '*', Allow: '/' }]",
    },
    {
      name: 'nuxt-site-map',
      icon: 'i-lucide-map',
      description: 'Auto-generate sitemap.xml from your routes and content collections',
      snippet: "sitemap: { exclude: ['/admin/**'] }",
    },
    {
      name: 'nuxt-og-image',
      icon: 'i-lucide-image',
      description: 'Satori-powered OG image generation from Vue templates',
      snippet: "defineOgImage({ component: 'OgImageNuxtSeo' })",
    },
    {
      name: 'nuxt-schema-org',
      icon: 'i-lucide-code-2',
      description: 'Schema.org structured data via JSON-LD — WebSite, Article, BreadcrumbList',
      snippet: "useSchemaOrg([defineWebPage({ name: 'My App' })])",
    },
    {
      name: 'nuxt-link-checker',
      icon: 'i-lucide-link',
      description: 'Crawl your site for broken links and missing alt text at build time',
      snippet: 'Runs automatically during nuxt build',
    },
    {
      name: 'nuxt-seo-utils',
      icon: 'i-lucide-wrench',
      description: 'useSeoMeta, useSitemap, OG tag helpers, and canonical URL utilities',
      snippet: "useSeoMeta({ title: 'Page Title', description: '...' })",
    },
  ]

  const configRows = computed(() => [
    { label: 'Site URL', value: site?.url ?? '—' },
    { label: 'Site Name', value: site?.title ?? '—' },
    { label: 'OG Image Component', value: ogImageComponent },
    { label: 'Twitter Card', value: twitterCard },
    { label: 'Schema.org', value: schemaOrgEnabled ? 'Enabled' : 'Disabled' },
  ])
</script>

<template>
  <LayoutPage
    title="SEO Layer Demo"
    description="@nuxtjs/seo wrapper with robots, sitemap, OG images, and schema-org"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="SEO"
        description="@nuxtjs/seo wrapper — robots, sitemap, OG images, and schema-org structured data in one layer."
      >
        <div class="flex flex-wrap justify-center gap-4">
          <UButton size="lg" to="/sitemap.xml" target="_blank" icon="i-lucide-map">
            sitemap.xml
          </UButton>
          <UButton size="lg" variant="outline" to="/robots.txt" target="_blank" icon="i-lucide-bot">
            robots.txt
          </UButton>
        </div>
      </DemoPageHero>

      <section class="bg-default pb-24">
        <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div class="space-y-8 py-8">
            <!-- Modules Overview -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-package" class="text-primary" />
                  <h2 class="text-xl font-semibold">Included Modules</h2>
                </div>
                <p class="text-muted mt-1 text-sm">
                  Six @nuxtjs/seo sub-modules, configured via a single layer
                </p>
              </template>

              <div class="grid gap-4 md:grid-cols-2">
                <div
                  v-for="mod in modules"
                  :key="mod.name"
                  class="bg-elevated border-default rounded-lg border p-4"
                >
                  <div class="mb-2 flex items-center gap-2">
                    <UIcon :name="mod.icon" class="text-primary text-lg" />
                    <code class="text-highlighted font-mono text-sm">{{ mod.name }}</code>
                  </div>
                  <p class="text-muted mb-3 text-sm">{{ mod.description }}</p>
                  <code class="text-muted bg-muted block truncate rounded px-2 py-1 text-xs">
                    {{ mod.snippet }}
                  </code>
                </div>
              </div>
            </UCard>

            <!-- Live Config -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-settings" class="text-primary" />
                  <h2 class="text-xl font-semibold">useSeoConfig()</h2>
                </div>
                <p class="text-muted mt-1 text-sm">Current resolved SEO configuration</p>
              </template>

              <div class="space-y-2">
                <div
                  v-for="row in configRows"
                  :key="row.label"
                  class="border-default flex items-center justify-between border-b py-2 last:border-0"
                >
                  <span class="text-muted text-sm">{{ row.label }}</span>
                  <span class="text-highlighted font-mono text-sm">{{ row.value }}</span>
                </div>
              </div>
            </UCard>

            <!-- Usage Pattern -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-code-2" class="text-primary" />
                  <h2 class="text-xl font-semibold">Usage</h2>
                </div>
              </template>

              <div class="space-y-4">
                <div>
                  <h3 class="text-highlighted mb-2 text-sm font-semibold">Per-page SEO meta</h3>
                  <pre
                    class="bg-muted text-muted overflow-x-auto rounded-lg p-4 text-xs leading-relaxed"
                  ><code>useSeoMeta({
  title: 'My Page Title',
  description: 'Page description for search engines',
  ogTitle: 'Open Graph title',
  ogImage: '/og-image.jpg',
})</code></pre>
                </div>
                <div>
                  <h3 class="text-highlighted mb-2 text-sm font-semibold">
                    Schema.org structured data
                  </h3>
                  <pre
                    class="bg-muted text-muted overflow-x-auto rounded-lg p-4 text-xs leading-relaxed"
                  ><code>useSchemaOrg([
  defineWebPage({ name: 'My App' }),
  defineOrganization({ name: 'My Org', url: 'https://myapp.com' }),
])</code></pre>
                </div>
                <div>
                  <h3 class="text-highlighted mb-2 text-sm font-semibold">OG image generation</h3>
                  <pre
                    class="bg-muted text-muted overflow-x-auto rounded-lg p-4 text-xs leading-relaxed"
                  ><code>// In a page component
defineOgImage({ component: 'OgImageNuxtSeo', props: { title: 'My Page' } })</code></pre>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </section>

      <DemoPageFooter
        name="SEO Layer"
        description="@nuxtjs/seo — robots, sitemap, OG images, schema-org"
        :links="[
          { label: 'Scripts', to: '/scripts', icon: 'i-lucide-cloud-download' },
          { label: 'Core', to: '/core', icon: 'i-lucide-box' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
