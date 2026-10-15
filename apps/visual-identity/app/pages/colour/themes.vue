<script setup lang="ts">
  import type { ThemeVariant } from '~/composables/useBrandState'
  import { computeHarmony } from '~/composables/useColourHarmony'

  const { state, addColour, updateColour, addTheme, removeTheme, updateTheme, setThemeColour } =
    useBrandState()

  /** Add a hex to the palette and return its ID. Returns existing ID if hex already present. */
  function addToPalette(hex: string, name: string): string {
    const norm = hex.toLowerCase()
    const existing = state.value.colours.find((c) => c.hex.toLowerCase() === norm)
    if (existing) return existing.id

    addColour(hex)
    const c = state.value.colours.at(-1)!
    updateColour(c.id, { name, role: 'custom' })
    return c.id
  }

  const roles: (keyof ThemeVariant['colourMappings'])[] = [
    'primary',
    'secondary',
    'accent',
    'neutral',
  ]

  // ── Per-role helpers ──────────────────────────────────────────────────────

  /** Returns true when the role mapping holds a custom hex string. */
  function isCustom(theme: ThemeVariant, role: keyof ThemeVariant['colourMappings']) {
    return (theme.colourMappings[role] ?? '').startsWith('#')
  }

  /** Value to show in the USelect (hides raw hex; returns '__custom__' for custom mode, '__auto__' for unset). */
  function selectValue(theme: ThemeVariant, role: keyof ThemeVariant['colourMappings']) {
    const v = theme.colourMappings[role] ?? ''
    if (v.startsWith('#')) return '__custom__'
    return v || '__auto__'
  }

  /** Resolved display hex for the live swatch. */
  function resolvedHex(theme: ThemeVariant, role: keyof ThemeVariant['colourMappings']): string {
    const v = theme.colourMappings[role]
    if (!v) return state.value.colours.find((c) => c.role === role)?.hex ?? '#e5e7eb'
    if (v.startsWith('#')) return v
    return state.value.colours.find((c) => c.id === v)?.hex ?? '#e5e7eb'
  }

  function onSelectChange(
    themeId: string,
    role: keyof ThemeVariant['colourMappings'],
    value: string
  ) {
    if (value === '__custom__') {
      // Seed the custom picker with the colour that's currently resolved
      const theme = state.value.themes.find((t) => t.id === themeId)!
      setThemeColour(themeId, role, resolvedHex(theme, role))
    } else {
      setThemeColour(themeId, role, value === '__auto__' ? null : value)
    }
  }

  function onPickerInput(themeId: string, role: keyof ThemeVariant['colourMappings'], e: Event) {
    setThemeColour(themeId, role, (e.target as HTMLInputElement).value)
  }

  // ── Presets ───────────────────────────────────────────────────────────────

  const presets = [
    {
      label: 'Swapped',
      icon: 'i-lucide-arrow-left-right',
      description: 'Primary ↔ secondary',
      apply() {
        const p = state.value.colours.find((c) => c.role === 'primary')
        const s = state.value.colours.find((c) => c.role === 'secondary')
        if (!p || !s) return
        addTheme('Swapped')
        const t = state.value.themes.at(-1)!
        setThemeColour(t.id, 'primary', s.id)
        setThemeColour(t.id, 'secondary', p.id)
        // No new colours needed — just remapping existing IDs
      },
    },
    {
      label: 'Complementary',
      icon: 'i-lucide-circle-dot',
      description: 'Complementary of primary',
      apply() {
        const p = state.value.colours.find((c) => c.role === 'primary')
        if (!p) return
        const [hex] = computeHarmony(p.hex, 'complementary')
        if (!hex) return
        // Add to palette first so it appears in scales
        const id = addToPalette(hex, `${p.name} Comp`)
        addTheme('Complementary')
        const t = state.value.themes.at(-1)!
        setThemeColour(t.id, 'primary', id)
      },
    },
    {
      label: 'Analogous',
      icon: 'i-lucide-layers',
      description: 'Analogous palette from primary',
      apply() {
        const p = state.value.colours.find((c) => c.role === 'primary')
        if (!p) return
        const [a, b] = computeHarmony(p.hex, 'analogous')
        addTheme('Analogous')
        const t = state.value.themes.at(-1)!
        if (a) setThemeColour(t.id, 'secondary', addToPalette(a, `${p.name} Analog 1`))
        if (b) setThemeColour(t.id, 'accent', addToPalette(b, `${p.name} Analog 2`))
      },
    },
    {
      label: 'Triadic',
      icon: 'i-lucide-triangle',
      description: 'Triadic palette from primary',
      apply() {
        const p = state.value.colours.find((c) => c.role === 'primary')
        if (!p) return
        const [a, b] = computeHarmony(p.hex, 'triadic')
        addTheme('Triadic')
        const t = state.value.themes.at(-1)!
        if (a) setThemeColour(t.id, 'secondary', addToPalette(a, `${p.name} Triadic 2`))
        if (b) setThemeColour(t.id, 'accent', addToPalette(b, `${p.name} Triadic 3`))
      },
    },
  ]

  const canApplyPresets = computed(() => state.value.colours.length > 0)

  // ── Add theme ─────────────────────────────────────────────────────────────

  const newThemeName = ref('')

  function handleAdd() {
    const name = newThemeName.value.trim()
    if (!name) return
    addTheme(name)
    newThemeName.value = ''
  }

  // ── Select items ─────────────────────────────────────────────────────────

  const colourSelectItems = computed(() => [
    { label: 'Auto (matching role)', value: '__auto__' },
    ...state.value.colours.map((c) => ({ label: `${c.name}  ${c.hex}`, value: c.id })),
    { label: 'Custom hex…', value: '__custom__' },
  ])
