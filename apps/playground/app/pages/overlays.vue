<script setup lang="ts">
const { setPageAccent } = useAccentColor()
setPageAccent('rose')
onUnmounted(() => setPageAccent(null))

const toast = useAppToast()
const { open: openConfirm } = useConfirmModal()
const { open: openInfo } = useInfoModal()
const { open: openForm } = useFormModal()

// Toast demos
const customDuration = ref(3000)
const customTitle = ref('Custom toast')
const customDesc = ref('')

function openFormDemo() {
  openForm({ onSubmit: (data: { name: string }) => toast.success(`Message from ${data.name} received!`) })
}

function openSizePreview(size: string) {
  openInfo({ title: `Size: ${size}`, body: `This modal uses size="${size}"`, icon: 'lucide:maximize-2' })
}

function fireCustomToast() {
  toast.info(customTitle.value || 'Custom toast', {
    description: customDesc.value || undefined,
    duration: customDuration.value,
  })
}

// Code snippets
const toastSetupSnippet = `// Auto-available via ui layer — no setup needed.
// UNotifications is mounted in the root layout.`

const toastUsageSnippet = `const toast = useAppToast()

toast.success('File saved')
toast.error('Upload failed', { description: 'Max file size is 10MB' })
toast.info('Update available', { duration: 8000 })
toast.warning('Unsaved changes')`

const createModalSnippet = `// 1. Write a modal component that extends BaseModal
// components/ConfirmModal.vue
<BaseModal :open title="Are you sure?" size="sm" v-bind="$attrs">
  <template #footer="{ dismiss }">
    <UButton variant="ghost" @click="dismiss">Cancel</UButton>
    <UButton color="error" @click="confirm">Delete</UButton>
  </template>
</BaseModal>

// 2. Register it with createModal — one line
// composables/useConfirmModal.ts
import ConfirmModal from '../components/ConfirmModal.vue'
export const useConfirmModal = createModal(ConfirmModal)

// 3. Use it anywhere
const { open, close, patch } = useConfirmModal()
open({ confirmLabel: 'Yes, delete it', onConfirm: () => toast.success('Deleted!') })`

const baseModalSlotSnippet = `<BaseModal :open title="My modal" description="Optional subtitle" size="lg">
  <!-- default slot: body content -->
  <p>Your content here</p>

  <!-- header slot: fully replaces the header -->
  <template #header>
    <CustomHeader />
  </template>

  <!-- footer slot: receives dismiss() helper -->
  <template #footer="{ dismiss }">
    <UButton variant="ghost" @click="dismiss">Cancel</UButton>
    <UButton @click="save">Save</UButton>
  </template>
</BaseModal>`

const overlayProviderSnippet = `<!-- Mounted once in the root layout (ui layer default.vue + playground app.vue) -->
<UOverlayProvider />  <!-- renders all createModal / useModal overlays -->
<UNotifications />    <!-- renders useToast / useAppToast notifications -->`

definePageMeta({
  layout: { name: 'grid', props: { showHeader: true, showFooter: true } },
})
</script>

