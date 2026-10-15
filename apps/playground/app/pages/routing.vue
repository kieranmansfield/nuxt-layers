<script setup lang="ts">
  import {
    type FeatureValue,
    type RoutingLayerConfig,
    type RoutingPreset,
  } from '#layers/routing/app/types/routing'

  import {
    buildPresetFlags,
    resolveRoutingConfig,
    simulateRoutingOutcome,
  } from '~/utils/routingSimulation'

  definePageMeta({ layout: false })

  const { setPageAccent } = useAccentColor()
  setPageAccent('orange')
  onUnmounted(() => setPageAccent(null))

  const appConfig = useAppConfig()

  // Reactive merged config — manual merge so we don't need to import defu here
  const config = computed<RoutingLayerConfig>(() =>
    resolveRoutingConfig(appConfig.routingLayer as Partial<RoutingLayerConfig>)
  )

  // Preset cards
  const PRESETS: RoutingPreset[] = ['simple', 'marketing', 'product', 'enterprise']

  const presetMeta: Record<
    RoutingPreset,
    { description: string; borderColor: string; bgColor: string; accentColor: string }
  > = {
    simple: {
      description: 'No restrictions. All routes allowed.',
      borderColor: 'border-green-500/40',
      bgColor: 'bg-green-500/5',
      accentColor: 'text-green-500',
    },
    marketing: {
      description: 'Layer routes need a feature flag. Scroll routing + maintenance enabled.',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-500/5',
      accentColor: 'text-blue-500',
    },
    product: {
      description: 'Layer routes need a feature flag. Runtime flags fetched from API.',
      borderColor: 'border-violet-500/40',
      bgColor: 'bg-violet-500/5',
      accentColor: 'text-violet-500',
    },
    enterprise: {
      description: 'Every route must declare a feature. Strictest governance.',
      borderColor: 'border-red-500/40',
      bgColor: 'bg-red-500/5',
      accentColor: 'text-red-500',
    },
  }

  function selectPreset(preset: RoutingPreset) {
    appConfig.routingLayer.preset = preset
  }

  function presetFlags(preset: RoutingPreset): string[] {
    return buildPresetFlags(preset)
  }

  // Feature flags panel
  const DEMO_FEATURES = ['blog', 'shop', 'dashboard', 'api'] as const

  const featureItems = [
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' },
    { label: 'Beta', value: 'beta' },
    { label: 'Coming Soon', value: 'coming-soon' },
  ]

  function setFeature(name: string, value: FeatureValue) {
    if (!appConfig.routingLayer.features) {
      appConfig.routingLayer.features = {}
    }
    ;(appConfig.routingLayer.features as Record<string, FeatureValue>)[name] = value
  }

  function featureVariant(name: string): FeatureValue {
    return config.value.features[name] ?? 'disabled'
  }

  function outcomeLabel(v: FeatureValue) {
    if (v === 'enabled') return 'Allow'
    if (v === 'disabled') return '404'
    return 'Redirect'
  }

  function outcomeColor(v: FeatureValue): 'success' | 'error' | 'warning' {
    if (v === 'enabled') return 'success'
    if (v === 'disabled') return 'error'
    return 'warning'
  }

  // Governance simulator
  const simPath = ref('/dashboard')
  const simFeature = ref('')
  const simFromLayer = ref(false)

  const simResult = computed(() => {
    return simulateRoutingOutcome(config.value, {
      path: simPath.value,
      feature: simFeature.value || undefined,
      fromLayer: simFromLayer.value,
    })
  })

  // Maintenance toggle
  const maintenanceEnabled = computed({
    get: () => config.value.maintenance.enabled,
    set: (val: boolean) => {
      if (!appConfig.routingLayer.maintenance) {
        appConfig.routingLayer.maintenance = { enabled: val, allowRoutes: ['/maintenance'] }
      } else {
        appConfig.routingLayer.maintenance.enabled = val
      }
    },
  })
</script>

