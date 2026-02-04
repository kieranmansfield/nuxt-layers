<template>
  <UPopover :ui="{ content: 'bg-transparent backdrop-blur-3xl' }">
    <ThemePickerMenuButton />

    <template #content>
      <UCard :ui="{ root: 'sm:bg-default/30 sm:dark:bg-default/40 backdrop-blur-3xl' }">
        <UCard :ui="{ root: 'divide-y-0 ring-0 sm:bg-transparent' }">
          <ul class="flex flex-col gap-6">
            <li>
              <h1 class="my-2 text-lg font-semibold">Color Mode</h1>
              <UFieldGroup>
                <UColorModeSelect size="lg" />
              </UFieldGroup>
            </li>

            <li>
              <h1 class="my-2 text-lg font-semibold">Theme</h1>
              <ThemePickerColors />
            </li>

            <li class="flex w-full flex-row justify-between py-1">
              <h1 class="text-lg font-semibold">App Tinting</h1>
              <UFieldGroup>
                <USwitch unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" size="xl" />
              </UFieldGroup>
            </li>

            <li class="flex w-full flex-row justify-between py-1">
              <h1 class="text-lg font-semibold">High Contrast</h1>
              <UFieldGroup>
                <USwitch unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" size="xl" />
              </UFieldGroup>
            </li>

            <li class="flex w-full flex-row justify-between py-1">
              <h1 class="text-lg font-semibold">Reduce Motion</h1>
              <UFieldGroup>
                <USwitch unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" size="xl" />
              </UFieldGroup>
            </li>

            <li class="flex w-full flex-row justify-between py-1">
              <h1 class="text-lg font-semibold">Reduce Transparency</h1>
              <UFieldGroup>
                <USwitch unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" size="xl" />
              </UFieldGroup>
            </li>
          </ul>
        </UCard>
      </UCard>
    </template>
  </UPopover>
</template>
