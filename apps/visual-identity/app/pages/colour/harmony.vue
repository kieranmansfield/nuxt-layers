<script setup lang="ts">
  import type { HarmonyType } from '~/composables/useBrandState'
  import { computeHarmony, HARMONY_LABELS, HARMONY_TYPES } from '~/composables/useColourHarmony'

  const { state, updateColour } = useBrandState()

  const harmonyHexes = (colour: { hex: string; harmonyType: HarmonyType | null }) => {
    if (!colour.harmonyType) return []
    return computeHarmony(colour.hex, colour.harmonyType)
  }

  const harmonyOptions = HARMONY_TYPES.map((t) => ({ label: HARMONY_LABELS[t], value: t }))
</script>

<template>
  <!-- Empty state -->
  <div
    v-if="state.colours.length === 0"
    class="h-full flex flex-col items-center justify-center text-(--ui-text-muted) gap-4"
  >
    <UIcon name="i-lucide-circle-dot" class="size-12" />
    <p class="text-sm">Add colours on the Foundation page first.</p>
    <UButton to="/colour/foundation" variant="outline" size="sm"> Go to Foundation </UButton>
  </div>

  <!-- Scrollable full-height sections -->
  <div v-else class="h-full overflow-y-auto">
    <section
      v-for="colour in state.colours"
      :key="colour.id"
      class="min-h-screen flex flex-col border-b border-(--ui-border) last:border-b-0"
    >
      <!-- Section header -->
      <div class="shrink-0 flex items-center gap-3 px-8 pt-8 pb-4">
        <div
          class="size-5 rounded-full border border-black/10 shrink-0"
          :style="{ backgroundColor: colour.hex }"
        />
        <h2 class="text-lg font-semibold text-(--ui-text)">{{ colour.name }}</h2>
        <UBadge :label="colour.role" color="neutral" variant="soft" size="xs" />
        <span class="text-xs font-mono text-(--ui-text-muted)">{{ colour.hex }}</span>
      </div>

      <!-- Wheel — takes 3/4 of section height -->
      <div class="flex-1 flex items-center justify-center" style="height: 70vh; padding: 2rem 4rem">
        <!-- width: min(65vh, 88%) keeps it square and constrained to the viewport -->
        <div style="width: min(65vh, 88%)">
          <ColourHarmonyWheel :base-hex="colour.hex" :harmony-hexes="harmonyHexes(colour)" />
        </div>
      </div>

      <!-- Controls pinned to the bottom of the section -->
      <div class="shrink-0 border-t border-(--ui-border) bg-(--ui-bg-elevated) px-8 py-6">
        <div class="flex items-start gap-10">
          <!-- Harmony type selector -->
          <div class="shrink-0">
            <label
              class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider block mb-2"
            >
              Harmony
            </label>
            <USelect
              :model-value="colour.harmonyType ?? ''"
              :items="[{ label: 'None', value: '' }, ...harmonyOptions]"
              class="w-52"
              @update:model-value="
                updateColour(colour.id, { harmonyType: ($event || null) as HarmonyType | null })
              "
            />
          </div>

          <!-- Generated swatches -->
          <div class="flex-1">
            <label
              class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider block mb-2"
            >
              Colours
            </label>
            <div class="flex flex-wrap gap-4">
              <!-- Base -->
              <div class="flex flex-col items-center gap-1.5">
                <div
                  class="size-12 rounded-xl border border-black/10 shadow-sm"
                  :style="{ backgroundColor: colour.hex }"
                />
                <p class="text-[10px] font-mono text-(--ui-text-muted)">{{ colour.hex }}</p>
                <p class="text-[10px] text-(--ui-text-muted)">Base</p>
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
                  <p class="text-[10px] font-mono text-(--ui-text-muted)">{{ hex }}</p>
                  <p class="text-[10px] text-(--ui-text-muted)">{{ i + 1 }}</p>
                </div>
              </template>

              <p v-else class="text-sm text-(--ui-text-muted) italic self-center">
                Select a harmony type above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
