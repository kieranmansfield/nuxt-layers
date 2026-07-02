import { describe, expect, it } from 'vitest'

import {
  aspectClasses,
  buildGridPlacementClasses,
  buildGridPlacementStyle,
  layerZIndex,
  resolveAlignmentStyles,
  resolveBleedStyles,
  resolveDefaultPlacement,
  resolveLayerStyles,
  resolveResponsivePlacementVars,
  resolveRhythmStyles,
} from './gridPlacementStyle'

describe('layerZIndex map', () => {
  it('assigns ascending z-index values', () => {
    expect(layerZIndex).toEqual({ back: 0, mid: 10, front: 20, top: 30 })
  })
})

describe('aspectClasses map', () => {
  it('maps aspect ratios to tailwind classes', () => {
    expect(aspectClasses).toEqual({
      '1/1': 'aspect-square',
      '4/3': 'aspect-[4/3]',
      '3/4': 'aspect-[3/4]',
      '16/9': 'aspect-video',
      '9/16': 'aspect-[9/16]',
      '2/1': 'aspect-[2/1]',
      '1/2': 'aspect-[1/2]',
    })
  })
})

describe('resolveDefaultPlacement', () => {
  it('returns the fallback when value is undefined', () => {
    expect(resolveDefaultPlacement(undefined, 'full')).toBe('full')
    expect(resolveDefaultPlacement<number>(undefined, undefined)).toBeUndefined()
  })

  it('returns the plain value unchanged', () => {
    expect(resolveDefaultPlacement(3, undefined)).toBe(3)
    expect(resolveDefaultPlacement<string>('full', 'other')).toBe('full')
  })

  it('unwraps a responsive value default', () => {
    expect(resolveDefaultPlacement({ default: 2, md: 4 }, undefined)).toBe(2)
  })
})

describe('resolveResponsivePlacementVars', () => {
  it('returns no vars for a plain value', () => {
    expect(resolveResponsivePlacementVars(3, 'cs')).toEqual({})
  })

  it('returns no vars when value is undefined', () => {
    expect(resolveResponsivePlacementVars(undefined, 'cs')).toEqual({})
  })

  it('sets only the md var when only md is provided', () => {
    expect(resolveResponsivePlacementVars({ default: 1, md: 2 }, 'cs')).toEqual({
      '--_md-cs': '2',
    })
  })

  it('sets only the lg var when only lg is provided', () => {
    expect(resolveResponsivePlacementVars({ default: 1, lg: 5 }, 're')).toEqual({
      '--_lg-re': '5',
    })
  })

  it('sets both md and lg vars when both are provided', () => {
    expect(resolveResponsivePlacementVars({ default: 1, md: 2, lg: 5 }, 'ce')).toEqual({
      '--_md-ce': '2',
      '--_lg-ce': '5',
    })
  })
})

describe('resolveBleedStyles', () => {
  it('returns no styles when bleed is not set', () => {
    expect(resolveBleedStyles({})).toEqual({})
  })

  it('handles "both" bleed direction', () => {
    expect(resolveBleedStyles({ bleed: 'both', rowStart: 1, rowSpan: 3 })).toEqual({
      gridColumn: '1 / -1',
      marginInline: 'calc(-1 * var(--grid-padding))',
      gridRow: '1 / span 3',
    })
  })

  it('handles "left" bleed direction with a numeric colSpan', () => {
    expect(
      resolveBleedStyles({ bleed: 'left', colSpan: 4, rowStart: 2, rowSpan: 1 })
    ).toEqual({
      gridColumn: '1 / span 4',
      marginInlineStart: 'calc(-1 * var(--grid-padding))',
      gridRow: '2 / span 1',
    })
  })

  it('handles "left" bleed direction without a numeric colSpan', () => {
    expect(
      resolveBleedStyles({ bleed: 'left', colSpan: 'full', rowSpan: 1 })
    ).toEqual({
      gridColumn: '1 / -1',
      marginInlineStart: 'calc(-1 * var(--grid-padding))',
      gridRow: 'auto / span 1',
    })
  })

  it('handles "right" bleed direction', () => {
    expect(
      resolveBleedStyles({ bleed: 'right', colStart: 3, rowSpan: 2 })
    ).toEqual({
      gridColumn: '3 / -1',
      marginInlineEnd: 'calc(-1 * var(--grid-padding))',
      gridRow: 'auto / span 2',
    })
  })

  it('defaults gridRow parts to "auto" when start/span are missing', () => {
    expect(resolveBleedStyles({ bleed: 'right' })).toEqual({
      gridColumn: 'auto / -1',
      marginInlineEnd: 'calc(-1 * var(--grid-padding))',
      gridRow: 'auto / span undefined',
    })
  })
})

