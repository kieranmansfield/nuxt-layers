import { describe, expect, it } from 'vitest'

import type { GridPreset, TrackConfig } from '../types/tracks'
import { resolve, toColumnsCss } from './useGridTracks'

describe('toColumnsCss', () => {
  it('renders equal segments with no line names', () => {
    const config: TrackConfig = { columns: [{ size: 1 }, { size: 1 }, { size: 1 }] }
    expect(toColumnsCss(config)).toBe(
      'minmax(var(--measure-min), 1fr) minmax(var(--measure-min), 1fr) ' +
        'minmax(var(--measure-min), 1fr)'
    )
  })

  it('renders mixed sizes (8 equal + double + triple)', () => {
    const config: TrackConfig = {
      columns: [
        { size: 1 },
        { size: 1 },
        { size: 1 },
        { size: 1 },
        { size: 1 },
        { size: 1 },
        { size: 1 },
        { size: 2 },
        { size: 3 },
      ],
    }
    const css = toColumnsCss(config)
    expect(css.split(' ').filter((s) => s.startsWith('minmax'))).toHaveLength(9)
    expect(css).toContain('minmax(var(--measure-min), 2fr)')
    expect(css).toContain('minmax(var(--measure-min), 3fr)')
  })

  it('brackets a leading lineStart and trailing lineEnd', () => {
    const config: TrackConfig = {
      columns: [{ size: 1, lineStart: 'a-start', lineEnd: 'a-end' }],
    }
    expect(toColumnsCss(config)).toBe('[a-start] minmax(var(--measure-min), 1fr) [a-end]')
  })

  it('merges an adjacent lineEnd and lineStart into one bracket', () => {
    const config: TrackConfig = {
      columns: [
        { size: 2, lineStart: 'feature-start', lineEnd: 'feature-end' },
        { size: 1, lineStart: 'aside-start', lineEnd: 'aside-end' },
      ],
    }
    expect(toColumnsCss(config)).toBe(
      '[feature-start] minmax(var(--measure-min), 2fr) ' +
        '[feature-end aside-start] minmax(var(--measure-min), 1fr) [aside-end]'
    )
  })

  it('supports a segment with only lineStart set', () => {
    const config: TrackConfig = {
      columns: [{ size: 1, lineStart: 'only-start' }, { size: 1 }],
    }
    expect(toColumnsCss(config)).toBe(
      '[only-start] minmax(var(--measure-min), 1fr) minmax(var(--measure-min), 1fr)'
    )
  })

  it('accepts an array of line names', () => {
    const config: TrackConfig = {
      columns: [{ size: 1, lineStart: ['a', 'b'] }],
    }
    expect(toColumnsCss(config)).toBe('[a b] minmax(var(--measure-min), 1fr)')
  })

  it('uses minTrackWidth override instead of the --measure-min default', () => {
    const config: TrackConfig = { columns: [{ size: 1 }], minTrackWidth: '20rem' }
    expect(toColumnsCss(config)).toBe('minmax(20rem, 1fr)')
  })
})

describe('resolve', () => {
  const presets: Record<string, GridPreset> = {
    swiss: { name: 'swiss', columns: [{ size: 1 }] },
  }

  it('looks up a named preset from the registry', () => {
    expect(resolve('swiss', presets)).toBe(presets.swiss)
  })

  it('throws for an unknown preset name', () => {
    expect(() => resolve('nope', presets)).toThrow('Unknown grid preset: "nope"')
  })

  it('passes a TrackConfig object through unchanged', () => {
    const custom: TrackConfig = { columns: [{ size: 1 }, { size: 2 }] }
    expect(resolve(custom, presets)).toBe(custom)
  })
})
