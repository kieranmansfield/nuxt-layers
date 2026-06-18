import {
  ROUTING_PRESETS,
  type FeatureValue,
  type RoutingLayerConfig,
  type RoutingPreset,
} from '#layers/routing/app/types/routing'

export type RoutingSimulatorStep = {
  label: string
  status: 'pass' | 'block' | 'redirect'
  note: string
}

export type RoutingSimulatorResult = {
  steps: RoutingSimulatorStep[]
  final: 'allow' | '404' | 'redirect'
  finalNote: string
}

function cloneMaintenanceDefaults(preset: RoutingPreset) {
  const defaults = ROUTING_PRESETS[preset].maintenance
  return {
    enabled: defaults.enabled,
    allowRoutes: [...defaults.allowRoutes],
  }
}

function cloneScrollDefaults(preset: RoutingPreset) {
  const defaults = ROUTING_PRESETS[preset].scrollRouting
  return {
    enabled: defaults.enabled,
    mode: defaults.mode,
  }
}

function resolveBoolean(value: boolean | undefined, fallback: boolean) {
  return value ?? fallback
}

function resolvePreset(routingLayer: Partial<RoutingLayerConfig> | undefined): RoutingPreset {
  return routingLayer?.preset ?? 'simple'
}

function resolveMaintenanceConfig(
  preset: RoutingPreset,
  maintenance: Partial<RoutingLayerConfig['maintenance']> | undefined
) {
  const defaults = cloneMaintenanceDefaults(preset)
  return {
    enabled: resolveBoolean(maintenance?.enabled, defaults.enabled),
    allowRoutes: maintenance?.allowRoutes ? [...maintenance.allowRoutes] : defaults.allowRoutes,
  }
}

function resolveScrollRoutingConfig(
  preset: RoutingPreset,
  scrollRouting: Partial<RoutingLayerConfig['scrollRouting']> | undefined
) {
  const defaults = cloneScrollDefaults(preset)
  return {
    enabled: resolveBoolean(scrollRouting?.enabled, defaults.enabled),
    mode: scrollRouting?.mode ?? defaults.mode,
  }
}

function resolveFeaturesConfig(features: Record<string, FeatureValue> | undefined) {
  return { ...(features ?? {}) }
}

// fallow-ignore-next-line complexity
export function resolveRoutingConfig(
  routingLayer: Partial<RoutingLayerConfig> | undefined
): RoutingLayerConfig {
  const preset = resolvePreset(routingLayer)
  const defaults = ROUTING_PRESETS[preset]

  return {
    preset,
    strictDefaultDeny: resolveBoolean(routingLayer?.strictDefaultDeny, defaults.strictDefaultDeny),
    layerDefaultDeny: resolveBoolean(routingLayer?.layerDefaultDeny, defaults.layerDefaultDeny),
    betaRedirect: routingLayer?.betaRedirect ?? defaults.betaRedirect,
    runtimeFlags: resolveBoolean(routingLayer?.runtimeFlags, defaults.runtimeFlags),
    debug: resolveBoolean(routingLayer?.debug, defaults.debug),
    maintenance: resolveMaintenanceConfig(preset, routingLayer?.maintenance),
    scrollRouting: resolveScrollRoutingConfig(preset, routingLayer?.scrollRouting),
    features: resolveFeaturesConfig(routingLayer?.features),
  }
}

// fallow-ignore-next-line complexity
export function buildPresetFlags(preset: RoutingPreset): string[] {
  const config = ROUTING_PRESETS[preset]
  const flags: string[] = []
  if (config.layerDefaultDeny) flags.push('layerDefaultDeny')
  if (config.strictDefaultDeny) flags.push('strictDefaultDeny')
  if (config.runtimeFlags) flags.push('runtimeFlags')
  if (config.maintenance.enabled) flags.push('maintenance')
  if (config.scrollRouting.enabled) flags.push('scrollRouting')
  return flags
}

function resolveFeatureStep(
  feature: string,
  variant: FeatureValue
): Pick<RoutingSimulatorResult, 'final' | 'finalNote'> & { step: RoutingSimulatorStep } {
  if (variant === 'disabled') {
    return {
      step: { label: `Feature "${feature}"`, status: 'block', note: 'Resolved: disabled → 404' },
      final: '404',
      finalNote: 'Feature disabled',
    }
  }

  if (variant === 'beta' || variant === 'coming-soon') {
    return {
      step: {
        label: `Feature "${feature}"`,
        status: 'redirect',
        note: `Resolved: ${variant} → /coming-soon`,
      },
      final: 'redirect',
      finalNote: '→ /coming-soon',
    }
  }

  return {
    step: { label: `Feature "${feature}"`, status: 'pass', note: 'Resolved: enabled' },
    final: 'allow',
    finalNote: 'Allowed',
  }
}

function buildMaintenanceResult(allowRoute: string): RoutingSimulatorResult {
  return {
    steps: [{ label: 'Maintenance mode', status: 'redirect', note: `Redirect → ${allowRoute}` }],
    final: 'redirect',
    finalNote: `→ ${allowRoute}`,
  }
}

function buildStrictBlockResult(reason: string, note: string): RoutingSimulatorResult {
  return {
    steps: [{ label: reason, status: 'block', note }],
    final: '404',
    finalNote: note,
  }
}

function evaluateMaintenance(
  config: RoutingLayerConfig,
  path: string
): RoutingSimulatorResult | null {
  if (!config.maintenance.enabled) return null
  const allowed = config.maintenance.allowRoutes.some((route) => path.startsWith(route))
  if (allowed) {
    return {
      steps: [{ label: 'Maintenance mode', status: 'pass', note: 'Path is in allowRoutes' }],
      final: 'allow',
      finalNote: 'Allowed',
    }
  }
  return buildMaintenanceResult(config.maintenance.allowRoutes[0] ?? '/')
}

function evaluateStrictDefaultDeny(
  config: RoutingLayerConfig,
  feature: string | undefined
): RoutingSimulatorResult | null {
  if (!config.strictDefaultDeny) return null
  if (!feature) {
    return buildStrictBlockResult('Strict mode (strictDefaultDeny)', 'No feature declared → 404')
  }
  return null
}

function evaluateLayerDefaultDeny(
  config: RoutingLayerConfig,
  feature: string | undefined,
  fromLayer: boolean
): RoutingSimulatorResult | null {
  if (!config.layerDefaultDeny || !fromLayer) return null
  if (!feature) {
    return buildStrictBlockResult(
      'Layer default-deny (layerDefaultDeny)',
      'Layer route without feature → 404'
    )
  }
  return null
}

function buildAllowResult(): RoutingSimulatorResult {
  return { steps: [{ label: 'Feature gate', status: 'pass', note: 'No feature required — allow' }], final: 'allow', finalNote: 'Allowed' }
}

function evaluateFeatureGate(
  config: RoutingLayerConfig,
  feature: string | undefined
): RoutingSimulatorResult {
  if (!feature) return buildAllowResult()
  const variant = config.features[feature] ?? 'disabled'
  const { step, final, finalNote } = resolveFeatureStep(feature, variant)
  return { steps: [step], final, finalNote }
}

export function simulateRoutingOutcome(
  config: RoutingLayerConfig,
  path: string,
  feature?: string,
  fromLayer = false
): RoutingSimulatorResult {
  const maintenance = evaluateMaintenance(config, path)
  if (maintenance) return maintenance

  const strict = evaluateStrictDefaultDeny(config, feature)
  if (strict) return strict

  const layer = evaluateLayerDefaultDeny(config, feature, fromLayer)
  if (layer) return layer

  return evaluateFeatureGate(config, feature)
}
