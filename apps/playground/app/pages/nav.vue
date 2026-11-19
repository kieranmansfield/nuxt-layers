<script setup lang="ts">
  const { setPageAccent } = useAccentColor()
  setPageAccent('indigo')
  onUnmounted(() => setPageAccent(null))

  const { open } = useMastNav()
  const appConfig = useAppConfig()
  const logoSizes = ['sm', 'md', 'lg', 'display'] as const

  const configSnippet = `// apps/my-app/app/app.config.ts
export default defineAppConfig({
  mastNav: {
    scrollBehaviour: 'router', // or 'smooth-scroll'
    links: [
      { id: 'home',    label: 'Home',    to: { name: 'index' } },
      { id: 'about',   label: 'About',   to: { name: 'about' } },
      { id: 'drafts',  label: 'Drafts',  to: { name: 'drafts' }, hidden: true },
    ],
    // UButton props for <MastNav>
    trigger: { label: 'Menu', icon: undefined, variant: 'ghost', size: 'xl' },
    // MastNavModal classes, merged per key — a key you set replaces the default string
    ui: {
      nav: 'flex w-full flex-col items-start gap-2 px-12',
      link: 'cursor-pointer py-3 text-step-4 aria-[current=page]:underline',
    },
  },
  siteLogo: {
    sizes: { display: 'text-step-display [--display-from:4] [--display-to:9]' },
  },
})`

  const layoutSnippet = `<!-- app/layouts/default.vue -->
<template>
  <LayoutMain>
    <MastNav class="fixed top-0 right-0 z-(--z-header)" />
    <!-- Once per layout: every trigger opens this one modal -->
    <MastNavModal />
    <slot />
  </LayoutMain>
</template>`

  const smoothScrollSnippet = `// Smooth scroll mode — scrolls to #section-id on the index page,
// navigates with router on all other pages.
mastNav: {
  scrollBehaviour: 'smooth-scroll',
  links: [
    { id: 'hero',    label: 'Start',   to: { name: 'index' } },
    { id: 'work',    label: 'Work',    to: { name: 'index' } },
    { id: 'contact', label: 'Contact', to: { name: 'index' } },
  ],
}
// The 'id' field is the scroll target — useSmoothScroll().scrollTo('#id')
// The 'to' field is the fallback route when not on the index page`

  const composableSnippet = `// Shared state, not an overlay — any component can read or drive it
const { isOpen, open, close, toggle } = useMastNav()

// open()  locks smooth scroll, then sets isOpen
// close() clears isOpen, unlocks and resizes Lenis/Locomotive so they resync

// Replace one link's markup; navigate() scrolls or routes, then dismisses
<MastNavModal :links="visibleLinks">
  <template #link="{ link, active, navigate }">
    <UButton :label="link.label" :variant="active ? 'solid' : 'ghost'" @click="navigate" />
  </template>
  <template #footer><SocialLinks /></template>
</MastNavModal>`

  const activeSectionSnippet = `// A link is active when your scroll composable has written its id here…
const activeSection = useState('activeSection', () => '')
// …or (outside the smooth-scroll index) when its \`to\` resolves to the current route.

// Active links get aria-current="page" plus mastNav.ui.linkActive`

  definePageMeta({
    layout: false,
  })
</script>

