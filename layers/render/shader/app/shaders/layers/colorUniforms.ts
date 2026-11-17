import { Color } from 'three'

import type { FloatUniform, TSLNode } from '../types'

/**
 * Write each colour string into the matching uniform; extra colours (no uniform) are ignored.
 */
export function setColorUniforms(uniforms: TSLNode[], colors: string[] | undefined): void {
  colors?.forEach((c, i) => {
    if (uniforms[i]) {
      uniforms[i].value = new Color(c)
    }
  })
}

/**
 * Copy each listed numeric option into its float uniform, skipping options left undefined.
 */
export function setScalarUniforms<K extends string>(
  uniforms: Record<K, FloatUniform>,
  options: Partial<Record<K, number>>,
  keys: readonly K[]
): void {
  for (const key of keys) {
    const value = options[key]
    if (value !== undefined) uniforms[key].value = value
  }
}
