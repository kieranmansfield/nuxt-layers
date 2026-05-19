// Culori v4 ships as TypeScript source but pnpm resolves to src/index.js without .d.ts.
// This shim makes it importable; the functions work correctly at runtime.
declare module 'culori' {
  interface Color {
    mode: string
    alpha?: number
  }

  interface RgbColor extends Color {
    mode: 'rgb'
    r: number
    g: number
    b: number
  }

  interface OklchColor extends Color {
    mode: 'oklch'
    l: number
    c: number
    h: number | undefined
  }

  interface HslColor extends Color {
    mode: 'hsl'
    h: number | undefined
    s: number
    l: number
  }

  type AnyColor = Color & Record<string, number | string | undefined>

  export function parse(value: string): AnyColor | undefined
  export function formatHex(color: AnyColor | undefined): string | undefined
  export function oklch(color: AnyColor): OklchColor | undefined
  export function hsl(color: AnyColor): HslColor | undefined
}
