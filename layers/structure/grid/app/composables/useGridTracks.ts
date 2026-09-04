import type { GridPreset, TrackConfig } from '../types/tracks'

type GridLayerAppConfig = {
  gridLayer?: {
    presets?: Record<string, GridPreset>
  }
}

function normalizeNames(names: string | string[] | undefined): string[] {
  if (!names) return []
  return Array.isArray(names) ? names : [names]
}

function toBracket(names: string[]): string {
  return names.length > 0 ? `[${names.join(' ')}]` : ''
}

/**
 * Builds a `grid-template-columns` value from a TrackConfig. Each segment becomes a
 * `minmax(floor, Nfr)` track; adjacent lineEnd/lineStart names merge into one bracket,
 * per standard named-grid-line syntax.
 */
export function toColumnsCss(config: TrackConfig): string {
  const minWidth = config.minTrackWidth ?? 'var(--measure-min)'
  const segments = config.columns

  const parts: string[] = []

  segments.forEach((segment, index) => {
    const previous = index > 0 ? segments[index - 1] : undefined
    const leadNames = [...normalizeNames(previous?.lineEnd), ...normalizeNames(segment.lineStart)]
    const leadBracket = toBracket(leadNames)
    if (leadBracket) parts.push(leadBracket)
    parts.push(`minmax(${minWidth}, ${segment.size}fr)`)
  })

  const lastSegment = segments[segments.length - 1]
  const trailBracket = toBracket(normalizeNames(lastSegment?.lineEnd))
  if (trailBracket) parts.push(trailBracket)

  return parts.join(' ')
}

/**
 * Resolves a preset name against a registry, or passes a TrackConfig object through
 * unchanged. Exported standalone so it's testable without Nuxt's useAppConfig context.
 */
export function resolve(
  input: string | TrackConfig,
  presets?: Record<string, GridPreset>
): TrackConfig {
  if (typeof input === 'string') {
    const found = presets?.[input]
    if (!found) {
      throw new Error(`Unknown grid preset: "${input}"`)
    }
    return found
  }
  return input
}

export function useGridTracks() {
  const appConfig = useAppConfig() as GridLayerAppConfig
  const presets = computed(() => appConfig.gridLayer?.presets)

  return {
    resolve: (input: string | TrackConfig) => resolve(input, presets.value),
    toColumnsCss,
  }
}