<template>
  <LayoutPage
    title="Routing Layer Demo"
    description="Feature flags, governance presets, maintenance mode, and route access control"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="ROUTING"
        description="Feature flags, governance presets, maintenance mode, and advanced access control."
      />
      <section class="bg-default pb-24">
        <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div class="space-y-12 py-8">
            <!-- 1. Preset Switcher -->
            <section class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold">Governance Preset</h2>
                <p class="text-muted mt-1 text-sm">
                  Select a preset to configure access control behaviour. Changes are live and
                  reactive.
                </p>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  v-for="preset in PRESETS"
                  :key="preset"
                  class="cursor-pointer rounded-xl border-2 p-4 text-left transition-all"
                  :class="[
                    presetMeta[preset].borderColor,
                    presetMeta[preset].bgColor,
                    config.preset === preset
                      ? 'ring-primary-500 ring-2 ring-offset-2'
                      : 'opacity-80 hover:opacity-100',
                  ]"
                  @click="() => selectPreset(preset)"
                >
                  <div class="mb-2 flex items-center justify-between">
                    <span
                      class="font-semibold capitalize"
                      :class="presetMeta[preset].accentColor"
                      >{{ preset }}</span
                    >
                    <UIcon
                      v-if="config.preset === preset"
                      name="i-lucide-check-circle"
                      class="text-lg"
                      :class="presetMeta[preset].accentColor"
                    />
                  </div>
                  <p class="text-muted mb-3 text-xs">{{ presetMeta[preset].description }}</p>
                  <div class="flex flex-wrap gap-1">
                    <UBadge
                      v-for="flag in presetFlags(preset)"
                      :key="flag"
                      size="xs"
                      variant="subtle"
                      color="neutral"
                    >
                      {{ flag }}
                    </UBadge>
                    <span v-if="presetFlags(preset).length === 0" class="text-muted text-xs italic">
                      no flags active
                    </span>
                  </div>
                </button>
              </div>

              <!-- Live Config -->
              <UCard>
                <template #header>
                  <p class="text-sm font-semibold">Live Config (merged preset + overrides)</p>
                </template>
                <pre class="max-h-64 overflow-auto text-xs">{{
                  JSON.stringify(config, null, 2)
                }}</pre>
              </UCard>
            </section>

            <!-- 2. Feature Flags -->
            <section class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold">Feature Flags</h2>
                <p class="text-muted mt-1 text-sm">
                  Configure per-feature access. The governance middleware uses these values to
                  allow, block, or redirect routes.
                </p>
              </div>
              <UCard>
                <div class="divide-default divide-y">
                  <div
                    v-for="feature in DEMO_FEATURES"
                    :key="feature"
                    class="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span class="w-20 shrink-0 font-mono text-sm">{{ feature }}</span>
                    <USelect
                      :model-value="featureVariant(feature)"
                      :items="featureItems"
                      class="w-40"
                      @update:model-value="(v) => setFeature(feature, v as FeatureValue)"
                    />
                    <UBadge
                      :color="outcomeColor(featureVariant(feature))"
                      variant="subtle"
                      size="sm"
                    >
                      {{ outcomeLabel(featureVariant(feature)) }}
                    </UBadge>
                    <span class="text-muted ml-auto hidden text-xs sm:block">
                      <template v-if="featureVariant(feature) === 'enabled'">
                        Middleware allows access
                      </template>
                      <template v-else-if="featureVariant(feature) === 'disabled'">
                        Middleware throws 404
                      </template>
                      <template v-else>Middleware redirects to /coming-soon</template>
                    </span>
                  </div>
                </div>
              </UCard>
            </section>

            <!-- 3. Governance Simulator -->
            <section class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold">Governance Simulator</h2>
                <p class="text-muted mt-1 text-sm">
                  See what the middleware would do for any route — no actual navigation occurs.
                </p>
              </div>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="space-y-1">
                  <label class="text-sm font-medium">Route path</label>
                  <UInput v-model="simPath" placeholder="/dashboard" />
                </div>
                <div class="space-y-1">
                  <label class="text-sm font-medium">
                    meta.feature <span class="text-muted font-normal">(optional)</span>
                  </label>
                  <UInput v-model="simFeature" placeholder="e.g. dashboard" />
                </div>
                <div class="flex items-end pb-0.5">
                  <UCheckbox v-model="simFromLayer" label="meta.__fromLayer (route from layer)" />
                </div>
              </div>

              <UCard>
                <div v-if="simResult.steps.length" class="mb-4 space-y-2">
                  <div
                    v-for="(step, i) in simResult.steps"
                    :key="i"
                    class="flex items-start gap-2.5 text-sm"
                  >
                    <UIcon
                      :name="
                        step.status === 'pass'
                          ? 'i-lucide-check'
                          : step.status === 'redirect'
                            ? 'i-lucide-arrow-right'
                            : 'i-lucide-x'
                      "
                      class="mt-0.5 shrink-0 text-base"
                      :class="{
                        'text-success': step.status === 'pass',
                        'text-warning': step.status === 'redirect',
                        'text-error': step.status === 'block',
                      }"
                    />
                    <div>
                      <span class="font-medium">{{ step.label }}</span>
                      <span class="text-muted ml-2">{{ step.note }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-muted mb-4 text-sm">
                  No active governance checks for the current preset.
                </div>

                <div class="border-default flex items-center gap-3 border-t pt-3">
                  <span class="text-sm font-medium">Final outcome:</span>
                  <UBadge
                    :color="
                      simResult.final === 'allow'
                        ? 'success'
                        : simResult.final === '404'
                          ? 'error'
                          : 'warning'
                    "
                    size="md"
                  >
                    {{
                      simResult.final === 'allow'
                        ? 'Allow'
                        : simResult.final === '404'
                          ? '404 Not Found'
                          : `Redirect ${simResult.finalNote}`
                    }}
                  </UBadge>
                </div>
              </UCard>
            </section>

            <!-- 4. Maintenance Mode -->
            <section class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold">Maintenance Mode</h2>
                <p class="text-muted mt-1 text-sm">
                  When enabled, all routes redirect to the maintenance page (except allowRoutes).
                </p>
              </div>
              <div class="flex items-center gap-4">
                <USwitch v-model="maintenanceEnabled" label="Enable maintenance mode" />
              </div>
              <div
                v-if="maintenanceEnabled"
                class="border-warning-300/50 bg-warning-500/10 rounded-lg border px-4 py-3 text-sm"
              >
                <div
                  class="text-warning-600 dark:text-warning-400 mb-1 flex items-center gap-2 font-semibold"
                >
                  <UIcon name="i-lucide-triangle-alert" />
                  Maintenance mode active
                </div>
                <p class="text-muted">
                  All routes redirect to
                  <code class="font-mono text-xs">{{ config.maintenance.allowRoutes[0] }}</code>
                </p>
                <p class="text-muted mt-1 text-xs">
                  Allowed routes: {{ config.maintenance.allowRoutes.join(', ') }}
                </p>
              </div>
            </section>

            <!-- 5. Scroll Routing -->
            <section class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold">Scroll Routing</h2>
                <p class="text-muted mt-1 text-sm">
                  Full-screen sections sync the URL hash as you scroll — no page reload.
                </p>
              </div>
              <NuxtLink
                to="/routing-scroll"
                class="group border-default bg-elevated hover:border-primary-500/50 hover:bg-primary-500/5 flex items-center justify-between rounded-xl border px-5 py-4 transition-all"
              >
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-mouse" class="text-primary-500 text-lg" />
                    <span class="font-semibold">Open Scroll Demo</span>
                  </div>
                  <p class="text-muted text-xs">
                    Uses IntersectionObserver at threshold: 0.5 — same pattern as the scroll-routing
                    plugin
                  </p>
                </div>
                <UIcon
                  name="i-lucide-arrow-right"
                  class="text-muted group-hover:text-primary-500 shrink-0 text-lg transition-colors"
                />
              </NuxtLink>
            </section>

            <!-- 6. Behavior Matrix -->
            <section class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold">Behavior Matrix</h2>
                <p class="text-muted mt-1 text-sm">
                  How each preset treats starter (app) routes vs. layer routes.
                </p>
              </div>
              <UCard>
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-default border-b">
                      <th class="w-32 py-2 pr-6 text-left font-semibold">Preset</th>
                      <th class="py-2 pr-6 text-left font-semibold">Starter Routes</th>
                      <th class="py-2 text-left font-semibold">Layer Routes</th>
                    </tr>
                  </thead>
                  <tbody class="divide-default divide-y">
                    <tr>
                      <td class="py-2.5 pr-6 font-mono text-green-500">simple</td>
                      <td class="py-2.5 pr-6">
                        <UBadge color="success" variant="subtle" size="xs">Allowed</UBadge>
                      </td>
                      <td class="py-2.5">
                        <UBadge color="success" variant="subtle" size="xs">Allowed</UBadge>
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2.5 pr-6 font-mono text-blue-500">marketing</td>
                      <td class="py-2.5 pr-6">
                        <UBadge color="success" variant="subtle" size="xs">Allowed</UBadge>
                      </td>
                      <td class="py-2.5">
                        <UBadge color="warning" variant="subtle" size="xs">
                          Denied unless feature declared
                        </UBadge>
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2.5 pr-6 font-mono text-violet-500">product</td>
                      <td class="py-2.5 pr-6">
                        <UBadge color="success" variant="subtle" size="xs">Allowed</UBadge>
                      </td>
                      <td class="py-2.5">
                        <UBadge color="warning" variant="subtle" size="xs">
                          Denied unless feature declared
                        </UBadge>
                      </td>
                    </tr>
                    <tr>
                      <td class="py-2.5 pr-6 font-mono text-red-500">enterprise</td>
                      <td class="py-2.5 pr-6">
                        <UBadge color="warning" variant="subtle" size="xs">
                          Must declare feature
                        </UBadge>
                      </td>
                      <td class="py-2.5">
                        <UBadge color="error" variant="subtle" size="xs"
                          >Must declare feature</UBadge
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </UCard>
            </section>

            <!-- Sub-demos -->
            <section class="space-y-4">
              <div>
                <h2 class="mb-1 text-2xl font-bold">Sub-demos</h2>
                <p class="text-muted">Scroll-driven routing built on the routing layer</p>
              </div>
              <div class="flex flex-wrap gap-3">
                <UButton to="/routing-scroll" variant="outline" icon="i-lucide-scroll">
                  Scroll Routing
                </UButton>
              </div>
            </section>

            <!-- Navigation -->
            <div class="flex justify-center gap-4 pt-4">
              <UButton to="/" variant="outline" icon="i-lucide-arrow-left">Back to Home</UButton>
              <UButton to="/feeds" trailing-icon="i-lucide-arrow-right">Feeds</UButton>
            </div>
          </div>
        </div>
      </section>
      <DemoPageFooter
        name="Routing Layer"
        description="Feature flags, maintenance mode, and access control"
        :links="[
          { label: 'Core', to: '/core', icon: 'i-lucide-box' },
          { label: 'Content', to: '/content', icon: 'i-lucide-file-text' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
