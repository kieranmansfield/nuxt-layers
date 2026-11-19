<script setup lang="ts">
  const { setPageAccent } = useAccentColor()
  setPageAccent('red')
  onUnmounted(() => setPageAccent(null))

  const { data: page } = await useContentPage('/')

  definePageMeta({ layout: false })
</script>

<template>
  <LayoutPage
    title="Content Layer Demo"
    description="Demonstrating the content layer with blog, portfolio, and gallery collections"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="CONTENT"
        description="Nuxt Content v3 with typed collections for blog, portfolio, and gallery."
      />
      <section class="bg-default pb-24">
        <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div class="space-y-12 py-8">
            <!-- Quick Nav -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <UCard to="/blog">
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-pen-line" class="text-primary text-xl" />
                  <div>
                    <p class="font-semibold">Blog</p>
                    <p class="text-muted text-sm">Articles and posts</p>
                  </div>
                </div>
              </UCard>
              <UCard to="/portfolio">
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-briefcase" class="text-primary text-xl" />
                  <div>
                    <p class="font-semibold">Portfolio</p>
                    <p class="text-muted text-sm">Projects and work</p>
                  </div>
                </div>
              </UCard>
              <UCard to="/gallery">
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-images" class="text-primary text-xl" />
                  <div>
                    <p class="font-semibold">Gallery</p>
                    <p class="text-muted text-sm">Photo collections</p>
                  </div>
                </div>
              </UCard>
            </div>

            <!-- Content Page Preview -->
            <UCard v-if="page">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file-text" class="text-primary" />
                  <h2 class="text-xl font-semibold">Content Page</h2>
                </div>
                <p class="text-muted mt-1 text-sm">
                  Rendered markdown with prose theming via
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">useContentPage()</code>
                </p>
              </template>

              <div class="prose prose-primary max-w-none">
                <ContentRenderer :value="page" />
              </div>
            </UCard>

            <!-- Blog Section -->
            <section class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-pen-line" class="text-primary" />
                  <h2 class="text-xl font-semibold">Blog Posts</h2>
                </div>
                <UButton to="/blog" variant="link" trailing-icon="i-lucide-arrow-right">
                  View all
                </UButton>
              </div>
              <p class="text-muted text-sm">
                Uses
                <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">&lt;BlogList /&gt;</code>
                component. Drafts are excluded by default. Click a post to see the detail page with
                surround navigation.
              </p>
              <BlogList :options="{ limit: 3 }" />
            </section>

            <!-- Portfolio Section -->
            <section class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-briefcase" class="text-primary" />
                  <h2 class="text-xl font-semibold">Portfolio</h2>
                </div>
                <UButton to="/portfolio" variant="link" trailing-icon="i-lucide-arrow-right">
                  View all
                </UButton>
              </div>
              <p class="text-muted text-sm">
                Uses
                <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs"
                  >&lt;PortfolioList /&gt;</code
                >
                component. Filter by featured status, tags, or limit results.
              </p>
              <PortfolioList />
            </section>

            <!-- Gallery Section -->
            <section class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-images" class="text-primary" />
                  <h2 class="text-xl font-semibold">Gallery</h2>
                </div>
                <UButton to="/gallery" variant="link" trailing-icon="i-lucide-arrow-right">
                  View all
                </UButton>
              </div>
              <p class="text-muted text-sm">
                Uses
                <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">&lt;GalleryGrid /&gt;</code>
                component. Click a collection to view the detail page with lightbox.
              </p>
              <GalleryGrid />
            </section>

            <!-- Studio Section -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-monitor" class="text-primary" />
                  <h2 class="text-xl font-semibold">Nuxt Studio</h2>
                </div>
              </template>

              <div class="space-y-3 text-sm">
                <p>
                  The content layer includes optional
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">nuxt-studio</code>
                  integration. When installed, it provides a visual editing interface at
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">/_studio</code> for all
                  content collections.
                </p>
                <p>
                  Studio auto-discovers your collections (blog, portfolio, gallery) and lets editors
                  create and modify content visually — including MDC components like callouts, tabs,
                  and cards.
                </p>
                <p class="text-muted">
                  Studio is an optional peer dependency — the layer works without it installed.
                </p>
              </div>

              <template #footer>
                <div class="flex gap-3">
                  <UButton
                    to="/_studio"
                    variant="soft"
                    icon="i-lucide-external-link"
                    target="_blank"
                  >
                    Open Studio
                  </UButton>
                </div>
              </template>
            </UCard>

            <!-- Architecture Note -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-layers" class="text-primary" />
                  <h2 class="text-xl font-semibold">Architecture</h2>
                </div>
              </template>

              <div class="space-y-3 text-sm">
                <p>
                  The content layer is components-only — it never registers pages itself (an earlier
                  version did, and generated stray unused routes). Instead each domain ships a
                  ready-made
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">Page</code>
                  /
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">ItemPage</code>
                  pair you copy into your own
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">app/pages/</code> as a 1–3
                  line wrapper — see
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">/blog</code>,
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">/portfolio</code>, and
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">/gallery</code> in this
                  playground for the exact pattern (e.g.
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs"
                    >&lt;template&gt;&lt;BlogPage /&gt;&lt;/template&gt;</code
                  >).
                </p>
                <p>
                  All detail components extend
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">NuxtContentDetail</code>
                  which handles data fetching, SEO meta, surround navigation, and table of contents.
                  List components wrap
                  <code class="bg-muted/50 rounded px-1.5 py-0.5 text-xs">NuxtContentList</code> for
                  consistent loading and empty states.
                </p>
                <p>
                  Markdown content supports Nuxt UI's MDC prose components — callouts, tabs, card
                  groups, steps, and code groups — which render automatically in both the app and
                  Studio editor.
                </p>
              </div>
            </UCard>

            <!-- Navigation -->
            <div class="flex justify-center gap-4 pt-4">
              <UButton to="/" variant="outline" icon="i-lucide-arrow-left"> Back to Home </UButton>
              <UButton to="/visual" icon="i-lucide-arrow-right"> Visual Layer Demo </UButton>
            </div>
          </div>
        </div>
      </section>
      <DemoPageFooter
        name="Content Layer"
        description="Nuxt Content v3 typed collections"
        :links="[
          { label: 'Feeds', to: '/feeds', icon: 'i-lucide-rss' },
          { label: 'Gallery', to: '/gallery', icon: 'i-lucide-images' },
          { label: 'Routing', to: '/routing', icon: 'i-lucide-route' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
