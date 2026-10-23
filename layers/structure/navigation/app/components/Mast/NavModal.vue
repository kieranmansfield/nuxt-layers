<script setup lang="ts">
  import type { MastNavLink } from '../../types/nav'

  const { open } = defineProps<{ open?: boolean }>()
  const emit = defineEmits<{
    'update:open': [value: boolean]
    close: []
  }>()

  const { links, scrollBehaviour } = useAppConfig().mastNav as {
    links: MastNavLink[]
    scrollBehaviour: string
  }
  const activeSection = useState<string>('activeSection', () => '')
  const route = useRoute()
  const { close: closeNav } = useMastNav()

  function dismiss() {
    emit('update:open', false)
    emit('close')
    closeNav()
  }

  function handleNav(link: MastNavLink) {
    if (scrollBehaviour === 'smooth-scroll' && route.name === 'index') {
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
    :open
    fullscreen
    title="Site navigation"
    :ui="{ overlay: 'z-(--z-modal)', content: 'bg-default text-default z-(--z-modal)' }"
    @update:open="(value) => !value && dismiss()"
  >
    <template #content>
      <div class="relative flex h-full flex-col items-center justify-center">
        <UButton
          icon="lucide:x"
          color="neutral"
          variant="ghost"
          size="xl"
          aria-label="Close navigation"
          class="absolute top-4 right-4"
          @click="dismiss"
        />

        <HoverDimGroup tag="nav" class="flex flex-col items-center gap-2">
          <button
            v-for="link in links"
            :key="link.id"
            class="cursor-pointer border-0 bg-transparent px-4 py-3 text-3xl tracking-widest uppercase transition-all"
            :class="activeSection === link.id ? 'font-normal' : 'font-light'"
            @click="() => handleNav(link)"
          >
            {{ link.label }}
          </button>
        </HoverDimGroup>
      </div>
    </template>
  </UModal>
</template>
