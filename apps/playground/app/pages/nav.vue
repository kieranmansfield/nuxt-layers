<script setup lang="ts">
const { setPageAccent } = useAccentColor()
setPageAccent('sky')
onUnmounted(() => setPageAccent(null))

const { open } = useMastNav()
const appConfig = useAppConfig()

const configSnippet = `// apps/my-app/app/app.config.ts
export default defineAppConfig({
  mastNav: {
    scrollBehaviour: 'router', // or 'smooth-scroll'
    links: [
      { id: 'home',    label: 'Home',    to: { name: 'index' } },
      { id: 'about',   label: 'About',   to: { name: 'about' } },
      { id: 'work',    label: 'Work',    to: { name: 'work'  } },
      { id: 'contact', label: 'Contact', to: { name: 'contact' } },
    ],
  },
})`

const layoutSnippet = `<!-- app/layouts/default.vue -->
<template>
  <LayoutMain>
    <MastNav />
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

const composableSnippet = `// composables/mastNav.ts (in the ui layer)
import { createSharedComposable } from '@vueuse/core'

function _useMastNav() {
  const overlay = useOverlay()
  const modal = overlay.create(MastNavModal)

  function open() {
    try { useSmoothScroll().lockScrolling() } catch {}
    modal.open()
  }

  function close() {
    modal.close()
    try { useSmoothScroll().unlockScrolling() } catch {}
  }

  return { open, close }
}

// createSharedComposable ensures overlay.create() runs only once
export const useMastNav = createSharedComposable(_useMastNav)`

const activeSectionSnippet = `// Your scroll composable writes to this key:
const activeSection = useState('activeSection', () => '')

// NavModal reads it reactively to highlight the current section:
:class="activeSection === link.id ? 'font-normal' : 'font-light'"`

definePageMeta({
  layout: { name: 'grid', props: { showNav: true, showHeader: false, showFooter: false } },
})
</script>

<template>
  <LayoutPage title="MastNav Demo" description="Hamburger nav + full-screen overlay modal">
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-12 py-8 pt-16">
          <LayoutPageHeader
            title="MastNav"
            description="Hamburger button + full-screen overlay modal, driven by app.config.ts"
            back="/"
          />

          <!-- Live demo callout -->
          <UAlert
            icon="lucide:mouse-pointer-click"
            color="info"
            variant="subtle"
            title="Live demo active"
            description="The hamburger button is live in the top-right corner of this page. Click it to open the nav modal."
          >
            <template #actions>
              <UButton size="sm" variant="subtle" color="info" @click="open">
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
              <p class="text-muted mt-1 text-sm">Links currently configured in the playground's app.config.ts</p>
            </template>
            <div class="space-y-2">
              <div
                v-for="link in appConfig.mastNav?.links"
                :key="link.id"
                class="bg-(--ui-bg-elevated) flex items-center justify-between rounded-lg px-4 py-3"
              >
                <div class="flex items-center gap-3">
                  <code class="text-muted text-xs">id: {{ link.id }}</code>
                  <span class="text-(--ui-text) font-medium">{{ link.label }}</span>
                </div>
                <code class="text-primary text-xs">{{ typeof link.to === 'string' ? link.to : link.to.name }}</code>
              </div>
            </div>
            <template #footer>
              <TypographyCodeBlock language="ts" class="text-sm">{{ configSnippet }}</TypographyCodeBlock>
            </template>
          </UCard>

          <!-- Layout wiring -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="lucide:layout-template" class="text-primary" />
                <h3 class="text-xl font-semibold">Layout wiring</h3>
              </div>
              <p class="text-muted mt-1 text-sm">Drop <code class="text-primary">&lt;MastNav /&gt;</code> anywhere in your layout — no further config needed</p>
            </template>
            <TypographyCodeBlock language="vue" class="text-sm">{{ layoutSnippet }}</TypographyCodeBlock>
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
                <div class="bg-(--ui-bg-elevated) rounded-xl p-4">
                  <div class="mb-2 flex items-center gap-2">
                    <UBadge color="success" variant="subtle">router</UBadge>
                    <span class="text-sm font-medium">Standard routing</span>
                  </div>
                  <p class="text-muted text-sm">Always navigates with the Vue router. Good for multi-page apps.</p>
                </div>
                <div class="bg-(--ui-bg-elevated) rounded-xl p-4">
                  <div class="mb-2 flex items-center gap-2">
                    <UBadge color="info" variant="subtle">smooth-scroll</UBadge>
                    <span class="text-sm font-medium">Lenis scroll</span>
                  </div>
                  <p class="text-muted text-sm">Scrolls to <code class="text-primary">#section-id</code> when on the index route. Falls back to router on other pages.</p>
                </div>
              </div>
              <TypographyCodeBlock language="ts" class="text-sm">{{ smoothScrollSnippet }}</TypographyCodeBlock>
            </div>
          </UCard>

          <!-- Active section -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="lucide:radio" class="text-primary" />
                <h3 class="text-xl font-semibold">Active section highlighting</h3>
              </div>
              <p class="text-muted mt-1 text-sm">NavModal reads <code class="text-primary">useState('activeSection')</code> to highlight the current section</p>
            </template>
            <TypographyCodeBlock language="ts" class="text-sm">{{ activeSectionSnippet }}</TypographyCodeBlock>
          </UCard>

          <!-- Composable internals -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="lucide:code-2" class="text-primary" />
                <h3 class="text-xl font-semibold">useMastNav internals</h3>
              </div>
              <p class="text-muted mt-1 text-sm"><code class="text-primary">createSharedComposable</code> ensures the overlay is registered exactly once</p>
            </template>
            <TypographyCodeBlock language="ts" class="text-sm">{{ composableSnippet }}</TypographyCodeBlock>
          </UCard>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
