// @vitest-environment happy-dom
import { gsap } from 'gsap'
import { describe, expect, it } from 'vite-plus/test'

import { loadGsapPlugins } from './gsapPlugins'

describe('loadGsapPlugins', () => {
  it('returns every plugin in call order', async () => {
    const [text, physics] = await loadGsapPlugins('TextPlugin', 'Physics2DPlugin')
    expect(text.name).toBe('text')
    expect(physics.name).toBe('physics2D')
  })

  it('registers plugins so tweens can use them', async () => {
    await loadGsapPlugins('Physics2DPlugin')
    const target = { x: 0, y: 0 }
    gsap.to(target, { physics2D: { velocity: 100, angle: 0 }, duration: 1 }).progress(1)
    expect(target.x).toBeCloseTo(100)
  })

  it('loads each of the eight plugins', async () => {
    const plugins = await loadGsapPlugins(
      'Draggable',
      'InertiaPlugin',
      'DrawSVGPlugin',
      'MorphSVGPlugin',
      'MotionPathPlugin',
      'ScrambleTextPlugin',
      'TextPlugin',
      'Physics2DPlugin'
    )
    expect(plugins.every(Boolean)).toBe(true)
  })
})
