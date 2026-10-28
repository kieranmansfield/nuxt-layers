import type { PortfolioStackEntry } from '../types/content'

export type ResolvedStackItem = {
  name: string
  icon: string
  color: string
  url?: string
}

type Breakpoint = 'default' | 'md' | 'lg'

type FanTrack = {
  /** Grid columns at this breakpoint — mirrors layout's `.grid-root` 6/12/18 */
  cols: number
  /** Columns each card spans */
  span: number
  /** Columns between card starts; `step < span` is what makes neighbours overlap */
  step: number
}

export type FanPlacement = {
  colStart: number
  colSpan: number
  rowStart: number
  /** Row this card was dealt into, and its index within that row */
  row: number
  position: number
  /** Card rotation in degrees, fanned around the row's centre */
  rotate: number
  /** Downward drop as a % of the card's own height, so the row curves like a held hand */
  drop: number
}

const FALLBACK_ICON = 'i-lucide-code-xml'
const FALLBACK_COLOR = '#94a3b8'

// Keyed by `stackKey()` — lowercase with spaces, dots and dashes stripped
const KNOWN_STACK: Record<string, { icon: string; color: string }> = {
  javascript: { icon: 'i-logos-javascript', color: '#f7df1e' },
  js: { icon: 'i-logos-javascript', color: '#f7df1e' },
  typescript: { icon: 'i-logos-typescript-icon', color: '#3178c6' },
  ts: { icon: 'i-logos-typescript-icon', color: '#3178c6' },
  vue: { icon: 'i-logos-vue', color: '#42b883' },
  vuejs: { icon: 'i-logos-vue', color: '#42b883' },
  nuxt: { icon: 'i-logos-nuxt-icon', color: '#00dc82' },
  nuxtjs: { icon: 'i-logos-nuxt-icon', color: '#00dc82' },
  tailwind: { icon: 'i-logos-tailwindcss-icon', color: '#06b6d4' },
  tailwindcss: { icon: 'i-logos-tailwindcss-icon', color: '#06b6d4' },
  html: { icon: 'i-logos-html-5', color: '#e34f26' },
  html5: { icon: 'i-logos-html-5', color: '#e34f26' },
  css: { icon: 'i-logos-css-3', color: '#1572b6' },
  css3: { icon: 'i-logos-css-3', color: '#1572b6' },
  sass: { icon: 'i-logos-sass', color: '#cc6699' },
  scss: { icon: 'i-logos-sass', color: '#cc6699' },
  react: { icon: 'i-logos-react', color: '#61dafb' },
  next: { icon: 'i-logos-nextjs-icon', color: '#a1a1aa' },
  nextjs: { icon: 'i-logos-nextjs-icon', color: '#a1a1aa' },
  svelte: { icon: 'i-logos-svelte-icon', color: '#ff3e00' },
  astro: { icon: 'i-logos-astro-icon', color: '#ff5d01' },
  node: { icon: 'i-logos-nodejs-icon', color: '#5fa04e' },
  nodejs: { icon: 'i-logos-nodejs-icon', color: '#5fa04e' },
  vite: { icon: 'i-logos-vitejs', color: '#646cff' },
  vitest: { icon: 'i-logos-vitest', color: '#6e9f18' },
  gsap: { icon: 'i-logos-greensock-icon', color: '#88ce02' },
  greensock: { icon: 'i-logos-greensock-icon', color: '#88ce02' },
  three: { icon: 'i-logos-threejs', color: '#049ef4' },
  threejs: { icon: 'i-logos-threejs', color: '#049ef4' },
  figma: { icon: 'i-logos-figma', color: '#f24e1e' },
  git: { icon: 'i-logos-git-icon', color: '#f05032' },
  github: { icon: 'i-logos-github-icon', color: '#a1a1aa' },
  postgres: { icon: 'i-logos-postgresql', color: '#4169e1' },
  postgresql: { icon: 'i-logos-postgresql', color: '#4169e1' },
  drizzle: { icon: 'i-logos-drizzle', color: '#c5f74f' },
  netlify: { icon: 'i-logos-netlify-icon', color: '#00c7b7' },
  vercel: { icon: 'i-logos-vercel-icon', color: '#a1a1aa' },
  pnpm: { icon: 'i-logos-pnpm', color: '#f69220' },
  zod: { icon: 'i-logos-zod', color: '#3e67b1' },
  markdown: { icon: 'i-logos-markdown', color: '#a1a1aa' },
  pinia: { icon: 'i-logos-pinia', color: '#ffd859' },
  graphql: { icon: 'i-logos-graphql', color: '#e10098' },
  docker: { icon: 'i-logos-docker-icon', color: '#2496ed' },
  python: { icon: 'i-logos-python', color: '#3776ab' },
  resend: { icon: 'i-logos-resend', color: '#a1a1aa' },
}

