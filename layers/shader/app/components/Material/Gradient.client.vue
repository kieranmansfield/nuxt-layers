<script setup lang="ts">
  import { Color, DoubleSide } from 'three'
  import { mix, sin, time as tslTime, uniform, uv, vec3 } from 'three/tsl'
  import { MeshBasicNodeMaterial } from 'three/webgpu'

  import type { TSLNode } from '../../types'
  import { watchUniformProp } from '#layers/shader/app/composables/useUniformWatchers'

  const {
    colors = ['#4f46e5', '#7c3aed', '#ec4899'],
    angle = 0,
    type = 'linear',
    animated = false,
    speed = 1,
    transparent = false,
    mouseX = 0.5,
    mouseY = 0.5,
    mouseInteraction = false,
    mouseStrength = 0.3,
  } = defineProps<{
    colors?: string[]
    angle?: number
    type?: 'linear' | 'radial'
    animated?: boolean
    speed?: number
    transparent?: boolean
    /** Mouse X position (0-1) for interaction */
    mouseX?: number
    /** Mouse Y position (0-1) for interaction */
    mouseY?: number
    /** Enable mouse interaction */
    mouseInteraction?: boolean
    /** Mouse interaction strength */
    mouseStrength?: number
  }>()

  // Create reactive uniforms for all animatable properties
  const angleUniform = uniform(angle)
  const speedUniform = uniform(speed)
  const mouseXUniform = uniform(mouseX)
  const mouseYUniform = uniform(mouseY)
  const mouseStrengthUniform = uniform(mouseStrength)

  // Create color uniforms (up to 5 colors supported) - stored as typed array
  const colorUniforms: TSLNode[] = [
    uniform(new Color(colors[0] || '#4f46e5')),
    uniform(new Color(colors[1] || '#7c3aed')),
    uniform(new Color(colors[2] || '#ec4899')),
    uniform(new Color(colors[3] || '#ec4899')),
    uniform(new Color(colors[4] || '#ec4899')),
  ]

  watchUniformProp(() => angle, angleUniform)
  watchUniformProp(() => speed, speedUniform)
  watchUniformProp(() => mouseX, mouseXUniform)
  watchUniformProp(() => mouseY, mouseYUniform)
  watchUniformProp(() => mouseStrength, mouseStrengthUniform)

  watch(
    () => colors,
    (colors) => {
      colors.forEach((c, i) => {
        if (i < colorUniforms.length) {
          colorUniforms[i]!.value = new Color(c)
        }
      })
    },
    { deep: true }
  )

  // fallow-ignore-next-line complexity
  function resolveGradientT() {
    let t: TSLNode = uv().y

    if (type === 'linear') {
      const rad = angleUniform.mul(Math.PI / 180)
      const cosVal = rad.cos()
      const sinVal = rad.sin()
      t = uv().x.mul(sinVal).add(uv().y.mul(cosVal))
    }

    if (type === 'radial') {
      let center = uv().sub(0.5)
      if (mouseInteraction) {
        const mouseOffset = vec3(
          mouseXUniform.sub(0.5).mul(mouseStrengthUniform),
          mouseYUniform.sub(0.5).mul(mouseStrengthUniform),
          0
        )
        center = center.sub(mouseOffset.xy)
      }
      t = center.length().mul(2)
    }

    if (type === 'linear' && mouseInteraction) {
      t = t.add(mouseXUniform.sub(0.5).mul(mouseStrengthUniform))
    }

    if (animated) {
      t = t.add(sin(tslTime.mul(speedUniform)).mul(0.2))
    }

    return t
  }

  // fallow-ignore-next-line complexity
  function buildGradientColorNode(t: TSLNode) {
    const colorCount = colors.length
    const c0 = colorUniforms[0]
    const c1 = colorUniforms[1]
    const c2 = colorUniforms[2]
    const c3 = colorUniforms[3]
    const c4 = colorUniforms[4]

    let colorNode: TSLNode = vec3(c0)

    if (colorCount === 2) {
      return mix(vec3(c0), vec3(c1), t)
    }

    if (colorCount >= 3) {
      const uniforms = [c0, c1, c2, c3, c4]
      const segments = colorCount - 1

      for (let i = 0; i < segments && i < 4; i++) {
        const localT = t.mul(segments).sub(i).clamp(0, 1)
        const currColor = uniforms[i]
        const nextColor = uniforms[i + 1]

        if (i === 0) {
          colorNode = mix(vec3(currColor), vec3(nextColor), localT)
        } else {
          const prevT = t
            .mul(segments)
            .sub(i - 1)
            .clamp(0, 1)
          colorNode = mix(colorNode, mix(vec3(currColor), vec3(nextColor), localT), prevT.step(1))
        }
      }
    }

    return colorNode
  }

  const material = computed(() => {
    const mat = new MeshBasicNodeMaterial()

    const colorNode = buildGradientColorNode(resolveGradientT())
    mat.colorNode = colorNode
    mat.transparent = transparent
    mat.side = DoubleSide

    return mat
  })

  defineExpose({ material })
</script>

<template>
  <primitive :object="material" attach="material" />
</template>
