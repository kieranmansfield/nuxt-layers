<script setup lang="ts">
useSeoMeta({
  title: 'Content Layer Demo',
  description: 'Demonstrating the content layer with blog, portfolio, and gallery collections',
})

const { setPageAccent } = useThemePreferences()
setPageAccent('red')
onUnmounted(() => setPageAccent(null))

const { data: page } = await useContentPage('/')
</script>

<template>
  <div class="min-h-screen bg-default text-default p-8">
    <UContainer>
      <div class="space-y-12">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" />
          <div>
            <h1 class="text-3xl font-bold text-highlighted">Content Layer</h1>
            <p class="text-muted">Blog, portfolio, and gallery collections — ready out of the box</p>
          </div>
        </div>

        <!-- Quick Nav -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <UCard to="/blog">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-pen-line" class="text-primary text-xl" />
              <div>
                <p class="font-semibold">Blog</p>
                <p class="text-sm text-muted">Articles and posts</p>
              </div>
            </div>
          </UCard>
          <UCard to="/portfolio">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-briefcase" class="text-primary text-xl" />
              <div>
                <p class="font-semibold">Portfolio</p>
                <p class="text-sm text-muted">Projects and work</p>
              </div>
            </div>
          </UCard>
          <UCard to="/gallery">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-images" class="text-primary text-xl" />
              <div>
                <p class="font-semibold">Gallery</p>
                <p class="text-sm text-muted">Photo collections</p>
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
            <p class="text-sm text-muted mt-1">Rendered markdown with prose theming via <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">useContentPage()</code></p>
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
          <p class="text-sm text-muted">
            Uses <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">&lt;BlogList /&gt;</code> component.
            Drafts are excluded by default. Click a post to see the detail page with surround navigation.
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
          <p class="text-sm text-muted">
            Uses <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">&lt;PortfolioList /&gt;</code> component.
            Filter by featured status, tags, or limit results.
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
          <p class="text-sm text-muted">
            Uses <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">&lt;GalleryGrid /&gt;</code> component.
            Click a collection to view the detail page with lightbox.
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
              The content layer includes optional <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">nuxt-studio</code> integration.
              When installed, it provides a visual editing interface at
              <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">/_studio</code> for all content collections.
            </p>
            <p>
              Studio auto-discovers your collections (blog, portfolio, gallery) and lets editors
              create and modify content visually — including MDC components like callouts, tabs, and cards.
            </p>
            <p class="text-muted">
              Studio is an optional peer dependency — the layer works without it installed.
            </p>
          </div>

          <template #footer>
            <div class="flex gap-3">
              <UButton to="/_studio" variant="soft" icon="i-lucide-external-link" target="_blank">
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
              The content layer provides default pages at <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">/blog</code>,
              <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">/portfolio</code>, and
              <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">/gallery</code> that work out of the box.
              Override them by creating your own pages at the same paths.
            </p>
            <p>
              All detail components extend <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">NuxtContentDetail</code> which handles
              data fetching, SEO meta, surround navigation, and table of contents. List components wrap
              <code class="text-xs bg-muted/50 px-1.5 py-0.5 rounded">NuxtContentList</code> for consistent loading and empty states.
            </p>
            <p>
              Markdown content supports Nuxt UI's MDC prose components — callouts, tabs, card groups, steps, and code groups
              — which render automatically in both the app and Studio editor.
            </p>
          </div>
        </UCard>

        <!-- Navigation -->
        <div class="flex gap-4 justify-center pt-4">
          <UButton to="/" variant="outline" icon="i-lucide-arrow-left">
            Back to Home
          </UButton>
          <UButton to="/ui" icon="i-lucide-arrow-right">
            UI Layer Demo
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
