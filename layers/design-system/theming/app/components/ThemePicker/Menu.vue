<script setup lang="ts">
  import { useThemePreferenceModels } from '../../composables/useThemePreferenceModels'

  const {
    contrastOverride,
    motionOverride,
    transparencyOverride,
    contrastModel,
    motionModel,
    transparencyModel,
  } = useThemePreferenceModels()
</script>

<template>
  <UPopover :ui="{ content: 'bg-transparent backdrop-blur-3xl' }">
    <ThemePickerMenuButton />

    <template #content>
      <LazyUCard :ui="{ root: 'sm:bg-default/30 sm:dark:bg-default/40 backdrop-blur-3xl' }">
        <LazyUCard :ui="{ root: 'divide-y-0 ring-0 sm:bg-transparent' }">
          <ul class="flex flex-col gap-6">
            <li>
              <h2 class="my-2 text-lg font-semibold">Color Mode</h2>
              <LazyUFieldGroup>
                <LazyUColorModeSelect size="lg" />
              </LazyUFieldGroup>
            </li>

            <li>
              <h2 class="my-2 text-lg font-semibold">Accent</h2>
              <LazyThemePickerColors />
            </li>

            <li class="flex w-full flex-row items-center justify-between py-1">
              <div>
                <h2 class="text-lg font-semibold">High Contrast</h2>
                <p v-if="contrastOverride === 'system'" class="text-muted text-sm">
                  Following system
                </p>
              </div>
              <LazyUSwitch
                v-model="contrastModel"
                unchecked-icon="i-lucide-x"
                checked-icon="i-lucide-check"
                size="xl"
              />
            </li>

            <li class="flex w-full flex-row items-center justify-between py-1">
              <div>
                <h2 class="text-lg font-semibold">Reduce Motion</h2>
                <p v-if="motionOverride === 'system'" class="text-muted text-sm">
                  Following system
                </p>
              </div>
              <LazyUSwitch
                v-model="motionModel"
                unchecked-icon="i-lucide-x"
                checked-icon="i-lucide-check"
                size="xl"
              />
            </li>

            <li class="flex w-full flex-row items-center justify-between py-1">
              <div>
                <h2 class="text-lg font-semibold">Reduce Transparency</h2>
                <p v-if="transparencyOverride === 'system'" class="text-muted text-sm">
                  Following system
                </p>
              </div>
              <LazyUSwitch
                v-model="transparencyModel"
                unchecked-icon="i-lucide-x"
                checked-icon="i-lucide-check"
                size="xl"
              />
            </li>
          </ul>
        </LazyUCard>
      </LazyUCard>
    </template>
  </UPopover>
</template>
