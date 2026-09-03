import type { CSSProperties } from 'vue'

import type { GradientConfig, GradientStop } from '../types/gradient'
import { resolveUiColorToken } from './colorTokens'

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

export function resolveGradientColor(stop: GradientStop): string {
  return resolveUiColorToken(stop)
}

function resolveGradientStops(cfg: GradientConfig) {
  const from = resolveGradientColor(cfg.from)
  const to = resolveGradientColor(cfg.to)
  const via = cfg.via ? resolveGradientColor(cfg.via) : undefined
  return via ? `${from}, ${via}, ${to}` : `${from}, ${to}`
}

// fallow-ignore-next-line complexity
export function buildGradientStyle(cfg: GradientConfig): CSSProperties {
  const stops = resolveGradientStops(cfg)

  if (cfg.shape === 'radial') {
    return { backgroundImage: `radial-gradient(circle, ${stops})` }
  }
  if (cfg.shape === 'conic') {
    return { backgroundImage: `conic-gradient(${stops})` }
  }

  const direction = DIRECTION_MAP[cfg.direction ?? 'to-br'] ?? 'to bottom right'
  return { backgroundImage: `linear-gradient(${direction}, ${stops})` }
}
