<script setup lang="ts">
  import type { TabsItem } from '@nuxt/ui'

  const { state, importState } = useBrandState()
  const {
    generateCssVars,
    generateTailwindV4,
    generateJson,
    exportCssVars,
    exportTailwindV4,
    exportJson,
    copyToClipboard,
  } = useExport()

  const activeTab = ref('tailwind')

  const tabItems: TabsItem[] = [
    { label: 'Tailwind v4', icon: 'i-lucide-wind', value: 'tailwind' },
    { label: 'CSS Variables', icon: 'i-lucide-braces', value: 'css' },
    { label: 'JSON', icon: 'i-lucide-file-json', value: 'json' },
  ]

  const codeMap = computed(() => ({
    tailwind: generateTailwindV4(),
    css: generateCssVars(),
    json: generateJson(),
  }))

  const fileNames: Record<string, string> = {
    tailwind: 'brand-theme.css',
    css: 'brand-variables.css',
    json: 'brand-config.json',
  }

  const currentCode = computed(
    () => codeMap.value[activeTab.value as keyof typeof codeMap.value] ?? ''
  )

  const copied = ref(false)

  async function handleCopy() {
    await copyToClipboard(currentCode.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }

  function handleDownload() {
    const actions: Record<string, () => void> = {
      tailwind: exportTailwindV4,
      css: exportCssVars,
      json: exportJson,
    }
    actions[activeTab.value]?.()
  }

  const importError = ref('')

  function handleImport(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        importState(e.target?.result as string)
        importError.value = ''
      } catch {
        importError.value = 'Invalid brand configuration file.'
      }
    }
    reader.readAsText(file)
  }

  const isEmpty = computed(() => state.value.colours.length === 0)
</script>

<template>
  <div class="vi-page">
    <div class="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
      <div>
        <h1 class="text-default mb-1 text-2xl font-semibold">Export</h1>
        <p class="text-muted text-sm">
          Export your brand configuration as code or a portable JSON file.
        </p>
      </div>
      <label class="shrink-0 cursor-pointer">
        <UButton icon="i-lucide-upload" variant="outline" color="neutral" size="sm" as="span">
          Import JSON
        </UButton>
        <input type="file" accept=".json" class="hidden" @change="handleImport" />
      </label>
    </div>

    <p v-if="importError" class="mb-4 text-sm text-red-500">{{ importError }}</p>

    <div
      v-if="isEmpty"
      class="text-muted border-default rounded-xl border-2 border-dashed py-16 text-center"
    >
      <UIcon name="i-lucide-download" class="mx-auto mb-3 size-10" />
      <p class="mb-4 text-sm">Add colours and typography settings before exporting.</p>
      <UButton to="/colour/foundation" variant="outline" size="sm">Get started</UButton>
    </div>

    <div v-else>
      <!-- Summary -->
      <div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <UCard>
          <div class="flex items-center gap-3">
            <div class="flex -space-x-2">
              <div
                v-for="colour in state.colours.slice(0, 4)"
                :key="colour.id"
                class="border-default size-6 rounded-full border-2"
                :style="{ backgroundColor: colour.hex }"
              />
            </div>
            <div>
              <p class="text-muted text-xs">Colours</p>
              <p class="text-default font-semibold">{{ state.colours.length }}</p>
            </div>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-type" class="text-muted size-5 shrink-0" />
            <div>
              <p class="text-muted text-xs">Font roles</p>
              <p class="text-default font-semibold">{{ state.typography.length }}</p>
            </div>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-sun-moon" class="text-muted size-5 shrink-0" />
            <div>
              <p class="text-muted text-xs">Modes</p>
              <p class="text-default font-semibold capitalize">
                {{ state.themeMode.schemes.join(' & ') }}
                <span v-if="state.themeMode.contrastLevels.length > 1" class="text-muted text-xs">
                  · {{ state.themeMode.contrastLevels.length }} contrast levels
                </span>
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Format tabs — UTabs replaces the manual button cluster -->
      <UTabs v-model="activeTab" :content="false" :items="tabItems" color="neutral" class="mb-4" />

      <!-- Code block -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <p class="text-muted truncate font-mono text-xs">
              {{ fileNames[activeTab] }}
            </p>
            <div class="flex shrink-0 gap-2">
              <UButton
                :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                variant="ghost"
                size="xs"
                color="neutral"
                @click="handleCopy"
              >
                <span class="hidden sm:inline">{{ copied ? 'Copied!' : 'Copy' }}</span>
              </UButton>
              <UButton
                icon="i-lucide-download"
                variant="ghost"
                size="xs"
                color="neutral"
                @click="handleDownload"
              >
                <span class="hidden sm:inline">Download</span>
              </UButton>
            </div>
          </div>
        </template>
        <pre
          class="text-default max-h-96 overflow-auto font-mono text-xs leading-relaxed whitespace-pre-wrap"
          >{{ currentCode }}</pre>
      </UCard>
    </div>
  </div>
</template>
