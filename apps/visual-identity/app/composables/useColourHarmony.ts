import { formatHex, oklch, parse } from 'culori'

import type { HarmonyType } from './useBrandState'

function rotateHue(hex: string, ...degrees: number[]): string[] {
  const parsed = parse(hex)
  if (!parsed) return degrees.map(() => hex)

  const base = oklch(parsed)
  if (!base) return degrees.map(() => hex)

  return degrees.map((deg) => {
    const rotated = { ...base, h: ((base.h ?? 0) + deg) % 360 }
    return formatHex(rotated) ?? hex
  })
}

export function computeHarmony(hex: string, type: HarmonyType): string[] {
  switch (type) {
    case 'complementary':
      return rotateHue(hex, 180)
    case 'analogous':
      return rotateHue(hex, -30, 30)
    case 'triadic':
      return rotateHue(hex, 120, 240)
    case 'split-complementary':
      return rotateHue(hex, 150, 210)
    case 'tetradic':
      return rotateHue(hex, 90, 180, 270)
  }
}

export function useColourHarmony(hex: Ref<string>, type: Ref<HarmonyType | null>) {
  return computed<string[]>(() => {
    if (!type.value || !hex.value) return []
    return computeHarmony(hex.value, type.value)
  })
}

export const HARMONY_LABELS: Record<HarmonyType, string> = {
  complementary: 'Complementary',
  analogous: 'Analogous',
  triadic: 'Triadic',
  'split-complementary': 'Split Complementary',
  tetradic: 'Tetradic',
}

export const HARMONY_TYPES: HarmonyType[] = [
  'complementary',
  'analogous',
  'triadic',
  'split-complementary',
  'tetradic',
]
