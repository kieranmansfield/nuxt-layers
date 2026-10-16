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
      <h1 class="text-default mb-1 text-2xl font-semibold">Colour Foundation</h1>
      <p class="text-muted text-sm">
        Define your brand colours. Start with a primary and build from there.
      </p>
    </div>

    <!-- Brand identity -->
    <UCard class="mb-6">
      <template #header>
        <p class="text-default text-sm font-medium">Brand Identity</p>
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
    <div class="mb-6 flex flex-col gap-3">
      <div
        v-for="colour in state.colours"
        :key="colour.id"
        class="border-default bg-elevated rounded-xl border p-4"
      >
        <!--
          Mobile: 2 rows.
          Desktop: single row via sm:flex-row.
        -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <!-- Row 1 (mobile) / start of row (desktop): picker + hex + swatch -->
          <div class="flex items-center gap-3">
            <label class="shrink-0 cursor-pointer">
              <input
                type="color"
                :value="colour.hex"
                @input="($event) => onHexInput(colour.id, $event)"
              />
            </label>
            <UInput
              :model-value="colour.hex"
              class="w-28 shrink-0 font-mono text-sm"
              @update:model-value="($event) => updateColour(colour.id, { hex: $event })"
            />
            <ColourSwatch :hex="colour.hex" size="sm" class="shrink-0" />
            <!-- Remove button moves here on mobile -->
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="sm"
              class="ml-auto sm:hidden"
              @click="() => removeColour(colour.id)"
            />
          </div>

          <!-- Row 2 (mobile) / rest of row (desktop): name + role + remove -->
          <div class="flex min-w-0 flex-1 items-center gap-3">
            <UInput
              :model-value="colour.name"
              placeholder="Name"
              class="min-w-0 flex-1"
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
              class="hidden shrink-0 sm:flex"
              @click="() => removeColour(colour.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <UButton icon="i-lucide-plus" variant="outline" @click="() => addColour()">
      Add colour
    </UButton>

    <!-- Empty state -->
    <div
      v-if="state.colours.length === 0"
      class="border-default mt-8 rounded-xl border-2 border-dashed py-12 text-center"
    >
      <UIcon name="i-lucide-palette" class="text-muted mx-auto mb-3 size-10" />
      <p class="text-muted text-sm">No colours yet. Add your first brand colour.</p>
    </div>
  </div>
</template>
