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
  () => codeMap.value[activeTab.value as keyof typeof codeMap.value] ?? '',
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
    }
    catch {
      importError.value = 'Invalid brand configuration file.'
    }
  }
  reader.readAsText(file)
}

const isEmpty = computed(() => state.value.colours.length === 0)
</script>

<template>
  <div class="vi-page">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-default mb-1">Export</h1>
        <p class="text-muted text-sm">
          Export your brand configuration as code or a portable JSON file.
        </p>
      </div>
      <label class="cursor-pointer shrink-0">
        <UButton icon="i-lucide-upload" variant="outline" color="neutral" size="sm" as="span">
          Import JSON
        </UButton>
        <input type="file" accept=".json" class="hidden" @change="handleImport" />
      </label>
    </div>

    <p v-if="importError" class="text-red-500 text-sm mb-4">{{ importError }}</p>

    <div
      v-if="isEmpty"
      class="text-center py-16 text-muted border-2 border-dashed border-default rounded-xl"
    >
      <UIcon name="i-lucide-download" class="size-10 mx-auto mb-3" />
      <p class="text-sm mb-4">Add colours and typography settings before exporting.</p>
      <UButton to="/colour/foundation" variant="outline" size="sm">Get started</UButton>
    </div>

    <div v-else>
      <!-- Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <UCard>
          <div class="flex items-center gap-3">
            <div class="flex -space-x-2">
              <div
                v-for="colour in state.colours.slice(0, 4)"
                :key="colour.id"
                class="size-6 rounded-full border-2 border-default"
                :style="{ backgroundColor: colour.hex }"
              />
            </div>
            <div>
              <p class="text-xs text-muted">Colours</p>
              <p class="font-semibold text-default">{{ state.colours.length }}</p>
            </div>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-type" class="size-5 text-muted shrink-0" />
            <div>
              <p class="text-xs text-muted">Font roles</p>
              <p class="font-semibold text-default">{{ state.typography.length }}</p>
            </div>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-sun-moon" class="size-5 text-muted shrink-0" />
            <div>
              <p class="text-xs text-muted">Modes</p>
              <p class="font-semibold text-default capitalize">
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
      <UTabs
        v-model="activeTab"
        :content="false"
        :items="tabItems"
        color="neutral"
        class="mb-4"
      />

      <!-- Code block -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <p class="text-xs font-mono text-muted truncate">
              {{ fileNames[activeTab] }}
            </p>
            <div class="flex gap-2 shrink-0">
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
          class="text-xs font-mono text-default overflow-auto max-h-96 leading-relaxed whitespace-pre-wrap"
        >{{ currentCode }}</pre>
      </UCard>
    </div>
  </div>
</template>