<template>
  <LayoutPage title="Overlays Demo" description="Toasts, modals, and the overlay system">
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-16 py-8">
          <LayoutPageHeader
            title="Overlays"
            description="useAppToast, BaseModal, createModal — and the providers that wire them together"
            back="/"
          />

          <!-- ─── TOASTS ─────────────────────────────────────────────── -->
          <section class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold">Toasts</h2>
              <p class="text-muted mt-1 text-sm">
                <code class="text-primary">useAppToast()</code> — shorthand methods around Nuxt UI's <code class="text-primary">useToast()</code>
              </p>
            </div>

            <!-- Quick fire -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="lucide:bell" class="text-primary" />
                  <h3 class="text-lg font-semibold">Quick fire</h3>
                </div>
              </template>
              <div class="flex flex-wrap gap-3">
                <UButton
                  color="success"
                  variant="subtle"
                  icon="lucide:check-circle"
                  @click="toast.success('Changes saved successfully')"
                >
                  Success
                </UButton>
                <UButton
                  color="error"
                  variant="subtle"
                  icon="lucide:x-circle"
                  @click="toast.error('Upload failed', { description: 'Maximum file size is 10 MB' })"
                >
                  Error
                </UButton>
                <UButton
                  color="info"
                  variant="subtle"
                  icon="lucide:info"
                  @click="toast.info('A new version is available', { description: 'Refresh the page to update' })"
                >
                  Info
                </UButton>
                <UButton
                  color="warning"
                  variant="subtle"
                  icon="lucide:triangle-alert"
                  @click="toast.warning('You have unsaved changes')"
                >
                  Warning
                </UButton>
              </div>
              <template #footer>
                <TypographyCodeBlock language="ts" class="text-sm">{{ toastUsageSnippet }}</TypographyCodeBlock>
              </template>
            </UCard>

            <!-- Custom toast builder -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="lucide:sliders-horizontal" class="text-primary" />
                  <h3 class="text-lg font-semibold">Custom toast builder</h3>
                </div>
              </template>
              <div class="space-y-4">
                <div class="grid gap-4 md:grid-cols-2">
                  <UFormField label="Title">
                    <UInput v-model="customTitle" placeholder="Toast title" class="w-full" />
                  </UFormField>
                  <UFormField label="Description (optional)">
                    <UInput v-model="customDesc" placeholder="More detail..." class="w-full" />
                  </UFormField>
                </div>
                <UFormField :label="`Duration: ${customDuration}ms`">
                  <input
                    v-model.number="customDuration"
                    type="range"
                    min="1000"
                    max="10000"
                    step="500"
                    class="w-full accent-[var(--ui-color-primary-500)]"
                  >
                </UFormField>
                <UButton icon="lucide:send" @click="fireCustomToast">
                  Fire toast
                </UButton>
              </div>
            </UCard>

            <!-- Setup note -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="lucide:plug" class="text-primary" />
                  <h3 class="text-lg font-semibold">Zero setup</h3>
                </div>
                <p class="text-muted mt-1 text-sm">UNotifications is mounted in the layout — nothing to configure</p>
              </template>
              <TypographyCodeBlock language="ts" class="text-sm">{{ toastSetupSnippet }}</TypographyCodeBlock>
            </UCard>
          </section>

          <!-- ─── MODALS ─────────────────────────────────────────────── -->
          <section class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold">Modals</h2>
              <p class="text-muted mt-1 text-sm">
                <code class="text-primary">createModal(Component)</code> — register any overlay-compatible component as a shared modal composable
              </p>
            </div>

            <!-- Live modal demos -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="lucide:layers" class="text-primary" />
                  <h3 class="text-lg font-semibold">Live demos</h3>
                </div>
                <p class="text-muted mt-1 text-sm">Each button opens a different modal built with <code class="text-primary">BaseModal</code></p>
              </template>
              <div class="flex flex-wrap gap-3">
                <UButton
                  color="error"
                  variant="subtle"
                  icon="lucide:trash-2"
                  @click="openConfirm({
                    title: 'Delete project?',
                    description: 'All files and data will be permanently removed.',
                    confirmLabel: 'Yes, delete it',
                    onConfirm: () => toast.success('Project deleted'),
                  })"
                >
                  Confirm modal
                </UButton>
                <UButton
                  color="info"
                  variant="subtle"
                  icon="lucide:info"
                  @click="openInfo({
                    title: 'How layers work',
                    body: 'Each layer is an independent Nuxt package that extends your app with components, composables, and configuration. Layers are resolved in order, with later layers taking precedence.',
                    icon: 'lucide:layers',
                  })"
                >
                  Info modal
                </UButton>
                <UButton
                  variant="subtle"
                  icon="lucide:mail"
                  @click="openFormDemo"
                >
                  Form modal
                </UButton>
              </div>
            </UCard>

            <!-- createModal pattern -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="lucide:wand-2" class="text-primary" />
                  <h3 class="text-lg font-semibold">The createModal pattern</h3>
                </div>
                <p class="text-muted mt-1 text-sm">Three steps: write the component, register it, call it</p>
              </template>
              <TypographyCodeBlock language="vue" class="text-sm">{{ createModalSnippet }}</TypographyCodeBlock>
            </UCard>

            <!-- BaseModal slots -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="lucide:puzzle" class="text-primary" />
                  <h3 class="text-lg font-semibold">BaseModal slots</h3>
                </div>
                <p class="text-muted mt-1 text-sm">Sizes: <code class="text-primary">sm</code> · <code class="text-primary">md</code> · <code class="text-primary">lg</code> · <code class="text-primary">xl</code> · <code class="text-primary">full</code></p>
              </template>
              <div class="space-y-4">
                <!-- Size preview -->
                <div class="flex flex-wrap gap-2">
                  <UButton
                    v-for="size in ['sm', 'md', 'lg', 'xl']"
                    :key="size"
                    size="sm"
                    variant="outline"
                    @click="openSizePreview(size)"
                  >
                    {{ size }}
                  </UButton>
                </div>
                <TypographyCodeBlock language="vue" class="text-sm">{{ baseModalSlotSnippet }}</TypographyCodeBlock>
              </div>
            </UCard>
          </section>

          <!-- ─── PROVIDER SETUP ─────────────────────────────────────── -->
          <section class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold">Provider setup</h2>
              <p class="text-muted mt-1 text-sm">Both providers are mounted once at the app root</p>
            </div>
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="lucide:cpu" class="text-primary" />
                  <h3 class="text-lg font-semibold">UOverlayProvider + UNotifications</h3>
                </div>
                <p class="text-muted mt-1 text-sm">Added to the ui layer's default layout and the playground's app.vue</p>
              </template>
              <TypographyCodeBlock language="html" class="text-sm">{{ overlayProviderSnippet }}</TypographyCodeBlock>
            </UCard>
          </section>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPage>
</template>
