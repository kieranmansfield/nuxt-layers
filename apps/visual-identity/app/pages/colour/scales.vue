<script setup lang="ts">
  import { generateScale } from '~/composables/useTailwindScale'

  const { state } = useBrandState()

  const showOklch = ref(false)

  const scaledColours = computed(() =>
    state.value.colours.map((c) => ({ ...c, scale: generateScale(c.hex) }))
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
    { immediate: true }
  )

  function isOpen(id: string) {
    return openIds.value.includes(id)
  }

  function toggle(id: string) {
    openIds.value = isOpen(id) ? openIds.value.filter((x) => x !== id) : [...openIds.value, id]
  }
</script>

<template>
  <div class="vi-page">
    <div class="mb-6 flex items-start justify-between gap-3">
      <div>
        <h1 class="text-default mb-1 text-2xl font-semibold">Colour Scales</h1>
        <p class="text-muted text-sm">
          Tailwind-compatible 50–950 scales generated in Oklch for perceptual uniformity.
        </p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <span class="text-muted hidden text-xs sm:inline">Show Oklch</span>
        <USwitch v-model="showOklch" size="sm" />
      </div>
    </div>

    <div v-if="state.colours.length === 0" class="text-muted py-16 text-center">
      <UIcon name="i-lucide-layers" class="mx-auto mb-3 size-10" />
      <p class="text-sm">Add colours on the Foundation page first.</p>
      <UButton to="/colour/foundation" variant="outline" class="mt-4" size="sm">
        Go to Foundation
      </UButton>
    </div>

    <div v-else>
      <!-- Mobile: collapsible vertical list (no horizontal scroll) -->
      <div class="flex flex-col gap-3 sm:hidden">
        <div
          v-for="colour in scaledColours"
          :key="colour.id"
          class="border-default overflow-hidden rounded-xl border"
        >
          <!-- Collapse trigger -->
          <button
            class="bg-elevated flex w-full items-center gap-3 px-4 py-3 text-left"
            @click="() => toggle(colour.id)"
          >
            <div
              class="size-5 shrink-0 rounded-full border border-black/10"
              :style="{ backgroundColor: colour.hex }"
            />
            <span class="text-default flex-1 font-medium capitalize">{{ colour.name }}</span>
            <UBadge
              :label="colour.role"
              color="neutral"
              variant="soft"
              size="xs"
              class="shrink-0"
            />
            <UIcon
              :name="isOpen(colour.id) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              class="text-muted size-4 shrink-0"
            />
          </button>

          <!-- Vertical swatch list -->
          <div v-show="isOpen(colour.id)" class="divide-default divide-y">
            <div
              v-for="entry in colour.scale"
              :key="entry.step"
              class="flex items-center gap-3 px-4 py-2.5"
            >
              <div
                class="size-9 shrink-0 rounded-lg border border-black/8"
                :style="{ backgroundColor: entry.hex }"
              />
              <span class="text-default w-10 shrink-0 font-mono text-xs font-semibold">
                {{ entry.step }}
              </span>
              <span class="text-muted min-w-0 flex-1 truncate font-mono text-xs">
                {{ showOklch ? entry.oklchStr : entry.hex }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop: horizontal scale grid rows -->
      <div class="hidden flex-col gap-8 sm:flex">
        <div v-for="colour in scaledColours" :key="colour.id">
          <div class="mb-3 flex items-center gap-3">
            <ColourSwatch :hex="colour.hex" size="sm" />
            <p class="text-default font-medium">{{ colour.name }}</p>
            <UBadge :label="colour.role" color="neutral" variant="soft" size="xs" />
            <span class="text-muted ml-auto font-mono text-xs">{{ colour.hex }}</span>
          </div>
          <ColourScaleRow :name="colour.name" :scale="colour.scale" :show-oklch />
        </div>
      </div>
    </div>
  </div>
</template>