<template>
  <LayoutPage title="MastNav Demo" description="Hamburger nav + full-screen overlay modal">
    <MastNav class="fixed right-0 bottom-0 z-(--z-header)" />
    <MastNavModal />
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="NAVIGATION"
        description="Mast/Site/Links navigation components with useMastNav and useSite composables."
      />
      <UContainer class="space-y-12 py-8 pt-16">
        <!-- Live demo callout -->
        <UAlert
          icon="lucide:mouse-pointer-click"
          color="info"
          variant="subtle"
          title="Live demo active"
          description="The hamburger button is live in the bottom-right corner of this page — this page positions it there. Click it to open the nav modal."
        >
          <template #actions>
            <UButton size="sm" variant="subtle" color="info" @click="() => open()">
              Or open it here
            </UButton>
          </template>
        </UAlert>

        <!-- Current config -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="lucide:settings-2" class="text-primary" />
              <h3 class="text-xl font-semibold">Active configuration</h3>
            </div>
            <p class="text-muted mt-1 text-sm">
              Links currently configured in the playground's app.config.ts
            </p>
          </template>
          <div class="space-y-2">
            <div
              v-for="link in appConfig.mastNav?.links"
              :key="link.id"
              class="bg-elevated flex items-center justify-between rounded-lg px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <code class="text-muted text-xs">id: {{ link.id }}</code>
                <span class="text-default font-medium">{{ link.label }}</span>
              </div>
              <code class="text-primary text-xs">{{
                typeof link.to === 'string' ? link.to : link.to.name
              }}</code>
            </div>
          </div>
          <template #footer>
            <TypographyCodeBlock language="ts" class="text-sm">{{
              configSnippet
            }}</TypographyCodeBlock>
          </template>
        </UCard>

        <!-- Site logo -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="lucide:signature" class="text-primary" />
              <h3 class="text-xl font-semibold">SiteLogo</h3>
            </div>
            <p class="text-muted mt-1 text-sm">
              <code class="text-primary">site.title</code> as a wordmark, sized on the step scale by
              <code class="text-primary">siteLogo.sizes</code>
            </p>
          </template>
          <div class="space-y-8">
            <div class="flex flex-wrap items-end gap-8">
              <div v-for="size in logoSizes" :key="size" data-logo-size>
                <SiteLogo :size />
                <code class="text-muted mt-2 block text-xs">size="{{ size }}"</code>
              </div>
            </div>
            <div data-logo-inline>
              <SiteLogo size="md" :stacked="false" />
              <code class="text-muted mt-2 block text-xs">:stacked="false"</code>
            </div>
            <div data-logo-range class="overflow-hidden">
              <SiteLogo
                size="display"
                :stacked="false"
                class="[--display-from:4] [--display-to:9]"
              />
              <code class="text-muted mt-2 block text-xs"
                >class="[--display-from:4] [--display-to:9]" — step 4 → 9 across 360 → 1280px</code
              >
            </div>
          </div>
        </UCard>

        <!-- Layout wiring -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="lucide:layout-template" class="text-primary" />
              <h3 class="text-xl font-semibold">Layout wiring</h3>
            </div>
            <p class="text-muted mt-1 text-sm">
              Drop <code class="text-primary">&lt;MastNav /&gt;</code> into your layout and position
              it there — the trigger doesn't place itself
            </p>
          </template>
          <TypographyCodeBlock language="vue" class="text-sm">{{
            layoutSnippet
          }}</TypographyCodeBlock>
        </UCard>

        <!-- Scroll behaviour -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="lucide:mouse" class="text-primary" />
              <h3 class="text-xl font-semibold">Scroll behaviour</h3>
            </div>
          </template>
          <div class="space-y-6">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="bg-elevated rounded-xl p-4">
                <div class="mb-2 flex items-center gap-2">
                  <UBadge color="success" variant="subtle">router</UBadge>
                  <span class="text-sm font-medium">Standard routing</span>
                </div>
                <p class="text-muted text-sm">
                  Always navigates with the Vue router. Good for multi-page apps.
                </p>
              </div>
              <div class="bg-elevated rounded-xl p-4">
                <div class="mb-2 flex items-center gap-2">
                  <UBadge color="info" variant="subtle">smooth-scroll</UBadge>
                  <span class="text-sm font-medium">Lenis scroll</span>
                </div>
                <p class="text-muted text-sm">
                  Scrolls to <code class="text-primary">#section-id</code> when on the index route.
                  Falls back to router on other pages.
                </p>
              </div>
            </div>
            <TypographyCodeBlock language="ts" class="text-sm">{{
              smoothScrollSnippet
            }}</TypographyCodeBlock>
          </div>
        </UCard>

        <!-- Active section -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="lucide:radio" class="text-primary" />
              <h3 class="text-xl font-semibold">Active section highlighting</h3>
            </div>
            <p class="text-muted mt-1 text-sm">
              Section id from <code class="text-primary">useState('activeSection')</code>, or the
              current route
            </p>
          </template>
          <TypographyCodeBlock language="ts" class="text-sm">{{
            activeSectionSnippet
          }}</TypographyCodeBlock>
        </UCard>

        <!-- Composable internals -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="lucide:code-2" class="text-primary" />
              <h3 class="text-xl font-semibold">useMastNav internals</h3>
            </div>
            <p class="text-muted mt-1 text-sm">
              <code class="text-primary">useState</code>-backed, so every trigger shares one modal
            </p>
          </template>
          <TypographyCodeBlock language="ts" class="text-sm">{{
            composableSnippet
          }}</TypographyCodeBlock>
        </UCard>
      </UContainer>
      <DemoPageFooter
        name="Navigation Layer"
        description="Navigation components and composables"
        :links="[
          { label: 'Typography', to: '/typography', icon: 'i-lucide-type' },
          { label: 'Visual', to: '/visual', icon: 'i-lucide-sparkles' },
          { label: 'Overlays', to: '/overlays', icon: 'i-lucide-layers' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