</script>

<template>
  <div class="vi-page">
    <div class="mb-8">
      <h1 class="text-default mb-1 text-2xl font-semibold">Theme Superset</h1>
      <p class="text-muted text-sm">
        Define named theme variants that remap colours to different roles. Each theme exports as a
        <code class="bg-elevated rounded px-1 py-0.5 font-mono text-xs">data-theme</code>
        CSS selector.
      </p>
    </div>

    <!-- Theme cards -->
    <div class="mb-6 flex flex-col gap-4">
      <UCard v-for="theme in state.themes" :key="theme.id">
        <template #header>
          <div class="flex items-center gap-3">
            <UInput
              :model-value="theme.name"
              :disabled="theme.isDefault"
              class="flex-1"
              size="sm"
              @update:model-value="($event) => updateTheme(theme.id, { name: $event })"
            />
            <UBadge
              v-if="theme.isDefault"
              label="Default"
              color="primary"
              variant="soft"
              size="xs"
            />
            <UButton
              v-else
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="xs"
              @click="() => removeTheme(theme.id)"
            />
          </div>
        </template>

        <div class="flex flex-col gap-3">
          <div v-for="role in roles" :key="role" class="flex min-w-0 items-center gap-3">
            <!-- Role label -->
            <p class="text-default w-16 shrink-0 text-xs font-medium capitalize sm:w-20">
              {{ role }}
            </p>

            <!-- Custom hex mode -->
            <template v-if="!theme.isDefault && isCustom(theme, role)">
              <label class="shrink-0 cursor-pointer">
                <input
                  type="color"
                  :value="theme.colourMappings[role] ?? '#6366f1'"
                  @input="($event) => onPickerInput(theme.id, role, $event)"
                />
              </label>
              <UInput
                :model-value="theme.colourMappings[role] ?? ''"
                class="min-w-0 flex-1 font-mono text-sm"
                size="sm"
                @update:model-value="($event) => setThemeColour(theme.id, role, $event || null)"
              />
              <UButton
                size="xs"
                variant="ghost"
                color="neutral"
                @click="() => setThemeColour(theme.id, role, null)"
              >
                Auto
              </UButton>
            </template>

            <!-- Select mode (auto, brand colour, or trigger custom) -->
            <template v-else>
              <USelect
                :model-value="selectValue(theme, role)"
                :items="colourSelectItems"
                :disabled="theme.isDefault"
                class="min-w-0 flex-1"
                size="sm"
                @update:model-value="($event) => onSelectChange(theme.id, role, $event as string)"
              />
            </template>

            <!-- Live swatch -->
            <div
              class="size-6 shrink-0 rounded-md border border-black/10"
              :style="{ backgroundColor: resolvedHex(theme, role) }"
            />
          </div>
        </div>

        <template v-if="!theme.isDefault" #footer>
          <div class="flex items-center gap-3">
            <!-- Mini palette row -->
            <div class="flex gap-1">
              <div
                v-for="role in roles"
                :key="role"
                class="size-4 rounded-sm border border-black/10"
                :title="role"
                :style="{ backgroundColor: resolvedHex(theme, role) }"
              />
            </div>
            <p class="text-muted font-mono text-xs">
              [data-theme="{{ theme.name.toLowerCase().replace(/\s+/g, '-') }}"]
            </p>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Quick presets -->
    <UCard class="mb-6">
      <template #header>
        <p class="text-default text-sm font-medium">Quick presets</p>
      </template>
      <p class="text-muted mb-4 text-xs">
        Generate a new theme variant based on your existing palette.
      </p>
      <div v-if="!canApplyPresets" class="text-muted text-xs italic">
        Add brand colours on the Foundation page first.
      </div>
      <div v-else class="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          v-for="preset in presets"
          :key="preset.label"
          class="border-default hover:border-accented hover:bg-elevated flex cursor-pointer flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-colors"
          @click="() => preset.apply()"
        >
          <UIcon :name="preset.icon" class="text-muted size-4" />
          <p class="text-default text-xs font-medium">{{ preset.label }}</p>
          <p class="text-muted text-[10px] leading-tight">{{ preset.description }}</p>
        </button>
      </div>
    </UCard>

    <!-- Add blank theme -->
    <div class="flex gap-2">
      <UInput
        v-model="newThemeName"
        placeholder="Theme name (e.g. Seasonal, Alt Brand)"
        class="flex-1"
        @keydown.enter="handleAdd"
      />
      <UButton icon="i-lucide-plus" @click="handleAdd">Add theme</UButton>
    </div>
  </div>
</template>
