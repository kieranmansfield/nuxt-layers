<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { HARMONY_LABELS, HARMONY_TYPES, computeHarmony } from '~/composables/useColourHarmony'
import type { HarmonyType } from '~/composables/useBrandState'

const { state, updateColour } = useBrandState()

const harmonyHexes = (colour: { hex: string; harmonyType: HarmonyType | null }) => {
  if (!colour.harmonyType) return []
  return computeHarmony(colour.hex, colour.harmonyType)
}

// UTabs items — shorter labels for compact display
const harmonyTabs: TabsItem[] = [
  { label: 'None', value: 'none' },
  { label: 'Complement.', value: 'complementary' },
  { label: 'Analogous', value: 'analogous' },
  { label: 'Triadic', value: 'triadic' },
  { label: 'Split', value: 'split-complementary' },
  { label: 'Tetradic', value: 'tetradic' },
]

function setHarmony(id: string, raw: string | number | undefined) {
  const v = String(raw ?? 'none')
  updateColour(id, { harmonyType: v === 'none' ? null : (v as HarmonyType) })
}
</script>

<template>
  <!-- Empty state -->
  <div
    v-if="state.colours.length === 0"
    class="h-full flex flex-col items-center justify-center text-muted gap-4"
  >
    <UIcon name="i-lucide-circle-dot" class="size-12" />
    <p class="text-sm">Add colours on the Foundation page first.</p>
    <UButton to="/colour/foundation" variant="outline" size="sm">Go to Foundation</UButton>
  </div>

  <!-- Scrollable full-height sections -->
  <div v-else class="h-full overflow-y-auto">
    <section
      v-for="colour in state.colours"
      :key="colour.id"
      class="min-h-screen flex flex-col border-b border-default last:border-b-0"
    >
      <!-- Section header -->
      <div class="shrink-0 flex items-center gap-3 px-4 sm:px-8 pt-6 sm:pt-8 pb-4">
        <div
          class="size-5 rounded-full border border-black/10 shrink-0"
          :style="{ backgroundColor: colour.hex }"
        />
        <h2 class="text-lg font-semibold text-default">{{ colour.name }}</h2>
        <UBadge :label="colour.role" color="neutral" variant="soft" size="xs" />
        <span class="text-xs font-mono text-muted hidden sm:inline">{{ colour.hex }}</span>
      </div>

      <!-- Wheel -->
      <div class="flex-1 flex items-center justify-center" style="height: 70vh; padding: 1.5rem 2rem">
        <div style="width: min(65vh, 88%)">
          <ColourHarmonyWheel
            :base-hex="colour.hex"
            :harmony-hexes="harmonyHexes(colour)"
          />
        </div>
      </div>

      <!-- Controls: tabs across the top, swatches below -->
      <div class="shrink-0 border-t border-default bg-elevated px-4 sm:px-8 pt-4 pb-6">
        <!-- Harmony type tabs — tap to explore, selection saves immediately -->
        <UTabs
          :model-value="colour.harmonyType ?? 'none'"
          :content="false"
          :items="harmonyTabs"
          color="neutral"
          variant="link"
          size="sm"
          class="mb-5 w-full"
          @update:model-value="setHarmony(colour.id, $event)"
        />

        <!-- Swatches -->
        <div class="flex flex-wrap gap-4">
          <!-- Base -->
          <div class="flex flex-col items-center gap-1.5">
            <div
              class="size-12 rounded-xl border border-black/10 shadow-sm"
              :style="{ backgroundColor: colour.hex }"
            />
            <p class="text-[10px] font-mono text-muted">{{ colour.hex }}</p>
            <p class="text-[10px] text-muted">Base</p>
          </div>

          <template v-if="colour.harmonyType">
            <div
              v-for="(hex, i) in harmonyHexes(colour)"
              :key="i"
              class="flex flex-col items-center gap-1.5"
            >
              <div
                class="size-12 rounded-xl border border-black/10 shadow-sm"
                :style="{ backgroundColor: hex }"
              />
              <p class="text-[10px] font-mono text-muted">{{ hex }}</p>
              <p class="text-[10px] text-muted">{{ i + 1 }}</p>
            </div>
          </template>

          <p v-else class="text-sm text-muted italic self-center">
            Tap a harmony type above to explore.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
