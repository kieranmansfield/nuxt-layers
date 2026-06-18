import { formatHex, oklch, parse } from 'culori'

type RgbFallback = { mode: 'rgb'; r: number; g: number; b: number }
type OklchColor = NonNullable<ReturnType<typeof oklch>>

const WHITE: RgbFallback = { mode: 'rgb', r: 1, g: 1, b: 1 }
const BLACK: RgbFallback = { mode: 'rgb', r: 0, g: 0, b: 0 }

function toOklch(hex: string, fallback: RgbFallback): OklchColor {
  return oklch(parse(hex) ?? fallback) ?? oklch(fallback)!
}

function mixChannel(start: number | undefined, end: number | undefined, t: number): number {
  const a = start ?? 0
  const b = end ?? 0
  return a + (b - a) * t
}

export function mixOklch(hexA: string, hexB: string, t: number): string {
  const a = toOklch(hexA, WHITE)
  const b = toOklch(hexB, BLACK)

  return (
    formatHex({
      mode: 'oklch',
      l: mixChannel(a.l, b.l, t),
      c: mixChannel(a.c, b.c, t),
      h: mixChannel(a.h, b.h, t),
    }) ?? hexA
  )
}
