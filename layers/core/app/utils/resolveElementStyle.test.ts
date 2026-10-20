import { describe, expect, it } from 'vite-plus/test'

import { resolveElementStyle } from './resolveElementStyle'

describe('resolveElementStyle display mode', () => {
  it('returns no display when no mode prop is set', () => {
    expect(resolveElementStyle({}).display).toBeUndefined()
  })

  it.each([
    ['block', 'block'],
    ['flex', 'flex'],
    ['grid', 'grid'],
    ['hidden', 'none'],
  ] as const)('resolves %s to display: %s', (prop, display) => {
    expect(resolveElementStyle({ [prop]: true }).display).toBe(display)
  })

  it('prioritizes hidden > grid > flex > block', () => {
    expect(resolveElementStyle({ hidden: true, grid: true, flex: true, block: true }).display).toBe(
      'none'
    )
    expect(resolveElementStyle({ grid: true, flex: true, block: true }).display).toBe('grid')
    expect(resolveElementStyle({ flex: true, block: true }).display).toBe('flex')
  })
})

describe('resolveElementStyle grid container axis', () => {
  it('returns no grid-template properties when grid is not set', () => {
    const style = resolveElementStyle({ cols: 12 })
    expect(style.gridTemplateColumns).toBeUndefined()
    expect(style.gridTemplateRows).toBeUndefined()
  })

  it('converts numeric cols/rows to repeat() tracks when grid is set', () => {
    const style = resolveElementStyle({ grid: true, cols: 12, rows: 4 })
    expect(style.gridTemplateColumns).toBe('repeat(12, 1fr)')
    expect(style.gridTemplateRows).toBe('repeat(4, 1fr)')
  })

  it('passes a string track through unchanged', () => {
    expect(resolveElementStyle({ grid: true, cols: '1fr 2fr 1fr' }).gridTemplateColumns).toBe(
      '1fr 2fr 1fr'
    )
  })
})

describe('resolveElementStyle prop mapping', () => {
  it('maps sizing, surface and interaction props to their CSS properties 1:1', () => {
    expect(
      resolveElementStyle({
        w: '10px',
        h: '20px',
        minW: '1px',
        maxW: '2px',
        minH: '3px',
        maxH: '4px',
        aspect: '16 / 9',
        bg: 'red',
        color: 'blue',
        border: '1px solid',
        radius: '4px',
        shadow: '0 0 1px black',
        cursor: 'pointer',
        select: 'none',
        pointer: 'none',
      })
    ).toMatchObject({
      width: '10px',
      height: '20px',
      minWidth: '1px',
      maxWidth: '2px',
      minHeight: '3px',
      maxHeight: '4px',
      aspectRatio: '16 / 9',
      background: 'red',
      color: 'blue',
      border: '1px solid',
      borderRadius: '4px',
      boxShadow: '0 0 1px black',
      cursor: 'pointer',
      userSelect: 'none',
      pointerEvents: 'none',
    })
  })

  it('merges layout attrs (gap/align/padding) into the same object', () => {
    expect(resolveElementStyle({ flex: true, gap: 'md', align: 'center', p: 'sm' })).toMatchObject({
      display: 'flex',
      gap: 'var(--space-md)',
      alignItems: 'center',
      padding: 'var(--space-sm)',
    })
  })

  it('leaves every property undefined when no props are set', () => {
    expect(Object.values(resolveElementStyle({})).every((v) => v === undefined)).toBe(true)
  })
})
