import {
  BREAKPOINT_VALUES,
  DEVICE_BREAKPOINT_VALUES,
  PHONE_BREAKPOINT_VALUES,
  TABLET_BREAKPOINT_VALUES,
} from '../types/breakpoints'

import type { ResponsiveSizes } from '../types/media'

type BreakpointGroup = readonly [keyof ResponsiveSizes, number]

const BREAKPOINT_GROUPS = [
  ['2xl', BREAKPOINT_VALUES['2xl']],
  ['xl', BREAKPOINT_VALUES.xl],
  ['lg', BREAKPOINT_VALUES.lg],
  ['md', BREAKPOINT_VALUES.md],
  ['sm', BREAKPOINT_VALUES.sm],
  ['wide', DEVICE_BREAKPOINT_VALUES.wide],
  ['desktop', DEVICE_BREAKPOINT_VALUES.desktop],
  ['tablet', DEVICE_BREAKPOINT_VALUES.tablet],
  ['phone-lg', PHONE_BREAKPOINT_VALUES['phone-lg']],
  ['phone-md', PHONE_BREAKPOINT_VALUES['phone-md']],
  ['phone-sm', PHONE_BREAKPOINT_VALUES['phone-sm']],
  ['tablet-lg', TABLET_BREAKPOINT_VALUES['tablet-lg']],
  ['tablet-md', TABLET_BREAKPOINT_VALUES['tablet-md']],
  ['tablet-sm', TABLET_BREAKPOINT_VALUES['tablet-sm']],
] as const satisfies readonly BreakpointGroup[]

// fallow-ignore-next-line complexity
export function buildResponsiveSizesQueries(sizes: ResponsiveSizes): string[] {
  const breakpoints = BREAKPOINT_GROUPS.filter(([key]) => sizes[key])
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)

  const queries: string[] = []

  if (sizes.landscape) queries.push(`(orientation: landscape) ${sizes.landscape}`)
  if (sizes.portrait) queries.push(`(orientation: portrait) ${sizes.portrait}`)

  for (const breakpoint of breakpoints) {
    const size = sizes[breakpoint.key]
    if (size) {
      queries.push(`(min-width: ${breakpoint.value}px) ${size}`)
    }
  }

  queries.push(sizes.default)
  return queries
}
