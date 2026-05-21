export interface BrandColour {
  id: string
  name: string
  hex: string
  role: 'primary' | 'secondary' | 'accent' | 'neutral' | 'custom'
  harmonyType: HarmonyType | null
}

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'

export interface FontAxes {
  wght: number // 100–900
  wdth: number // 25–151
  opsz: number // 8–144
  slnt: number // -10–0
  GRAD: number // -200–150
  XTRA: number // 323–603
  XOPQ: number // 27–175
  YOPQ: number // 25–135
  YTLC: number // 416–570
  YTUC: number // 528–760
  YTAS: number // 649–854
  YTDE: number // -305– -98
  YTFI: number // 560–788
}

export interface FontConfig {
  id: string
  role: 'heading' | 'body' | 'mono' | 'custom'
  family: string
  axes: FontAxes
  sizeScale: number[]
  spacingScale: number[]
}

export type BackgroundStyle = 'neutral' | 'tinted' | 'blended'
export type ColourScheme = 'light' | 'dark'
export type ContrastLevel = 'standard' | 'high'

export interface ThemeMode {
  schemes: ColourScheme[]
  contrastLevels: ContrastLevel[]
  backgroundStyle: BackgroundStyle
}

// A theme variant remaps which brand colours fill each semantic role.
// null = use the BrandColour whose role matches the slot.
export interface ThemeVariant {
  id: string
  name: string
  isDefault: boolean
  colourMappings: {
    primary: string | null
    secondary: string | null
    accent: string | null
    neutral: string | null
  }
}

export interface BrandState {
  meta: { name: string; description: string }
  colours: BrandColour[]
  typography: FontConfig[]
  themeMode: ThemeMode
  themes: ThemeVariant[]
}

export const DEFAULT_AXES: FontAxes = {
  wght: 400,
  wdth: 100,
  opsz: 14,
  slnt: 0,
  GRAD: 0,
  XTRA: 468,
  XOPQ: 96,
  YOPQ: 79,
  YTLC: 514,
  YTUC: 712,
  YTAS: 750,
  YTDE: -203,
  YTFI: 738,
}

export const FONT_AXIS_META: Record<
  keyof FontAxes,
  { label: string; min: number; max: number; step: number }
> = {
  wght: { label: 'Weight', min: 100, max: 900, step: 1 },
  wdth: { label: 'Width', min: 25, max: 151, step: 1 },
  opsz: { label: 'Optical Size', min: 8, max: 144, step: 1 },
  slnt: { label: 'Slant', min: -10, max: 0, step: 0.1 },
  GRAD: { label: 'Grade', min: -200, max: 150, step: 1 },
  XTRA: { label: 'Counter Width', min: 323, max: 603, step: 1 },
  XOPQ: { label: 'Thick Stroke', min: 27, max: 175, step: 1 },
  YOPQ: { label: 'Thin Stroke', min: 25, max: 135, step: 1 },
  YTLC: { label: 'Lowercase Height', min: 416, max: 570, step: 1 },
  YTUC: { label: 'Uppercase Height', min: 528, max: 760, step: 1 },
  YTAS: { label: 'Ascender Height', min: 649, max: 854, step: 1 },
  YTDE: { label: 'Descender Depth', min: -305, max: -98, step: 1 },
  YTFI: { label: 'Figure Height', min: 560, max: 788, step: 1 },
}

const STORAGE_KEY = 'vi-brand-state'

function makeDefaultTheme(): ThemeVariant {
  return {
    id: 'default',
    name: 'Default',
    isDefault: true,
    colourMappings: { primary: null, secondary: null, accent: null, neutral: null },
  }
}

function makeDefaultState(): BrandState {
  return {
    meta: { name: '', description: '' },
    colours: [],
    typography: [
      {
        id: 'heading',
        role: 'heading',
        family: 'Roboto Flex',
        axes: { ...DEFAULT_AXES },
        sizeScale: [12, 14, 16, 20, 24, 32, 48, 64, 80],
        spacingScale: [4, 8, 12, 16, 24, 32, 48, 64, 96],
      },
      {
        id: 'body',
        role: 'body',
        family: 'Roboto Flex',
        axes: { ...DEFAULT_AXES },
        sizeScale: [12, 14, 16, 20, 24, 32, 48, 64, 80],
        spacingScale: [4, 8, 12, 16, 24, 32, 48, 64, 96],
      },
    ],
    themeMode: {
      schemes: ['light', 'dark'],
      contrastLevels: ['standard'],
      backgroundStyle: 'neutral',
    },
    themes: [makeDefaultTheme()],
  }
}

