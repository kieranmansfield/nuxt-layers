import type { ComputedRef, CSSProperties, MaybeRefOrGetter } from 'vue'
import type { GradientConfig, GradientStop } from '../types/gradient'

const DEFAULT_CONFIG: GradientConfig = {
  shape: 'linear',
  direction: 'to-br',
  from: { color: 'primary', shade: 500 },
  to: { color: 'secondary', shade: 500 },
}

const DIRECTION_MAP: Record<string, string> = {
  'to-t': 'to top',
  'to-tr': 'to top right',
  'to-r': 'to right',
  'to-br': 'to bottom right',
  'to-b': 'to bottom',
  'to-bl': 'to bottom left',
  'to-l': 'to left',
  'to-tl': 'to top left',
}

function resolveColor(stop: GradientStop): string {
  const { color, shade = 500, opacity } = stop
  if (color === 'transparent') return 'transparent'
  if (color === 'white') {
    return opacity !== undefined ? `rgb(255 255 255 / ${opacity / 100})` : '#ffffff'
  }
  if (color === 'black') {
    return opacity !== undefined ? `rgb(0 0 0 / ${opacity / 100})` : '#000000'
  }
  const v = `var(--ui-color-${color}-${shade})`
  return opacity !== undefined ? `color-mix(in srgb, ${v} ${opacity}%, transparent)` : v
}

function buildStyle(cfg: GradientConfig): CSSProperties {
  const from = resolveColor(cfg.from)
  const to = resolveColor(cfg.to)
  const via = cfg.via ? resolveColor(cfg.via) : undefined
  const stops = via ? `${from}, ${via}, ${to}` : `${from}, ${to}`

  if (cfg.shape === 'radial') {
    return { backgroundImage: `radial-gradient(circle, ${stops})` }
  }
  if (cfg.shape === 'conic') {
    return { backgroundImage: `conic-gradient(${stops})` }
  }
  const dir = DIRECTION_MAP[cfg.direction ?? 'to-br'] ?? 'to bottom right'
  return { backgroundImage: `linear-gradient(${dir}, ${stops})` }
}

export function useGradient(
  config: MaybeRefOrGetter<GradientConfig | string>,
  overrides?: MaybeRefOrGetter<Partial<GradientConfig>>
): { style: ComputedRef<CSSProperties> } {
  const appConfig = useAppConfig()

  const style = computed((): CSSProperties => {
    const raw = toValue(config)
    const override = overrides ? toValue(overrides) : undefined

    let resolved: GradientConfig
    if (typeof raw === 'string') {
      const preset = (appConfig.uiLayer as Record<string, unknown> | undefined)?.gradients as
        | Record<string, GradientConfig>
        | undefined
      resolved = preset?.[raw] ?? DEFAULT_CONFIG
    } else {
      resolved = raw
    }

    if (override) {
      resolved = { ...resolved, ...override }
    }

    return buildStyle(resolved)
  })

  return { style }
}
