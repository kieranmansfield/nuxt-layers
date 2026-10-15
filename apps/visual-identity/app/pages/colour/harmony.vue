<script setup lang="ts">
  import type { TabsItem } from '@nuxt/ui'

  import type { HarmonyType } from '~/composables/useBrandState'
  import { computeHarmony } from '~/composables/useColourHarmony'

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
    class="text-muted flex h-full flex-col items-center justify-center gap-4"
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
      class="border-default flex min-h-screen flex-col border-b last:border-b-0"
    >
      <!-- Section header -->
      <div class="flex shrink-0 items-center gap-3 px-4 pt-6 pb-4 sm:px-8 sm:pt-8">
        <div
          class="size-5 shrink-0 rounded-full border border-black/10"
          :style="{ backgroundColor: colour.hex }"
        />
        <h2 class="text-default text-lg font-semibold">{{ colour.name }}</h2>
        <UBadge :label="colour.role" color="neutral" variant="soft" size="xs" />
        <span class="text-muted hidden font-mono text-xs sm:inline">{{ colour.hex }}</span>
      </div>

      <!-- Wheel -->
      <div
        class="flex flex-1 items-center justify-center"
        style="height: 70vh; padding: 1.5rem 2rem"
      >
        <div style="width: min(65vh, 88%)">
          <ColourHarmonyWheel :base-hex="colour.hex" :harmony-hexes="harmonyHexes(colour)" />
        </div>
      </div>

      <!-- Controls: tabs across the top, swatches below -->
      <div class="border-default bg-elevated shrink-0 border-t px-4 pt-4 pb-6 sm:px-8">
        <!-- Harmony type tabs — tap to explore, selection saves immediately -->
        <UTabs
          :model-value="colour.harmonyType ?? 'none'"
          :content="false"
          :items="harmonyTabs"
          color="neutral"
          variant="link"
          size="sm"
          class="mb-5 w-full"
          @update:model-value="($event) => setHarmony(colour.id, $event)"
        />

        <!-- Swatches -->
        <div class="flex flex-wrap gap-4">
          <!-- Base -->
          <div class="flex flex-col items-center gap-1.5">
            <div
              class="size-12 rounded-xl border border-black/10 shadow-sm"
              :style="{ backgroundColor: colour.hex }"
            />
            <p class="text-muted font-mono text-[10px]">{{ colour.hex }}</p>
            <p class="text-muted text-[10px]">Base</p>
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
              <p class="text-muted font-mono text-[10px]">{{ hex }}</p>
              <p class="text-muted text-[10px]">{{ i + 1 }}</p>
            </div>
          </template>

          <p v-else class="text-muted self-center text-sm italic">
            Tap a harmony type above to explore.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
