<script setup lang="ts">
const {
  contrastOverride,
  motionOverride,
  transparencyOverride,
  setContrastOverride,
  setMotionOverride,
  setTransparencyOverride,
  effectiveHighContrast,
  effectiveReducedMotion,
  effectiveReducedTransparency,
} = useThemePreferences()

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
</script>

<template>
  <UPopover :ui="{ content: 'bg-transparent backdrop-blur-3xl' }">
    <ThemePickerMenuButton />

    <template #content>
      <UCard :ui="{ root: 'sm:bg-default/30 sm:dark:bg-default/40 backdrop-blur-3xl' }">
        <UCard :ui="{ root: 'divide-y-0 ring-0 sm:bg-transparent' }">
          <ul class="flex flex-col gap-6">
            <li>
              <h2 class="my-2 text-lg font-semibold">Color Mode</h2>
              <UFieldGroup>
                <UColorModeSelect size="lg" />
              </UFieldGroup>
            </li>

            <li>
              <h2 class="my-2 text-lg font-semibold">Accent</h2>
              <ThemePickerColors />
            </li>

            <li class="flex w-full flex-row items-center justify-between py-1">
              <div>
                <h2 class="text-lg font-semibold">High Contrast</h2>
                <p
                  v-if="contrastOverride === 'system'"
                  class="text-sm text-muted"
                >
                  Following system
                </p>
              </div>
              <USwitch
                v-model="contrastModel"
                unchecked-icon="i-lucide-x"
                checked-icon="i-lucide-check"
                size="xl"
              />
            </li>

            <li class="flex w-full flex-row items-center justify-between py-1">
              <div>
                <h2 class="text-lg font-semibold">Reduce Motion</h2>
                <p
                  v-if="motionOverride === 'system'"
                  class="text-sm text-muted"
                >
                  Following system
                </p>
              </div>
              <USwitch
                v-model="motionModel"
                unchecked-icon="i-lucide-x"
                checked-icon="i-lucide-check"
                size="xl"
              />
            </li>

            <li class="flex w-full flex-row items-center justify-between py-1">
              <div>
                <h2 class="text-lg font-semibold">Reduce Transparency</h2>
                <p
                  v-if="transparencyOverride === 'system'"
                  class="text-sm text-muted"
                >
                  Following system
                </p>
              </div>
              <USwitch
                v-model="transparencyModel"
                unchecked-icon="i-lucide-x"
                checked-icon="i-lucide-check"
                size="xl"
              />
            </li>
          </ul>
        </UCard>
      </UCard>
    </template>
  </UPopover>
</template>
