import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// core's --z-* CSS tokens mirror layout's app.config stacking scale for layers that can't call
// useZIndex(). Both are hand-written, so this keeps the shared steps from drifting.
const root = resolve(import.meta.dirname, '../..')
const css = readFileSync(resolve(root, 'layers/core/app/assets/css/tokens/z-index.css'), 'utf8')
const config = readFileSync(resolve(root, 'layers/structure/layout/app/app.config.ts'), 'utf8')

const cssScale = Object.fromEntries(
  [...css.matchAll(/--z-([a-z]+):\s*(\d+)/g)].map((m) => [m[1]!, Number(m[2])])
)
const layersBlock = config.match(/layers:\s*\{([^}]*)\}/)![1]!
const configScale = Object.fromEntries(
  [...layersBlock.matchAll(/(\w+):\s*(\d+)/g)].map((m) => [m[1]!, Number(m[2])])
)

describe('z-index scale', () => {
  it.each(['header', 'dropdown', 'overlay', 'modal', 'toast'])('--z-%s matches layout', (step) => {
    expect(cssScale[step]).toBe(configScale[step])
  })

  it('puts cursor and debug above every layout layer', () => {
    const top = Math.max(...Object.values(configScale))
    expect(cssScale.cursor).toBeGreaterThan(top)
    expect(cssScale.debug).toBeGreaterThan(cssScale.cursor!)
  })
})
