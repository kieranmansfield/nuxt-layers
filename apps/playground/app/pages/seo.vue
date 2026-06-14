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
    { label: 'Site URL', value: site.value?.url ?? '—' },
    { label: 'Site Name', value: site.value?.name ?? '—' },
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
    <div class="bg-gray-950 min-h-screen">
      <DemoPageHero
        name="SEO"
        description="@nuxtjs/seo wrapper — robots, sitemap, OG images, and schema-org structured data in one layer."
      >
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton size="lg" to="/sitemap.xml" target="_blank" icon="i-lucide-map">
            sitemap.xml
          </UButton>
          <UButton size="lg" variant="outline" to="/robots.txt" target="_blank" icon="i-lucide-bot">
            robots.txt
          </UButton>
        </div>
      </DemoPageHero>

      <section class="bg-gray-950 pb-24">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="space-y-8 py-8">
            <!-- Modules Overview -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-package" class="text-primary" />
                  <h2 class="text-xl font-semibold">Included Modules</h2>
                </div>
                <p class="text-sm text-muted mt-1">
                  Six @nuxtjs/seo sub-modules, configured via a single layer
                </p>
              </template>

              <div class="grid gap-4 md:grid-cols-2">
                <div
                  v-for="mod in modules"
                  :key="mod.name"
                  class="p-4 rounded-lg bg-elevated border border-default"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon :name="mod.icon" class="text-primary text-lg" />
                    <code class="text-sm font-mono text-highlighted">{{ mod.name }}</code>
                  </div>
                  <p class="text-sm text-muted mb-3">{{ mod.description }}</p>
                  <code class="text-xs text-muted bg-muted px-2 py-1 rounded block truncate">
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
                <p class="text-sm text-muted mt-1">Current resolved SEO configuration</p>
              </template>

              <div class="space-y-2">
                <div
                  v-for="row in configRows"
                  :key="row.label"
                  class="flex justify-between items-center py-2 border-b border-default last:border-0"
                >
                  <span class="text-muted text-sm">{{ row.label }}</span>
                  <span class="font-mono text-sm text-highlighted">{{ row.value }}</span>
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
                  <h3 class="text-sm font-semibold text-highlighted mb-2">Per-page SEO meta</h3>
                  <pre
                    class="text-xs bg-muted p-4 rounded-lg overflow-x-auto text-muted leading-relaxed"
                  ><code>useSeoMeta({
  title: 'My Page Title',
  description: 'Page description for search engines',
  ogTitle: 'Open Graph title',
  ogImage: '/og-image.jpg',
})</code></pre>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-highlighted mb-2">
                    Schema.org structured data
                  </h3>
                  <pre
                    class="text-xs bg-muted p-4 rounded-lg overflow-x-auto text-muted leading-relaxed"
                  ><code>useSchemaOrg([
  defineWebPage({ name: 'My App' }),
  defineOrganization({ name: 'My Org', url: 'https://myapp.com' }),
])</code></pre>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-highlighted mb-2">OG image generation</h3>
                  <pre
                    class="text-xs bg-muted p-4 rounded-lg overflow-x-auto text-muted leading-relaxed"
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
