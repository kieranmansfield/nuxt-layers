<script setup lang="ts">
  import type { BrandColour } from '~/composables/useBrandState'

  const { state, addColour, removeColour, updateColour } = useBrandState()

  const ROLES: BrandColour['role'][] = ['primary', 'secondary', 'accent', 'neutral', 'custom']

  function onHexInput(id: string, event: Event) {
    updateColour(id, { hex: (event.target as HTMLInputElement).value })
  }
</script>

<template>
  <div class="vi-page">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-default mb-1">Colour Foundation</h1>
      <p class="text-muted text-sm">
        Define your brand colours. Start with a primary and build from there.
      </p>
    </div>

    <!-- Brand identity -->
    <UCard class="mb-6">
      <template #header>
        <p class="text-sm font-medium text-default">Brand Identity</p>
      </template>
      <div class="flex flex-col gap-3">
        <UInput
          :model-value="state.meta.name"
          placeholder="Brand name"
          size="lg"
          @update:model-value="($event) => (state.meta.name = $event)"
        />
        <UInput
          :model-value="state.meta.description"
          placeholder="Short description (optional)"
          @update:model-value="($event) => (state.meta.description = $event)"
        />
      </div>
    </UCard>

    <!-- Colour cards -->
    <div class="flex flex-col gap-3 mb-6">
      <div
        v-for="colour in state.colours"
        :key="colour.id"
        class="p-4 rounded-xl border border-default bg-elevated"
      >
        <!--
          Mobile: 2 rows.
          Desktop: single row via sm:flex-row.
        -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <!-- Row 1 (mobile) / start of row (desktop): picker + hex + swatch -->
          <div class="flex items-center gap-3">
            <label class="cursor-pointer shrink-0">
              <input
                type="color"
                :value="colour.hex"
                @input="($event) => onHexInput(colour.id, $event)"
              />
            </label>
            <UInput
              :model-value="colour.hex"
              class="w-28 font-mono text-sm shrink-0"
              @update:model-value="($event) => updateColour(colour.id, { hex: $event })"
            />
            <ColourSwatch :hex="colour.hex" size="sm" class="shrink-0" />
            <!-- Remove button moves here on mobile -->
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="sm"
              class="sm:hidden ml-auto"
              @click="() => removeColour(colour.id)"
            />
          </div>

          <!-- Row 2 (mobile) / rest of row (desktop): name + role + remove -->
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <UInput
              :model-value="colour.name"
              placeholder="Name"
              class="flex-1 min-w-0"
              @update:model-value="($event) => updateColour(colour.id, { name: $event })"
            />
            <USelect
              :model-value="colour.role"
              :items="
                ROLES.map((r) => ({ label: r.charAt(0).toUpperCase() + r.slice(1), value: r }))
              "
              class="w-32 shrink-0"
              @update:model-value="
                ($event) => updateColour(colour.id, { role: $event as BrandColour['role'] })
              "
            />
            <!-- Remove button on desktop only -->
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="sm"
              class="hidden sm:flex shrink-0"
              @click="() => removeColour(colour.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <UButton icon="i-lucide-plus" variant="outline" @click="addColour"> Add colour </UButton>

    <!-- Empty state -->
    <div
      v-if="state.colours.length === 0"
      class="mt-8 text-center py-12 border-2 border-dashed border-default rounded-xl"
    >
      <UIcon name="i-lucide-palette" class="size-10 text-muted mx-auto mb-3" />
      <p class="text-muted text-sm">No colours yet. Add your first brand colour.</p>
    </div>
  </div>
</template>
