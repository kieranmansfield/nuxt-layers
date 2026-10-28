import { describe, expect, it } from 'vite-plus/test'

import { STACK_FAN_TRACKS, fanPlacement, fanSpread, resolveStackItem } from './portfolioStack'

describe('resolveStackItem', () => {
  it('fills icon and colour for a known name, ignoring case, spaces and dots', () => {
    expect(resolveStackItem('Tailwind CSS')).toEqual({
      name: 'Tailwind CSS',
      icon: 'i-logos-tailwindcss-icon',
      color: '#06b6d4',
    })
    expect(resolveStackItem('Vue.js').icon).toBe('i-logos-vue')
  })

  it('keeps explicit icon, colour and url over the table', () => {
    expect(resolveStackItem({ name: 'Nuxt', icon: 'i-custom', url: 'https://nuxt.com' })).toEqual({
      name: 'Nuxt',
      icon: 'i-custom',
      color: '#00dc82',
      url: 'https://nuxt.com',
    })
  })

  it('falls back to a generic icon for unknown tech', () => {
    expect(resolveStackItem('Bespoke CMS')).toMatchObject({ icon: 'i-lucide-code-xml' })
  })
})

describe('fanPlacement', () => {
  const lg = STACK_FAN_TRACKS.lg
  const place = (index: number, total: number) => fanPlacement(index, total, lg)

  it('overlaps neighbours by stepping fewer columns than each card spans', () => {
    expect(place(1, 8).colStart - place(0, 8).colStart).toBe(lg.step)
    expect(place(0, 8).colSpan).toBeGreaterThan(lg.step)
  })

  it('wraps into rows that stay inside the grid', () => {
    for (let i = 0; i < 20; i++) {
      const { colStart, colSpan } = place(i, 20)
      expect(colStart).toBeGreaterThanOrEqual(1)
      expect(colStart + colSpan - 1).toBeLessThanOrEqual(lg.cols)
    }
    expect(place(19, 20).rowStart).toBe(3)
  })

  it('centres a short row and fans it symmetrically', () => {
    const [first, middle, last] = [place(0, 3), place(1, 3), place(2, 3)]
    const left = first.colStart - 1
    const right = lg.cols - (last.colStart + last.colSpan - 1)
    expect(Math.abs(left - right)).toBeLessThanOrEqual(1)
    expect(first.rotate).toBe(-last.rotate)
    expect(middle.rotate).toBe(0)
    expect(first.drop).toBe(last.drop)
    expect(first.drop).toBeGreaterThan(middle.drop)
  })

  it('leaves a lone card upright', () => {
    expect(place(0, 1)).toMatchObject({ rotate: 0, drop: 0 })
  })
})

describe('fanSpread', () => {
  const at = (index: number) => fanPlacement(index, 10, STACK_FAN_TRACKS.md)

  it('parts same-row neighbours away from the lifted card, less with distance', () => {
    expect(fanSpread(at(2), at(1))).toBeLessThan(0)
    expect(fanSpread(at(2), at(3))).toBeGreaterThan(0)
    expect(Math.abs(fanSpread(at(2), at(4)))).toBeLessThan(fanSpread(at(2), at(3)))
    expect(fanSpread(at(2), at(2))).toBe(0)
  })

  it('leaves other rows alone', () => {
    expect(fanSpread(at(0), at(9))).toBe(0)
  })
})
