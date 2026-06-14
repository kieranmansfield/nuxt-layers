import { formatHex, oklch, parse } from 'culori'

export type ScaleEntry = {
  step: string
  hex: string
  oklchStr: string
}

const SCALE_STEPS = [
  { name: '50', l: 0.971 },
  { name: '100', l: 0.936 },
  { name: '200', l: 0.861 },
  { name: '300', l: 0.761 },
  { name: '400', l: 0.647 },
  { name: '500', l: 0.532 },
  { name: '600', l: 0.437 },
  { name: '700', l: 0.361 },
  { name: '800', l: 0.282 },
  { name: '900', l: 0.211 },
  { name: '950', l: 0.141 },
] as const

export function generateScale(hex: string): ScaleEntry[] {
  const parsed = parse(hex)
  if (!parsed) return []

  const base = oklch(parsed)
  if (!base) return []

  return SCALE_STEPS.map(({ name, l }) => {
    const color = { ...base, l }
    const hexVal = formatHex(color) ?? hex
    const c = (base.c ?? 0).toFixed(3)
    const h = (base.h ?? 0).toFixed(1)
    return {
      step: name,
      hex: hexVal,
      oklchStr: `oklch(${(l * 100).toFixed(1)}% ${c} ${h})`,
    }
  })
}

export function useTailwindScale(hex: Ref<string>) {
  return computed(() => generateScale(hex.value))
}
