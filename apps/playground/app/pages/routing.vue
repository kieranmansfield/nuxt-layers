<script setup lang="ts">
import { ROUTING_PRESETS } from '#layers/routing/app/types/routing'
import type { FeatureValue, RoutingPreset, RoutingLayerConfig } from '#layers/routing/app/types/routing'

definePageMeta({ layout: 'grid' })

const appConfig = useAppConfig()

// Reactive merged config — manual merge so we don't need to import defu here
const config = computed<RoutingLayerConfig>(() => {
  const r = appConfig.routingLayer as Partial<RoutingLayerConfig>
  const p = ROUTING_PRESETS[r.preset ?? 'simple']
  return {
    preset: r.preset ?? 'simple',
    strictDefaultDeny: r.strictDefaultDeny ?? p.strictDefaultDeny,
    layerDefaultDeny: r.layerDefaultDeny ?? p.layerDefaultDeny,
    runtimeFlags: r.runtimeFlags ?? p.runtimeFlags,
    debug: r.debug ?? p.debug,
    maintenance: {
      enabled: r.maintenance?.enabled ?? p.maintenance.enabled,
      allowRoutes: r.maintenance?.allowRoutes ?? p.maintenance.allowRoutes,
    },
    scrollRouting: {
      enabled: r.scrollRouting?.enabled ?? p.scrollRouting.enabled,
      mode: r.scrollRouting?.mode ?? p.scrollRouting.mode,
    },
    features: { ...(r.features ?? {}) },
  }
})

// Preset cards
const PRESETS: RoutingPreset[] = ['simple', 'marketing', 'product', 'enterprise']

const presetMeta: Record<RoutingPreset, { description: string; borderColor: string; bgColor: string; accentColor: string }> = {
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
  const p = ROUTING_PRESETS[preset]
  const flags: string[] = []
  if (p.layerDefaultDeny) flags.push('layerDefaultDeny')
  if (p.strictDefaultDeny) flags.push('strictDefaultDeny')
  if (p.runtimeFlags) flags.push('runtimeFlags')
  if (p.maintenance.enabled) flags.push('maintenance')
  if (p.scrollRouting.enabled) flags.push('scrollRouting')
  return flags
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
  appConfig.routingLayer.features[name] = value
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
  const cfg = config.value
  const feature = simFeature.value || undefined
  const fromLayer = simFromLayer.value
  const steps: Array<{ label: string; status: 'pass' | 'block' | 'redirect'; note: string }> = []

  // 1. Maintenance check
  if (cfg.maintenance.enabled) {
    const allowed = cfg.maintenance.allowRoutes.some(r => simPath.value.startsWith(r))
    if (!allowed) {
      steps.push({ label: 'Maintenance mode', status: 'redirect', note: `Redirect → ${cfg.maintenance.allowRoutes[0]}` })
      return { steps, final: 'redirect' as const, finalNote: `→ ${cfg.maintenance.allowRoutes[0]}` }
    }
    steps.push({ label: 'Maintenance mode', status: 'pass', note: 'Path is in allowRoutes' })
  }

  // 2. Strict default-deny
  if (cfg.strictDefaultDeny) {
    if (!feature) {
      steps.push({ label: 'Strict mode (strictDefaultDeny)', status: 'block', note: 'No feature declared → 404' })
      return { steps, final: '404' as const, finalNote: 'strictDefaultDeny with no feature' }
    }
    steps.push({ label: 'Strict mode (strictDefaultDeny)', status: 'pass', note: 'Feature declared ✓' })
  }

  // 3. Layer default-deny
  if (cfg.layerDefaultDeny && fromLayer) {
    if (!feature) {
      steps.push({ label: 'Layer default-deny (layerDefaultDeny)', status: 'block', note: 'Layer route without feature → 404' })
      return { steps, final: '404' as const, finalNote: 'layerDefaultDeny: layer route with no feature' }
    }
    steps.push({ label: 'Layer default-deny (layerDefaultDeny)', status: 'pass', note: 'Layer route has feature ✓' })
  }

  // 4. Feature resolution
  if (!feature) {
    steps.push({ label: 'Feature gate', status: 'pass', note: 'No feature required — allow' })
    return { steps, final: 'allow' as const, finalNote: 'Allowed' }
  }

  const variant = cfg.features[feature] ?? 'disabled'
  if (variant === 'disabled') {
    steps.push({ label: `Feature "${feature}"`, status: 'block', note: `Resolved: disabled → 404` })
    return { steps, final: '404' as const, finalNote: 'Feature disabled' }
  }
  if (variant === 'beta' || variant === 'coming-soon') {
    steps.push({ label: `Feature "${feature}"`, status: 'redirect', note: `Resolved: ${variant} → /coming-soon` })
    return { steps, final: 'redirect' as const, finalNote: '→ /coming-soon' }
  }
  steps.push({ label: `Feature "${feature}"`, status: 'pass', note: 'Resolved: enabled' })
  return { steps, final: 'allow' as const, finalNote: 'Allowed' }
})