describe('resolveAlignmentStyles', () => {
  it('returns no styles when neither align nor justify is set', () => {
    expect(resolveAlignmentStyles()).toEqual({})
  })

  it('defaults the missing axis to stretch', () => {
    expect(resolveAlignmentStyles('center')).toEqual({
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'center stretch',
    })
    expect(resolveAlignmentStyles(undefined, 'end')).toEqual({
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'stretch end',
    })
  })

  it('combines align and justify', () => {
    expect(resolveAlignmentStyles('start', 'end')).toEqual({
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'start end',
    })
  })
})

describe('resolveRhythmStyles', () => {
  it('returns no styles when density is undefined', () => {
    expect(resolveRhythmStyles()).toEqual({})
  })

  it.each([
    ['compact', '0.125rem'],
    ['normal', '0.25rem'],
    ['relaxed', '0.5rem'],
  ] as const)('maps %s density to the expected rhythm value', (density, value) => {
    expect(resolveRhythmStyles(density)).toEqual({ '--rhythm': value })
  })
})

describe('resolveLayerStyles', () => {
  it('returns no styles when neither z nor layer is set', () => {
    expect(resolveLayerStyles()).toEqual({})
  })

  it('prefers an explicit z over the layer lookup', () => {
    expect(resolveLayerStyles(99, 'back')).toEqual({ zIndex: '99' })
  })

  it('falls back to the layer z-index lookup', () => {
    expect(resolveLayerStyles(undefined, 'front')).toEqual({ zIndex: '20' })
  })

  it('treats z=0 as a defined value', () => {
    expect(resolveLayerStyles(0, 'top')).toEqual({ zIndex: '0' })
  })
})

describe('buildGridPlacementStyle', () => {
  it('applies defaults for an empty input', () => {
    expect(buildGridPlacementStyle({})).toEqual({
      gridColumn: '1 / -1',
      '--_rs': 'auto',
      '--_re': '1',
    })
  })

  it('returns early for a full colSpan and skips alignment/rhythm/layer/gap', () => {
    const style = buildGridPlacementStyle({
      colSpan: 'full',
      align: 'center',
      density: 'compact',
      z: 5,
      gap: '1rem',
    })

    expect(style).toEqual({
      gridColumn: '1 / -1',
      '--_rs': 'auto',
      '--_re': '1',
    })
    expect(style).not.toHaveProperty('zIndex')
    expect(style).not.toHaveProperty('--rhythm')
    expect(style).not.toHaveProperty('--grid-gap')
  })

  it('builds explicit column/row vars for a non-full colSpan and applies alignment/rhythm/layer/gap', () => {
    const style = buildGridPlacementStyle({
      colStart: 2,
      colSpan: 3,
      rowStart: 1,
      rowSpan: 2,
      align: 'center',
      justify: 'end',
      density: 'relaxed',
      z: 5,
      gap: '2rem',
    })

    expect(style).toEqual({
      '--_cs': '2',
      '--_ce': '3',
      '--_rs': '1',
      '--_re': '2',
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'center end',
      '--rhythm': '0.5rem',
      zIndex: '5',
      '--grid-gap': '2rem',
    })
  })

  it('includes responsive vars for responsive-value inputs on a non-full colSpan', () => {
    const style = buildGridPlacementStyle({
      colStart: { default: 1, md: 2 },
      colSpan: { default: 3, lg: 6 },
    })

    expect(style['--_md-cs']).toBe('2')
    expect(style['--_lg-ce']).toBe('6')
  })

  it('applies bleed styles and skips the column/row var block entirely', () => {
    const style = buildGridPlacementStyle({
      bleed: 'both',
      rowStart: 1,
      rowSpan: 3,
      align: 'start',
    })

    expect(style).toEqual({
      gridColumn: '1 / -1',
      marginInline: 'calc(-1 * var(--grid-padding))',
      gridRow: '1 / span 3',
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'start stretch',
    })
    expect(style).not.toHaveProperty('--_cs')
    expect(style).not.toHaveProperty('--_rs')
  })

  it('omits --grid-gap when gap is not provided', () => {
    const style = buildGridPlacementStyle({ colStart: 1, colSpan: 2 })
    expect(style).not.toHaveProperty('--grid-gap')
  })
})

describe('buildGridPlacementClasses', () => {
  it('returns the base classes when no aspect/container is set', () => {
    expect(buildGridPlacementClasses({})).toBe('gi-placed @container @container/item')
  })

  it('appends the aspect class when aspect is set', () => {
    expect(buildGridPlacementClasses({ aspect: '16/9' })).toBe(
      'gi-placed @container @container/item aspect-video'
    )
  })

  it('appends the container class when container is set', () => {
    expect(buildGridPlacementClasses({ container: 'wide' })).toBe(
      'gi-placed @container @container/item layout-container-wide'
    )
  })

  it('appends both aspect and container classes when both are set', () => {
    expect(buildGridPlacementClasses({ aspect: '1/1', container: 'fluid' })).toBe(
      'gi-placed @container @container/item aspect-square layout-container-fluid'
    )
  })
})