// Migrate localStorage state written by older versions of the app.
function migrateState(raw: Record<string, unknown>): BrandState {
  // Use a loose type so the migration code can freely read/write any property
  // without fighting TypeScript's narrowing on the old schema.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = raw as Record<string, any>

  // Old format: themeMode.mode = 'light-only' | 'dark-only' | 'both'
  if (s.themeMode && 'mode' in s.themeMode && !('schemes' in s.themeMode)) {
    const old: string = s.themeMode.mode
    s.themeMode = {
      schemes: old === 'light-only' ? ['light'] : old === 'dark-only' ? ['dark'] : ['light', 'dark'],
      contrastLevels: ['standard'],
      backgroundStyle: s.themeMode.backgroundStyle ?? 'neutral',
    }
  }

  if (!Array.isArray(s.themes) || s.themes.length === 0) {
    s.themes = [makeDefaultTheme()]
  }

  // Remove duplicate hex values already in saved state (keep first occurrence)
  if (Array.isArray(s.colours)) {
    const seen = new Set<string>()
    s.colours = s.colours.filter((c: BrandColour) => {
      const norm = c.hex?.toLowerCase()
      if (!norm || seen.has(norm)) return false
      seen.add(norm)
      return true
    })
  }

  return s as BrandState
}

export function useBrandState() {
  const state = useState<BrandState>('brand', makeDefaultState)

  if (import.meta.client) {
    onMounted(() => {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          Object.assign(state.value, migrateState(JSON.parse(saved)))
        }
        catch {}
      }
    })

    watch(state, (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    }, { deep: true })
  }

  // ── Colours ──────────────────────────────────────────────────────────

  function addColour(hex = '#6366f1') {
    // Skip silently if this hex is already in the palette
    const norm = hex.toLowerCase()
    if (state.value.colours.some((c) => c.hex.toLowerCase() === norm)) return

    const role =
      state.value.colours.length === 0 ? 'primary'
      : state.value.colours.length === 1 ? 'secondary'
      : state.value.colours.length === 2 ? 'accent'
      : 'custom'

    state.value.colours.push({
      id: crypto.randomUUID(),
      name: role.charAt(0).toUpperCase() + role.slice(1),
      hex,
      role: role as BrandColour['role'],
      harmonyType: null,
    })
  }

  function removeColour(id: string) {
    state.value.colours = state.value.colours.filter((c) => c.id !== id)
  }

  function updateColour(id: string, patch: Partial<BrandColour>) {
    const idx = state.value.colours.findIndex((c) => c.id === id)
    if (idx >= 0) Object.assign(state.value.colours[idx]!, patch)
  }

  // ── Typography ───────────────────────────────────────────────────────

  function updateFontAxis(id: string, axis: keyof FontAxes, value: number) {
    const idx = state.value.typography.findIndex((f) => f.id === id)
    if (idx < 0) return
    const font = state.value.typography[idx]!
    state.value.typography[idx] = { ...font, axes: { ...font.axes, [axis]: value } }
  }

  function updateFontScale(id: string, field: 'sizeScale' | 'spacingScale', scale: number[]) {
    const font = state.value.typography.find((f) => f.id === id)
    if (font) font[field] = scale
  }

  // ── Themes ───────────────────────────────────────────────────────────

  function addTheme(name: string) {
    state.value.themes.push({
      id: crypto.randomUUID(),
      name,
      isDefault: false,
      colourMappings: { primary: null, secondary: null, accent: null, neutral: null },
    })
  }

  function removeTheme(id: string) {
    state.value.themes = state.value.themes.filter((t) => t.id !== id)
  }

  function updateTheme(id: string, patch: Partial<Pick<ThemeVariant, 'name' | 'colourMappings'>>) {
    const idx = state.value.themes.findIndex((t) => t.id === id)
    if (idx >= 0) Object.assign(state.value.themes[idx]!, patch)
  }

  function setThemeColour(
    themeId: string,
    role: keyof ThemeVariant['colourMappings'],
    colourId: string | null,
  ) {
    const theme = state.value.themes.find((t) => t.id === themeId)
    if (theme) theme.colourMappings[role] = colourId
  }

  // ── Persistence ──────────────────────────────────────────────────────

  function importState(json: string) {
    try {
      Object.assign(state.value, migrateState(JSON.parse(json)))
    }
    catch {
      throw new Error('Invalid brand configuration JSON')
    }
  }

  function resetState() {
    Object.assign(state.value, makeDefaultState())
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
  }

  return {
    state,
    addColour,
    removeColour,
    updateColour,
    updateFontAxis,
    updateFontScale,
    addTheme,
    removeTheme,
    updateTheme,
    setThemeColour,
    importState,
    resetState,
  }
}
