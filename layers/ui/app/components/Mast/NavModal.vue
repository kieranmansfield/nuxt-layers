<script setup lang="ts">
const { open } = defineProps<{ open?: boolean }>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  'close': []
}>()

const { links, scrollBehaviour } = useAppConfig().mastNav
const activeSection = useState<string>('activeSection', () => '')
const route = useRoute()
const { close: closeNav } = useMastNav()

function dismiss() {
  emit('update:open', false)
  emit('close')
  closeNav()
}

function handleNav(link: { id: string; to: string | { name: string; params?: Record<string, unknown>; query?: Record<string, unknown> } }) {
  if (scrollBehaviour === 'smooth-scroll' && route.name === 'index') {
    try { useSmoothScroll().scrollTo(`#${link.id}`) }
    catch {}
  }
  else {
    navigateTo(link.to)
  }
  dismiss()
}
</script>

<template>
  <Transition name="nav-modal">
    <div
      v-if="open"
      class="bg-(--ui-bg) text-(--ui-text) fixed inset-0 flex flex-col items-center justify-center"
      :style="{ zIndex: useGridConfig().useZIndex('modal') }"
    >
      <button
        class="absolute right-[5vw] top-[3vh] cursor-pointer border-0 bg-transparent p-2"
        aria-label="Close navigation"
        @click="dismiss"
      >
        <UIcon name="lucide:x" class="size-7" />
      </button>

      <LinksGroup tag="nav" class="flex flex-col items-center gap-2">
        <button
          v-for="link in links"
          :key="link.id"
          class="cursor-pointer border-0 bg-transparent px-4 py-3 text-3xl uppercase tracking-widest transition-all"
          :class="activeSection === link.id ? 'font-normal' : 'font-light'"
          @click="handleNav(link)"
        >
          {{ link.label }}
        </button>
      </LinksGroup>
    </div>
  </Transition>
</template>

<style scoped>
.nav-modal-enter-active,
.nav-modal-leave-active {
  transition: opacity 300ms ease;
}
.nav-modal-enter-from,
.nav-modal-leave-to {
  opacity: 0;
}
</style>
