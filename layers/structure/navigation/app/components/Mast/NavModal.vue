<script setup lang="ts">
  import type { MastNavLink, MastNavUi } from '../../types/nav'

  // Render once, in the layout. Behaviour lives here (dialog, scroll lock via useMastNav,
  // smooth-scroll vs router, active link); the look comes from `mastNav.ui`, `ui` and slots.
  const {
    open = undefined,
    links = undefined,
    ui = undefined,
  } = defineProps<{
    /** Manual control; omit to follow useMastNav().isOpen. */
    open?: boolean
    /** Replaces `mastNav.links`, e.g. filtered by the site's own page flags. */
    links?: MastNavLink[]
    /** Per-key override of `mastNav.ui` (strings replace, no class merging). */
    ui?: Partial<MastNavUi>
  }>()
  const emit = defineEmits<{
    'update:open': [value: boolean]
    close: []
  }>()

  const config = useAppConfig().mastNav as {
    links: MastNavLink[]
    scrollBehaviour: 'smooth-scroll' | 'router'
    ui: MastNavUi
  }
  const classes = computed(() => ({ ...config.ui, ...ui }))
  const visibleLinks = computed(() => (links ?? config.links).filter((link) => !link.hidden))

  const activeSection = useState<string>('activeSection', () => '')
  const route = useRoute()
  const router = useRouter()
  const { isOpen, close: closeNav } = useMastNav()
  // On the smooth-scroll index every link routes to index, so only the section counts there
  const smoothOnIndex = computed(
    () => config.scrollBehaviour === 'smooth-scroll' && route.name === 'index'
  )

  function matchesRoute(link: MastNavLink) {
    try {
      return router.resolve(link.to).path === route.path
    } catch {
      return false // a named route that doesn't exist
    }
  }

  const activeIds = computed(
    () =>
      new Set(
        visibleLinks.value
          .filter(
            (link) =>
              activeSection.value === link.id || (!smoothOnIndex.value && matchesRoute(link))
          )
          .map((link) => link.id)
      )
  )

  function dismiss() {
    emit('update:open', false)
    emit('close')
    closeNav()
  }

  function navigate(link: MastNavLink) {
    if (smoothOnIndex.value) {
      try {
        useSmoothScroll().scrollTo(`#${link.id}`)
      } catch {}
    } else {
      navigateTo(link.to)
    }
    dismiss()
  }
</script>

<template>
  <!-- UModal supplies the dialog role, focus trap, Escape and portal; the title stays
       visually hidden because the content slot replaces the header. -->
  <UModal
    :open="open ?? isOpen"
    fullscreen
    title="Site navigation"
    :ui="{ overlay: 'z-(--z-modal)', content: `${classes.content} z-(--z-modal)` }"
    @update:open="(value) => !value && dismiss()"
  >
    <template #content>
      <div class="relative flex h-full flex-col items-center justify-center">
        <slot name="close" :close="dismiss">
          <UButton
            icon="lucide:x"
            color="neutral"
            variant="ghost"
            size="xl"
            aria-label="Close navigation"
            :class="classes.close"
            @click="dismiss"
          />
        </slot>

        <slot name="header" />

        <HoverDimGroup as="nav" :class="classes.nav">
          <template v-for="link in visibleLinks" :key="link.id">
            <slot
              name="link"
              :link
              :active="activeIds.has(link.id)"
              :navigate="() => navigate(link)"
            >
              <button
                :class="[classes.link, activeIds.has(link.id) && classes.linkActive]"
                :aria-current="activeIds.has(link.id) ? 'page' : undefined"
                @click="() => navigate(link)"
              >
                {{ link.label }}
              </button>
            </slot>
          </template>
        </HoverDimGroup>

        <slot name="footer" />
      </div>
    </template>
  </UModal>
</template>
