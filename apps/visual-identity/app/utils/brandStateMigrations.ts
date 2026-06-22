import type { BrandColour, BrandState, ThemeVariant } from '../composables/useBrandState'

function makeDefaultTheme(): ThemeVariant {
  return {
    id: 'default',
    name: 'Default',
    isDefault: true,
    colourMappings: { primary: null, secondary: null, accent: null, neutral: null },
  }
}

function dedupeColours(colours: BrandColour[]) {
  const seen = new Set<string>()
  return colours.filter((colour) => {
    const norm = colour.hex?.toLowerCase()
    if (!norm || seen.has(norm)) return false
    seen.add(norm)
    return true
  })
}

// fallow-ignore-next-line complexity
function migrateThemeMode(state: Record<string, unknown> & { themeMode?: Record<string, unknown> }) {
  if (!state.themeMode || !('mode' in state.themeMode) || 'schemes' in state.themeMode) return

  const oldMode = String(state.themeMode.mode ?? '')
  const schemesByMode: Record<string, string[]> = {
    'light-only': ['light'],
    'dark-only': ['dark'],
  }
  const schemes = schemesByMode[oldMode] ?? ['light', 'dark']

  state.themeMode = {
    schemes,
    contrastLevels: ['standard'],
    backgroundStyle:
      (state.themeMode.backgroundStyle as BrandState['themeMode']['backgroundStyle']) ?? 'neutral',
  }
}

function ensureThemes(
  state: Record<string, unknown> & {
    themes?: ThemeVariant[]
  }
) {
  if (!Array.isArray(state.themes) || state.themes.length === 0) {
    state.themes = [makeDefaultTheme()]
  }
}

export function migrateBrandState(raw: Record<string, unknown>): BrandState {
  const state = raw as Record<string, unknown> & {
    themeMode?: Record<string, unknown>
    themes?: ThemeVariant[]
    colours?: BrandColour[]
  }

  migrateThemeMode(state)
  ensureThemes(state)

  if (Array.isArray(state.colours)) {
    state.colours = dedupeColours(state.colours)
  }

  return state as BrandState
}
