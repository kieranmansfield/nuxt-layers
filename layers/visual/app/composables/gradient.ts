import type { ComputedRef, CSSProperties, MaybeRefOrGetter } from 'vue'

import type { GradientConfig } from '../types/gradient'
import { buildGradientStyle } from '../utils/gradientStyle'

const DEFAULT_CONFIG: GradientConfig = {
  shape: 'linear',
  direction: 'to-br',
  from: { color: 'primary', shade: 500 },
  to: { color: 'secondary', shade: 500 },
}

function resolveGradientConfig(
  raw: GradientConfig | string,
  override: Partial<GradientConfig> | undefined,
  appConfig: ReturnType<typeof useAppConfig>
): GradientConfig {
  return mergeGradientOverride(resolveGradientPreset(raw, appConfig), override)
}

function resolveGradientPreset(
  raw: GradientConfig | string,
  appConfig: ReturnType<typeof useAppConfig>
): GradientConfig {
  if (typeof raw !== 'string') return raw

  return resolveGradientPresetByName(raw, getGradientPresetMap(appConfig))
}

function getGradientPresetMap(appConfig: ReturnType<typeof useAppConfig>) {
  return (appConfig.uiLayer as Record<string, unknown> | undefined)?.['gradients'] as
    | Record<string, GradientConfig>
    | undefined
}

function resolveGradientPresetByName(
  name: string,
  presets: Record<string, GradientConfig> | undefined
) {
  return presets?.[name] ?? DEFAULT_CONFIG
}

function mergeGradientOverride(
  resolved: GradientConfig,
  override: Partial<GradientConfig> | undefined
): GradientConfig {
  return override ? { ...resolved, ...override } : resolved
}

export function useGradient(
  config: MaybeRefOrGetter<GradientConfig | string>,
  overrides?: MaybeRefOrGetter<Partial<GradientConfig>>
): { style: ComputedRef<CSSProperties> } {
  const appConfig = useAppConfig()

  const style = computed((): CSSProperties => {
    const raw = toValue(config)
    const override = overrides ? toValue(overrides) : undefined
    return buildGradientStyle(resolveGradientConfig(raw, override, appConfig))
  })

  return { style }
}
