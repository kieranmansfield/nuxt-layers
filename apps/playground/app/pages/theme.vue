<script setup lang="ts">
import { useSupported } from '@vueuse/core'

const {
  activeAccent,
  contrastOverride,
  motionOverride,
  transparencyOverride,
  setContrastOverride,
  setMotionOverride,
  setTransparencyOverride,
  effectiveHighContrast,
  effectiveReducedMotion,
  effectiveReducedTransparency,
  systemContrast,
  systemMotion,
  systemTransparency,
} = useTheme()

// Media query support detection
const contrastSupported = useSupported(
  () => window.matchMedia('(prefers-contrast: more)').media !== 'not all'
)
const motionSupported = useSupported(
  () => window.matchMedia('(prefers-reduced-motion: reduce)').media !== 'not all'
)
const transparencySupported = useSupported(
  () => window.matchMedia('(prefers-reduced-transparency: reduce)').media !== 'not all'
)

// Toggle models — match ThemePicker/Menu.vue pattern
const contrastModel = computed({
  get: () => effectiveHighContrast.value,
  set: (val: boolean) => setContrastOverride(val ? 'on' : 'system'),
})

const motionModel = computed({
  get: () => effectiveReducedMotion.value,
  set: (val: boolean) => setMotionOverride(val ? 'on' : 'system'),
})

const transparencyModel = computed({
  get: () => effectiveReducedTransparency.value,
  set: (val: boolean) => setTransparencyOverride(val ? 'on' : 'system'),
})

const COLOR_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const COLOR_ROLES = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'info', label: 'Accent' },
  { key: 'neutral', label: 'Neutral' },
] as const

definePageMeta({ layout: 'grid' })
</script>

