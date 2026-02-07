<script setup lang="ts">
useSeoMeta({
  title: 'Theme Layer Demo',
  description: 'Demonstrating the Theme layer color system, palettes, and design tokens',
})

const {
  activeAccent,
  effectiveHighContrast,
  effectiveReducedMotion,
  effectiveReducedTransparency,
} = useThemePreferences()
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-8">
      <div class="space-y-12">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <UButton to="/" variant="ghost" icon="i-lucide-arrow-left" />
          <div>
            <h1 class="text-3xl font-bold text-highlighted">Theme Layer</h1>
            <p class="text-muted">
              Color mode, accent colors, and accessibility preferences
            </p>
          </div>
        </div>

        <!-- Color Mode -->
        <section class="space-y-4">
          <h2 class="text-2xl font-bold">Color Mode</h2>
          <div class="flex items-center gap-4">
            <UColorModeSelect class="w-48" />
          </div>
        </section>

        <!-- Accent Color -->
        <section class="space-y-4">
          <h2 class="text-2xl font-bold">
            Accent Color:
            <span class="text-primary capitalize">{{ activeAccent }}</span>
          </h2>
          <ThemePickerColors />
          <div class="flex flex-wrap gap-3">
            <UButton color="primary" label="Primary Button" />
            <UButton color="primary" variant="outline" label="Outline" />
            <UButton color="primary" variant="soft" label="Soft" />
            <UButton color="primary" variant="ghost" label="Ghost" />
          </div>
          <div class="flex flex-wrap gap-3">
            <UBadge color="primary" label="Badge" />
            <UBadge color="primary" variant="outline" label="Outline" />
            <UBadge color="primary" variant="soft" label="Soft" />
            <UBadge color="primary" variant="subtle" label="Subtle" />
          </div>
        </section>

        <!-- Active Preferences -->
        <section class="space-y-4">
          <h2 class="text-2xl font-bold">Active Preferences</h2>
          <div class="grid gap-3 sm:grid-cols-3">
            <UCard>
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-lucide-contrast"
                  class="size-5"
                  :class="effectiveHighContrast ? 'text-warning' : 'text-muted'"
                />
                <div>
                  <p class="font-medium">High Contrast</p>
                  <p class="text-sm text-muted">
                    {{ effectiveHighContrast ? 'Active' : 'Inactive' }}
                  </p>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-lucide-zap-off"
                  class="size-5"
                  :class="effectiveReducedMotion ? 'text-warning' : 'text-muted'"
                />
                <div>
                  <p class="font-medium">Reduced Motion</p>
                  <p class="text-sm text-muted">
                    {{ effectiveReducedMotion ? 'Active' : 'Inactive' }}
                  </p>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-lucide-eye-off"
                  class="size-5"
                  :class="effectiveReducedTransparency ? 'text-warning' : 'text-muted'"
                />
                <div>
                  <p class="font-medium">Reduced Transparency</p>
                  <p class="text-sm text-muted">
                    {{ effectiveReducedTransparency ? 'Active' : 'Inactive' }}
                  </p>
                </div>
              </div>
            </UCard>
          </div>
        </section>
      </div>
    </UContainer>
  </div>
</template>
