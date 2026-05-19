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

export interface ThemeMode {
  mode: 'light-only' | 'dark-only' | 'both'
  backgroundStyle: BackgroundStyle
}

export interface BrandState {
  meta: { name: string; description: string }
  colours: BrandColour[]
  typography: FontConfig[]
  themeMode: ThemeMode
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
    themeMode: { mode: 'both', backgroundStyle: 'neutral' },
  }
}

export function useBrandState() {
  const state = useState<BrandState>('brand', makeDefaultState)

  if (import.meta.client) {
    onMounted(() => {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          Object.assign(state.value, JSON.parse(saved))
        } catch {}
      }
    })

    watch(
      state,
      (val) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      },
      { deep: true }
    )
  }

  function addColour(hex = '#6366f1') {
    const role =
      state.value.colours.length === 0
        ? 'primary'
        : state.value.colours.length === 1
          ? 'secondary'
          : state.value.colours.length === 2
            ? 'accent'
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

  function updateFontAxis(id: string, axis: keyof FontAxes, value: number) {
    const idx = state.value.typography.findIndex((f) => f.id === id)
    if (idx < 0) return
    const font = state.value.typography[idx]!
    // Replace axes object so Vue's reactivity system picks up the change
    state.value.typography[idx] = { ...font, axes: { ...font.axes, [axis]: value } }
  }

  function updateFontScale(id: string, field: 'sizeScale' | 'spacingScale', scale: number[]) {
    const font = state.value.typography.find((f) => f.id === id)
    if (font) font[field] = scale
  }

  function importState(json: string) {
    try {
      const parsed = JSON.parse(json) as BrandState
      Object.assign(state.value, parsed)
    } catch {
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
    importState,
    resetState,
  }
}
