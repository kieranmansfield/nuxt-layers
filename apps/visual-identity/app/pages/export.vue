<script setup lang="ts">
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

  const activeTab = ref<'css' | 'tailwind' | 'json'>('tailwind')

  const codeMap = computed(() => ({
    css: generateCssVars(),
    tailwind: generateTailwindV4(),
    json: generateJson(),
  }))

  const tabs = [
    { id: 'tailwind' as const, label: 'Tailwind v4', icon: 'i-lucide-wind' },
    { id: 'css' as const, label: 'CSS Variables', icon: 'i-lucide-braces' },
    { id: 'json' as const, label: 'JSON', icon: 'i-lucide-file-json' },
  ]

  const copied = ref(false)

  async function handleCopy() {
    await copyToClipboard(codeMap.value[activeTab.value])
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }

  function handleDownload() {
    if (activeTab.value === 'tailwind') exportTailwindV4()
    else if (activeTab.value === 'css') exportCssVars()
    else exportJson()
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
    <div class="mb-8 flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-(--ui-text) mb-1">Export</h1>
        <p class="text-(--ui-text-muted) text-sm">
          Export your brand configuration as code or a portable JSON file.
        </p>
      </div>
      <div class="flex gap-2">
        <label class="cursor-pointer">
          <UButton icon="i-lucide-upload" variant="outline" color="neutral" size="sm" as="span">
            Import JSON
          </UButton>
          <input type="file" accept=".json" class="hidden" @change="handleImport" />
        </label>
      </div>
    </div>

    <p v-if="importError" class="text-red-500 text-sm mb-4">{{ importError }}</p>

    <div
      v-if="isEmpty"
      class="text-center py-16 text-(--ui-text-muted) border-2 border-dashed border-(--ui-border) rounded-xl"
    >
      <UIcon name="i-lucide-download" class="size-10 mx-auto mb-3" />
      <p class="text-sm mb-4">Add colours and typography settings before exporting.</p>
      <UButton to="/colour/foundation" variant="outline" size="sm"> Get started </UButton>
    </div>

    <div v-else>
      <!-- Summary -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <UCard>
          <div class="flex items-center gap-3">
            <div class="flex -space-x-2">
              <div
                v-for="colour in state.colours.slice(0, 4)"
                :key="colour.id"
                class="size-6 rounded-full border-2 border-(--ui-bg)"
                :style="{ backgroundColor: colour.hex }"
              />
            </div>
            <div>
              <p class="text-xs text-(--ui-text-muted)">Colours</p>
              <p class="font-semibold text-(--ui-text)">{{ state.colours.length }}</p>
            </div>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-type" class="size-5 text-(--ui-text-muted)" />
            <div>
              <p class="text-xs text-(--ui-text-muted)">Font roles</p>
              <p class="font-semibold text-(--ui-text)">{{ state.typography.length }}</p>
            </div>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-sun-moon" class="size-5 text-(--ui-text-muted)" />
            <div>
              <p class="text-xs text-(--ui-text-muted)">Modes</p>
              <p class="font-semibold text-(--ui-text) capitalize">
                {{ state.themeMode.mode.replace('-', ' ') }}
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Tab selector -->
      <div class="flex gap-2 mb-4">
        <UButton
          v-for="tab in tabs"
          :key="tab.id"
          :icon="tab.icon"
          :variant="activeTab === tab.id ? 'solid' : 'outline'"
          size="sm"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </UButton>
      </div>

      <!-- Code block -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <p class="text-xs font-mono text-(--ui-text-muted)">
              {{
                activeTab === 'tailwind'
                  ? 'brand-theme.css'
                  : activeTab === 'css'
                    ? 'brand-variables.css'
                    : 'brand-config.json'
              }}
            </p>
            <div class="flex gap-2">
              <UButton
                :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                variant="ghost"
                size="xs"
                color="neutral"
                @click="handleCopy"
              >
                {{ copied ? 'Copied!' : 'Copy' }}
              </UButton>
              <UButton
                icon="i-lucide-download"
                variant="ghost"
                size="xs"
                color="neutral"
                @click="handleDownload"
              >
                Download
              </UButton>
            </div>
          </div>
        </template>
        <pre
          class="text-xs font-mono text-(--ui-text) overflow-auto max-h-96 leading-relaxed whitespace-pre-wrap"
          >{{ codeMap[activeTab] }}</pre
        >
      </UCard>
    </div>
  </div>
</template>