<template>
  <LayoutPageContainer
    title="Theme Layer Demo"
    description="Demonstrating the Theme layer color system, palettes, and design tokens"
    :show-header="false"
  >
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-12 py-8">
          <LayoutPageHeader
            title="Theme Layer"
            description="Color mode, accent colors, and accessibility preferences"
            back="/"
          />

          <!-- Color Mode -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">Color Mode</h2>
            <UColorModeSelect class="w-48" />
          </section>

          <!-- Accent Picker -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">
              Accent Color
              <span class="ml-2 text-primary capitalize">{{ activeAccent }}</span>
            </h2>
            <ThemePickerColors />
          </section>

          <!-- Color Palettes -->
          <section class="space-y-6">
            <h2 class="text-2xl font-bold">Color Palettes</h2>
            <div class="space-y-4">
              <div v-for="role in COLOR_ROLES" :key="role.key" class="space-y-1.5">
                <p class="text-sm font-medium capitalize text-muted">{{ role.label }}</p>
                <div class="flex rounded-lg overflow-hidden">
                  <div
                    v-for="shade in COLOR_SHADES"
                    :key="shade"
                    class="flex-1 h-10 relative group"
                    :style="{ background: `var(--ui-color-${role.key}-${shade})` }"
                  >
                    <span
                      class="absolute inset-0 flex items-end justify-center pb-1 text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                      :style="{
                        color:
                          shade < 500
                            ? `var(--ui-color-${role.key}-800)`
                            : `var(--ui-color-${role.key}-100)`,
                      }"
                    >
                      {{ shade }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Component previews -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div v-for="role in COLOR_ROLES" :key="role.key" class="space-y-2">
                <p class="text-xs font-medium text-muted">{{ role.label }}</p>
                <div class="flex flex-col gap-1.5">
                  <UButton
                    :color="role.key"
                    size="sm"
                    :label="role.label"
                    class="w-full justify-center"
                  />
                  <UBadge :color="role.key" :label="role.label" class="justify-center" />
                </div>
              </div>
            </div>
          </section>

          <!-- Accessibility Preferences -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">Accessibility Preferences</h2>
            <div class="space-y-3">
              <!-- High Contrast -->
              <UCard :ui="{ body: 'p-4' }">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-contrast" class="size-4 text-muted" />
                      <span class="font-semibold">High Contrast</span>
                    </div>
                    <USwitch
                      v-model="contrastModel"
                      unchecked-icon="i-lucide-x"
                      checked-icon="i-lucide-check"
                      size="lg"
                    />
                  </div>
                  <div class="grid grid-cols-3 gap-3 text-sm">
                    <div class="space-y-1">
                      <p class="text-xs text-muted font-medium uppercase tracking-wide">
                        Media Query
                      </p>
                      <UBadge
                        :color="contrastSupported ? 'success' : 'neutral'"
                        :leading-icon="contrastSupported ? 'i-lucide-check' : 'i-lucide-x'"
                        :label="contrastSupported ? 'Supported' : 'Not Supported'"
                        variant="subtle"
                        size="sm"
                      />
                    </div>
                    <div class="space-y-1">
                      <p class="text-xs text-muted font-medium uppercase tracking-wide">System</p>
                      <UBadge
                        :color="systemContrast === 'more' ? 'warning' : 'neutral'"
                        :label="systemContrast"
                        variant="subtle"
                        size="sm"
                      />
                    </div>
                    <div class="space-y-1">
                      <p class="text-xs text-muted font-medium uppercase tracking-wide">
                        User Override
                      </p>
                      <UBadge
                        :color="contrastOverride === 'system' ? 'neutral' : 'primary'"
                        :label="contrastOverride"
                        variant="subtle"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </UCard>

              <!-- Reduce Motion -->
              <UCard :ui="{ body: 'p-4' }">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-zap-off" class="size-4 text-muted" />
                      <span class="font-semibold">Reduce Motion</span>
                    </div>
                    <USwitch
                      v-model="motionModel"
                      unchecked-icon="i-lucide-x"
                      checked-icon="i-lucide-check"
                      size="lg"
                    />
                  </div>
                  <div class="grid grid-cols-3 gap-3 text-sm">
                    <div class="space-y-1">
                      <p class="text-xs text-muted font-medium uppercase tracking-wide">
                        Media Query
                      </p>
                      <UBadge
                        :color="motionSupported ? 'success' : 'neutral'"
                        :leading-icon="motionSupported ? 'i-lucide-check' : 'i-lucide-x'"
                        :label="motionSupported ? 'Supported' : 'Not Supported'"
                        variant="subtle"
                        size="sm"
                      />
                    </div>
                    <div class="space-y-1">
                      <p class="text-xs text-muted font-medium uppercase tracking-wide">System</p>
                      <UBadge
                        :color="systemMotion === 'reduce' ? 'warning' : 'neutral'"
                        :label="systemMotion"
                        variant="subtle"
                        size="sm"
                      />
                    </div>
                    <div class="space-y-1">
                      <p class="text-xs text-muted font-medium uppercase tracking-wide">
                        User Override
                      </p>
                      <UBadge
                        :color="motionOverride === 'system' ? 'neutral' : 'primary'"
                        :label="motionOverride"
                        variant="subtle"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </UCard>

              <!-- Reduce Transparency -->
              <UCard :ui="{ body: 'p-4' }">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-eye-off" class="size-4 text-muted" />
                      <span class="font-semibold">Reduce Transparency</span>
                    </div>
                    <USwitch
                      v-model="transparencyModel"
                      unchecked-icon="i-lucide-x"
                      checked-icon="i-lucide-check"
                      size="lg"
                    />
                  </div>
                  <div class="grid grid-cols-3 gap-3 text-sm">
                    <div class="space-y-1">
                      <p class="text-xs text-muted font-medium uppercase tracking-wide">
                        Media Query
                      </p>
                      <UBadge
                        :color="transparencySupported ? 'success' : 'neutral'"
                        :leading-icon="transparencySupported ? 'i-lucide-check' : 'i-lucide-x'"
                        :label="transparencySupported ? 'Supported' : 'Not Supported'"
                        variant="subtle"
                        size="sm"
                      />
                    </div>
                    <div class="space-y-1">
                      <p class="text-xs text-muted font-medium uppercase tracking-wide">System</p>
                      <UBadge
                        :color="systemTransparency === 'reduce' ? 'warning' : 'neutral'"
                        :label="systemTransparency"
                        variant="subtle"
                        size="sm"
                      />
                    </div>
                    <div class="space-y-1">
                      <p class="text-xs text-muted font-medium uppercase tracking-wide">
                        User Override
                      </p>
                      <UBadge
                        :color="transparencyOverride === 'system' ? 'neutral' : 'primary'"
                        :label="transparencyOverride"
                        variant="subtle"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </section>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPageContainer>
</template>
