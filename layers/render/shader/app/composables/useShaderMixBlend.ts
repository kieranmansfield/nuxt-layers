import { Color } from 'three'
import { mix, uniform, vec4 } from 'three/tsl'

import type { TSLNode } from '../types/tsl'

export function useShaderMixBlend(
  blendFn: (base: TSLNode, blend: TSLNode) => TSLNode,
  ...args: [colorGetter: () => string, opacityGetter: () => number, order?: number]
) {
  const [colorGetter, opacityGetter, order = 0] = args
  const colorNode = uniform(new Color(colorGetter()))
  const opacityNode = uniform(opacityGetter())

  watch(colorGetter, (v) => {
    colorNode.value.set(v)
  })
  watch(opacityGetter, (v) => {
    opacityNode.value = v
  })

  useShaderStage(
    (prev) =>
      vec4(mix(prev.xyz, blendFn(prev.xyz, colorNode as unknown as TSLNode), opacityNode), prev.w),
    order
  )
}
