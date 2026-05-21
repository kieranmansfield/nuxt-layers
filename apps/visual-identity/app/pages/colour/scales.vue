<script setup lang="ts">
import { generateScale } from '~/composables/useTailwindScale'

const { state } = useBrandState()

const showOklch = ref(false)

const scaledColours = computed(() =>
  state.value.colours.map((c) => ({ ...c, scale: generateScale(c.hex) })),
)

// Track which sections are open on mobile (default: first colour open)
const openIds = ref<string[]>([])

watch(
  scaledColours,
  (colours) => {
    if (colours[0] && !openIds.value.includes(colours[0].id)) {
      openIds.value = [colours[0].id]
    }
  },
  { immediate: true },
)

function isOpen(id: string) {
  return openIds.value.includes(id)
}

function toggle(id: string) {
  openIds.value = isOpen(id)
    ? openIds.value.filter((x) => x !== id)
    : [...openIds.value, id]
}
</script>

<template>
  <div class="vi-page">
    <div class="mb-6 flex items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-default mb-1">Colour Scales</h1>
        <p class="text-muted text-sm">
          Tailwind-compatible 50–950 scales generated in Oklch for perceptual uniformity.
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span class="text-xs text-muted hidden sm:inline">Show Oklch</span>
        <USwitch v-model="showOklch" size="sm" />
      </div>
    </div>

    <div v-if="state.colours.length === 0" class="text-center py-16 text-muted">
      <UIcon name="i-lucide-layers" class="size-10 mx-auto mb-3" />
      <p class="text-sm">Add colours on the Foundation page first.</p>
      <UButton to="/colour/foundation" variant="outline" class="mt-4" size="sm">
        Go to Foundation
      </UButton>
    </div>

    <div v-else>
      <!-- Mobile: collapsible vertical list (no horizontal scroll) -->
      <div class="sm:hidden flex flex-col gap-3">
        <div
          v-for="colour in scaledColours"
          :key="colour.id"
          class="border border-default rounded-xl overflow-hidden"
        >
          <!-- Collapse trigger -->
          <button
            class="w-full flex items-center gap-3 px-4 py-3 bg-elevated text-left"
            @click="toggle(colour.id)"
          >
            <div
              class="size-5 rounded-full border border-black/10 shrink-0"
              :style="{ backgroundColor: colour.hex }"
            />
            <span class="font-medium text-default flex-1 capitalize">{{ colour.name }}</span>
            <UBadge :label="colour.role" color="neutral" variant="soft" size="xs" class="shrink-0" />
            <UIcon
              :name="isOpen(colour.id) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              class="size-4 text-muted shrink-0"
            />
          </button>

          <!-- Vertical swatch list -->
          <div v-show="isOpen(colour.id)" class="divide-y divide-default">
            <div
              v-for="entry in colour.scale"
              :key="entry.step"
              class="flex items-center gap-3 px-4 py-2.5"
            >
              <div
                class="size-9 rounded-lg shrink-0 border border-black/8"
                :style="{ backgroundColor: entry.hex }"
              />
              <span class="text-xs font-mono w-10 shrink-0 text-default font-semibold">
                {{ entry.step }}
              </span>
              <span class="text-xs font-mono text-muted flex-1 min-w-0 truncate">
                {{ showOklch ? entry.oklchStr : entry.hex }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop: horizontal scale grid rows -->
      <div class="hidden sm:flex flex-col gap-8">
        <div v-for="colour in scaledColours" :key="colour.id">
          <div class="flex items-center gap-3 mb-3">
            <ColourSwatch :hex="colour.hex" size="sm" />
            <p class="font-medium text-default">{{ colour.name }}</p>
            <UBadge :label="colour.role" color="neutral" variant="soft" size="xs" />
            <span class="text-xs text-muted font-mono ml-auto">{{ colour.hex }}</span>
          </div>
          <ColourScaleRow :name="colour.name" :scale="colour.scale" :show-oklch="showOklch" />
        </div>
      </div>
    </div>
  </div>
</template>