const stackKey = (name: string) => name.toLowerCase().replace(/[\s.\-_]/g, '')

/** Normalises a frontmatter stack entry, filling icon/colour from the known-tech table. */
export function resolveStackItem(entry: PortfolioStackEntry): ResolvedStackItem {
  const item = typeof entry === 'string' ? { name: entry } : entry
  const known = KNOWN_STACK[stackKey(item.name)]
  return {
    name: item.name,
    icon: item.icon ?? known?.icon ?? FALLBACK_ICON,
    color: item.color ?? known?.color ?? FALLBACK_COLOR,
    ...(item.url !== undefined && { url: item.url }),
  }
}

/**
 * Track per breakpoint, on the same 6/12/18 columns and 48rem/80rem switch points as layout's
 * Swiss grid, so `LayoutGridItem`'s responsive placement lines up with the stack grid.
 */
export const STACK_FAN_TRACKS: Record<Breakpoint, FanTrack> = {
  default: { cols: 6, span: 2, step: 1 },
  md: { cols: 12, span: 3, step: 2 },
  lg: { cols: 18, span: 3, step: 2 },
}

// Widest a whole row fans to either side, and the cap per card for short rows
const MAX_FAN_ANGLE = 14
const MAX_STEP_ANGLE = 5
// Radius of the arc the cards sit on, in card heights — larger is a flatter hand
const FAN_RADIUS = 4

/**
 * Deals card `index` of `total` into a row of overlapping, fanned cards. Rows hold as many cards
 * as the track fits; a short last row is centred.
 */
export function fanPlacement(index: number, total: number, track: FanTrack): FanPlacement {
  const { cols, span, step } = track
  const perRow = Math.max(1, Math.floor((cols - span) / step) + 1)
  const row = Math.floor(index / perRow)
  const position = index % perRow
  const inRow = Math.min(perRow, total - row * perRow)
  const width = span + (inRow - 1) * step
  const offset = Math.floor((cols - width) / 2)

  // -1 … 1 across the row, 0 in the middle
  const t = inRow > 1 ? (position - (inRow - 1) / 2) / ((inRow - 1) / 2) : 0
  const halfSpread = Math.min(MAX_FAN_ANGLE, (MAX_STEP_ANGLE * (inRow - 1)) / 2)
  const rotate = round(t * halfSpread)
  const drop = round(FAN_RADIUS * 100 * (1 - Math.cos((rotate * Math.PI) / 180)))

  return {
    colStart: 1 + offset + position * step,
    colSpan: span,
    rowStart: row + 1,
    row,
    position,
    rotate,
    drop,
  }
}

/**
 * Sideways nudge, as a % of card width, for `card` while `active` is lifted out of the hand:
 * neighbours in the same row part to make room, falling off with distance.
 */
export function fanSpread(active: FanPlacement, card: FanPlacement): number {
  if (card.row !== active.row || card.position === active.position) return 0
  const distance = card.position - active.position
  return round(Math.sign(distance) * (22 / Math.abs(distance)))
}

const round = (n: number) => Math.round(n * 100) / 100
