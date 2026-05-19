<script setup lang="ts">
import type { BrandColour } from '~/composables/useBrandState'

const { state, addColour, removeColour, updateColour } = useBrandState()

const ROLES: BrandColour['role'][] = ['primary', 'secondary', 'accent', 'neutral', 'custom']

function onHexInput(id: string, event: Event) {
  const value = (event.target as HTMLInputElement).value
  updateColour(id, { hex: value })
}

function onNameInput(id: string, event: Event) {
  const value = (event.target as HTMLInputElement).value
  updateColour(id, { name: value })
}
</script>

<template>
  <div class="vi-page">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-(--ui-text) mb-1">Colour Foundation</h1>
      <p class="text-(--ui-text-muted) text-sm">
        Define your brand colours. Start with a primary and build from there.
      </p>
    </div>

    <!-- Brand name -->
    <UCard class="mb-6">
      <template #header>
        <p class="text-sm font-medium text-(--ui-text)">Brand Identity</p>
      </template>
      <div class="flex flex-col gap-3">
        <UInput
          :model-value="state.meta.name"
          placeholder="Brand name"
          size="lg"
          @update:model-value="state.meta.name = $event"
        />
        <UInput
          :model-value="state.meta.description"
          placeholder="Short description (optional)"
          @update:model-value="state.meta.description = $event"
        />
      </div>
    </UCard>

    <!-- Colours list -->
    <div class="flex flex-col gap-3 mb-6">
      <div
        v-for="colour in state.colours"
        :key="colour.id"
        class="flex items-center gap-4 p-4 rounded-xl border border-(--ui-border) bg-(--ui-bg-elevated)"
      >
        <!-- Native colour picker -->
        <label class="cursor-pointer shrink-0">
          <input
            type="color"
            :value="colour.hex"
            @input="onHexInput(colour.id, $event)"
          />
        </label>

        <!-- Hex input -->
        <UInput
          :model-value="colour.hex"
          class="w-28 font-mono text-sm"
          @update:model-value="updateColour(colour.id, { hex: $event })"
        />

        <!-- Name -->
        <UInput
          :model-value="colour.name"
          placeholder="Name"
          class="flex-1"
          @input="onNameInput(colour.id, $event)"
        />

        <!-- Role -->
        <USelect
          :model-value="colour.role"
          :items="ROLES.map((r) => ({ label: r.charAt(0).toUpperCase() + r.slice(1), value: r }))"
          class="w-32"
          @update:model-value="updateColour(colour.id, { role: $event as BrandColour['role'] })"
        />

        <!-- Preview -->
        <div class="flex gap-1 shrink-0">
          <ColourSwatch :hex="colour.hex" size="sm" />
        </div>

        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="removeColour(colour.id)"
        />
      </div>
    </div>

    <UButton
      icon="i-lucide-plus"
      variant="outline"
      @click="addColour()"
    >
      Add colour
    </UButton>

    <!-- Empty state -->
    <div
      v-if="state.colours.length === 0"
      class="mt-8 text-center py-12 border-2 border-dashed border-(--ui-border) rounded-xl"
    >
      <UIcon name="i-lucide-palette" class="size-10 text-(--ui-text-muted) mx-auto mb-3" />
      <p class="text-(--ui-text-muted) text-sm">No colours yet. Add your first brand colour.</p>
    </div>
  </div>
</template>