// Maintenance toggle
const maintenanceEnabled = computed({
  get: () => config.value.maintenance.enabled,
  set: (val: boolean) => {
    if (!appConfig.routingLayer.maintenance) {
      appConfig.routingLayer.maintenance = { enabled: val, allowRoutes: ['/maintenance'] }
    }
    else {
      appConfig.routingLayer.maintenance.enabled = val
    }
  },
})
</script>

<template>
  <LayoutPageContainer
    title="Routing Layer Demo"
    description="Feature flags, governance presets, maintenance mode, and route access control"
    :show-header="false"
  >
    <LayoutSection>
      <LayoutGridItem preset="centered">
        <div class="space-y-12 py-8">
          <!-- Header -->
          <LayoutPageHeader
            title="Routing Layer"
            description="Feature flags, governance presets, maintenance mode, and route access control"
            back="/"
          />

          <!-- 1. Preset Switcher -->
          <section class="space-y-4">
            <div>
              <h2 class="text-2xl font-bold">Governance Preset</h2>
              <p class="text-sm text-muted mt-1">Select a preset to configure access control behaviour. Changes are live and reactive.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                v-for="preset in PRESETS"
                :key="preset"
                class="rounded-xl border-2 p-4 text-left transition-all cursor-pointer"
                :class="[
                  presetMeta[preset].borderColor,
                  presetMeta[preset].bgColor,
                  config.preset === preset ? 'ring-2 ring-primary-500 ring-offset-2' : 'opacity-80 hover:opacity-100',
                ]"
                @click="selectPreset(preset)"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold capitalize" :class="presetMeta[preset].accentColor">{{ preset }}</span>
                  <UIcon
                    v-if="config.preset === preset"
                    name="i-lucide-check-circle"
                    class="text-lg"
                    :class="presetMeta[preset].accentColor"
                  />
                </div>
                <p class="text-xs text-muted mb-3">{{ presetMeta[preset].description }}</p>
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
                  <span v-if="presetFlags(preset).length === 0" class="text-xs text-muted italic">no flags active</span>
                </div>
              </button>
            </div>

            <!-- Live Config -->
            <UCard>
              <template #header>
                <p class="text-sm font-semibold">Live Config (merged preset + overrides)</p>
              </template>
              <pre class="text-xs overflow-auto max-h-64">{{ JSON.stringify(config, null, 2) }}</pre>
            </UCard>
          </section>

          <!-- 2. Feature Flags -->
          <section class="space-y-4">
            <div>
              <h2 class="text-2xl font-bold">Feature Flags</h2>
              <p class="text-sm text-muted mt-1">Configure per-feature access. The governance middleware uses these values to allow, block, or redirect routes.</p>
            </div>
            <UCard>
              <div class="divide-y divide-default">
                <div
                  v-for="feature in DEMO_FEATURES"
                  :key="feature"
                  class="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span class="font-mono text-sm w-20 shrink-0">{{ feature }}</span>
                  <USelect
                    :model-value="featureVariant(feature)"
                    :items="featureItems"
                    class="w-40"
                    @update:model-value="(v) => setFeature(feature, v as FeatureValue)"
                  />
                  <UBadge :color="outcomeColor(featureVariant(feature))" variant="subtle" size="sm">
                    {{ outcomeLabel(featureVariant(feature)) }}
                  </UBadge>
                  <span class="text-xs text-muted ml-auto hidden sm:block">
                    <template v-if="featureVariant(feature) === 'enabled'">Middleware allows access</template>
                    <template v-else-if="featureVariant(feature) === 'disabled'">Middleware throws 404</template>
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
              <p class="text-sm text-muted mt-1">See what the middleware would do for any route — no actual navigation occurs.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="text-sm font-medium">Route path</label>
                <UInput v-model="simPath" placeholder="/dashboard" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">meta.feature <span class="text-muted font-normal">(optional)</span></label>
                <UInput v-model="simFeature" placeholder="e.g. dashboard" />
              </div>
              <div class="flex items-end pb-0.5">
                <UCheckbox v-model="simFromLayer" label="meta.__fromLayer (route from layer)" />
              </div>
            </div>

            <UCard>
              <div v-if="simResult.steps.length" class="space-y-2 mb-4">
                <div
                  v-for="(step, i) in simResult.steps"
                  :key="i"
                  class="flex items-start gap-2.5 text-sm"
                >
                  <UIcon
                    :name="step.status === 'pass' ? 'i-lucide-check' : step.status === 'redirect' ? 'i-lucide-arrow-right' : 'i-lucide-x'"
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
              <div
                v-else
                class="text-sm text-muted mb-4"
              >
                No active governance checks for the current preset.
              </div>

              <div class="flex items-center gap-3 pt-3 border-t border-default">
                <span class="text-sm font-medium">Final outcome:</span>
                <UBadge
                  :color="simResult.final === 'allow' ? 'success' : simResult.final === '404' ? 'error' : 'warning'"
                  size="md"
                >
                  {{ simResult.final === 'allow' ? 'Allow' : simResult.final === '404' ? '404 Not Found' : `Redirect ${simResult.finalNote}` }}
                </UBadge>
              </div>
            </UCard>
          </section>

          <!-- 4. Maintenance Mode -->
          <section class="space-y-4">
            <div>
              <h2 class="text-2xl font-bold">Maintenance Mode</h2>
              <p class="text-sm text-muted mt-1">When enabled, all routes redirect to the maintenance page (except allowRoutes).</p>
            </div>
            <div class="flex items-center gap-4">
              <USwitch v-model="maintenanceEnabled" label="Enable maintenance mode" />
            </div>
            <div
              v-if="maintenanceEnabled"
              class="rounded-lg border border-warning-300/50 bg-warning-500/10 px-4 py-3 text-sm"
            >
              <div class="flex items-center gap-2 mb-1 font-semibold text-warning-600 dark:text-warning-400">
                <UIcon name="i-lucide-triangle-alert" />
                Maintenance mode active
              </div>
              <p class="text-muted">All routes redirect to <code class="font-mono text-xs">{{ config.maintenance.allowRoutes[0] }}</code></p>
              <p class="text-xs text-muted mt-1">Allowed routes: {{ config.maintenance.allowRoutes.join(', ') }}</p>
            </div>
          </section>

          <!-- 5. Scroll Routing -->
          <section class="space-y-4">
            <div>
              <h2 class="text-2xl font-bold">Scroll Routing</h2>
              <p class="text-sm text-muted mt-1">Full-screen sections sync the URL hash as you scroll — no page reload.</p>
            </div>
            <NuxtLink
              to="/routing-scroll"
              class="group flex items-center justify-between rounded-xl border border-default bg-elevated hover:border-primary-500/50 hover:bg-primary-500/5 px-5 py-4 transition-all"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-mouse" class="text-primary-500 text-lg" />
                  <span class="font-semibold">Open Scroll Demo</span>
                </div>
                <p class="text-xs text-muted">
                  Uses IntersectionObserver at threshold: 0.5 — same pattern as the scroll-routing plugin
                </p>
              </div>
              <UIcon name="i-lucide-arrow-right" class="text-muted group-hover:text-primary-500 transition-colors text-lg shrink-0" />
            </NuxtLink>
          </section>

          <!-- 6. Behavior Matrix -->
          <section class="space-y-4">
            <div>
              <h2 class="text-2xl font-bold">Behavior Matrix</h2>
              <p class="text-sm text-muted mt-1">How each preset treats starter (app) routes vs. layer routes.</p>
            </div>
            <UCard>
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-default">
                    <th class="text-left py-2 pr-6 font-semibold w-32">Preset</th>
                    <th class="text-left py-2 pr-6 font-semibold">Starter Routes</th>
                    <th class="text-left py-2 font-semibold">Layer Routes</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-default">
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
                      <UBadge color="warning" variant="subtle" size="xs">Denied unless feature declared</UBadge>
                    </td>
                  </tr>
                  <tr>
                    <td class="py-2.5 pr-6 font-mono text-violet-500">product</td>
                    <td class="py-2.5 pr-6">
                      <UBadge color="success" variant="subtle" size="xs">Allowed</UBadge>
                    </td>
                    <td class="py-2.5">
                      <UBadge color="warning" variant="subtle" size="xs">Denied unless feature declared</UBadge>
                    </td>
                  </tr>
                  <tr>
                    <td class="py-2.5 pr-6 font-mono text-red-500">enterprise</td>
                    <td class="py-2.5 pr-6">
                      <UBadge color="warning" variant="subtle" size="xs">Must declare feature</UBadge>
                    </td>
                    <td class="py-2.5">
                      <UBadge color="error" variant="subtle" size="xs">Must declare feature</UBadge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </UCard>
          </section>
        </div>
      </LayoutGridItem>
    </LayoutSection>
  </LayoutPageContainer>
</template>
