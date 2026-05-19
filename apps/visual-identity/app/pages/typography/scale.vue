<script setup lang="ts">

const { state, updateFontScale } = useBrandState()

const activeFont = ref(state.value.typography[0]?.id ?? 'heading')

const currentFont = computed(
  () => state.value.typography.find((f) => f.id === activeFont.value) ?? state.value.typography[0],
)

function addSize(field: 'sizeScale' | 'spacingScale') {
  if (!currentFont.value) return
  const last = currentFont.value[field].at(-1) ?? 16
  const next = Math.round(last * 1.333)
  updateFontScale(currentFont.value.id, field, [...currentFont.value[field], next])
}

function removeSize(field: 'sizeScale' | 'spacingScale', index: number) {
  if (!currentFont.value) return
  const updated = currentFont.value[field].filter((_, i) => i !== index)
  updateFontScale(currentFont.value.id, field, updated)
}

function updateSize(field: 'sizeScale' | 'spacingScale', index: number, value: number) {
  if (!currentFont.value) return
  const updated = [...currentFont.value[field]]
  updated[index] = value
  updateFontScale(currentFont.value.id, field, updated)
}
</script>

<template>
  <div class="vi-page">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-(--ui-text) mb-1">Type Scale</h1>
      <p class="text-(--ui-text-muted) text-sm">
        Define size and spacing scales for each font role.
      </p>
    </div>

    <!-- Font role tabs -->
    <div class="flex gap-2 mb-6">
      <UButton
        v-for="font in state.typography"
        :key="font.id"
        :variant="activeFont === font.id ? 'solid' : 'outline'"
        size="sm"
        class="capitalize"
        @click="activeFont = font.id"
      >
        {{ font.role }}
      </UButton>
    </div>

    <div v-if="currentFont" class="flex gap-6">
      <!-- Size scale -->
      <UCard class="flex-1">
        <template #header>
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-(--ui-text)">Font sizes</p>
            <UButton icon="i-lucide-plus" size="xs" variant="ghost" @click="addSize('sizeScale')" />
          </div>
        </template>
        <div class="flex flex-col gap-2">
          <div
            v-for="(size, i) in currentFont.sizeScale"
            :key="i"
            class="flex items-center gap-3"
          >
            <div
              class="overflow-hidden"
              :style="{
                fontFamily: `'${currentFont.family}', sans-serif`,
                fontVariationSettings: Object.entries(currentFont.axes)
                  .map(([k, v]) => `'${k}' ${v}`)
                  .join(', '),
                fontSize: Math.min(size, 48) + 'px',
                lineHeight: '1',
                whiteSpace: 'nowrap',
                color: 'var(--ui-text)',
                flexShrink: 0,
                width: '80px',
              }"
            >
              Ag
            </div>
            <UInput
              :model-value="size"
              type="number"
              size="sm"
              class="w-20"
              @update:model-value="updateSize('sizeScale', i, Number($event))"
            />
            <span class="text-xs text-(--ui-text-muted)">px</span>
            <UButton
              icon="i-lucide-x"
              size="xs"
              variant="ghost"
              color="neutral"
              :disabled="currentFont.sizeScale.length <= 1"
              @click="removeSize('sizeScale', i)"
            />
          </div>
        </div>
      </UCard>

      <!-- Spacing scale -->
      <UCard class="flex-1">
        <template #header>
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-(--ui-text)">Spacing</p>
            <UButton icon="i-lucide-plus" size="xs" variant="ghost" @click="addSize('spacingScale')" />
          </div>
        </template>
        <div class="flex flex-col gap-2">
          <div
            v-for="(size, i) in currentFont.spacingScale"
            :key="i"
            class="flex items-center gap-3"
          >
            <div
              class="bg-(--ui-primary)/20 rounded shrink-0"
              :style="{ height: '20px', width: Math.min(size * 1.5, 120) + 'px' }"
            />
            <UInput
              :model-value="size"
              type="number"
              size="sm"
              class="w-20"
              @update:model-value="updateSize('spacingScale', i, Number($event))"
            />
            <span class="text-xs text-(--ui-text-muted)">px</span>
            <UButton
              icon="i-lucide-x"
              size="xs"
              variant="ghost"
              color="neutral"
              :disabled="currentFont.spacingScale.length <= 1"
              @click="removeSize('spacingScale', i)"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
