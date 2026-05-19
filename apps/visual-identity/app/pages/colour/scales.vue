<script setup lang="ts">
import { generateScale } from '~/composables/useTailwindScale'

const { state } = useBrandState()

const showOklch = ref(false)

const scaledColours = computed(() =>
  state.value.colours.map((c) => ({
    ...c,
    scale: generateScale(c.hex),
  })),
)
</script>

<template>
  <div class="vi-page">
    <div class="mb-6 flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-(--ui-text) mb-1">Colour Scales</h1>
        <p class="text-(--ui-text-muted) text-sm">
          Tailwind-compatible 50–950 scales generated in Oklch for perceptual uniformity.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-(--ui-text-muted)">Show Oklch</span>
        <USwitch v-model="showOklch" size="sm" />
      </div>
    </div>

    <div v-if="state.colours.length === 0" class="text-center py-16 text-(--ui-text-muted)">
      <UIcon name="i-lucide-layers" class="size-10 mx-auto mb-3" />
      <p class="text-sm">Add colours on the Foundation page first.</p>
      <UButton to="/colour/foundation" variant="outline" class="mt-4" size="sm">
        Go to Foundation
      </UButton>
    </div>

    <div v-else class="flex flex-col gap-8">
      <div v-for="colour in scaledColours" :key="colour.id">
        <div class="flex items-center gap-3 mb-3">
          <ColourSwatch :hex="colour.hex" size="sm" />
          <p class="font-medium text-(--ui-text)">{{ colour.name }}</p>
          <UBadge :label="colour.role" color="neutral" variant="soft" size="xs" />
          <span class="text-xs text-(--ui-text-muted) font-mono ml-auto">{{ colour.hex }}</span>
        </div>
        <ColourScaleRow
          :name="colour.name"
          :scale="colour.scale"
          :show-oklch="showOklch"
        />
      </div>
    </div>
  </div>
</template>
