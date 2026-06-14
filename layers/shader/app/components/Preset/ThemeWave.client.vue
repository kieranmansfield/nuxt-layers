<script setup lang="ts">
  import {
    createAmbientUniforms,
    createThemeWaveColorNode,
  } from '#layers/shader/app/composables/useAmbientMaterials'

  const {
    speed = 1.0,
    intensity = 1.0,
    mouseInteraction = true,
    mouseStrength = 0.3,
    color1 = '#8b5cf6',
    color2 = '#6366f1',
    color3 = '#a78bfa',
    color4 = '#38bdf8',
  } = defineProps<{
    speed?: number
    intensity?: number
    mouseInteraction?: boolean
    mouseStrength?: number
    color1?: string
    color2?: string
    color3?: string
    color4?: string
  }>()

  const emit = defineEmits<{
    node: [colorNode: any]
  }>()

  const uniforms = createAmbientUniforms({
    speed: speed,
    intensity: intensity,
    mouseInteraction: mouseInteraction,
  })
  if (mouseInteraction) {
    uniforms.mouseStrength.value = mouseStrength
  }

  const c1 = useShaderColor(color1)
  const c2 = useShaderColor(color2)
  const c3 = useShaderColor(color3)
  const c4 = useShaderColor(color4)

  const colorNode = createThemeWaveColorNode(uniforms, {
    color1: c1.node,
    color2: c2.node,
    color3: c3.node,
    color4: c4.node,
  })

  watch(
    () => color1,
    (hex) => c1.tweenTo(hex, 0.8)
  )
  watch(
    () => color2,
    (hex) => c2.tweenTo(hex, 0.8)
  )
  watch(
    () => color3,
    (hex) => c3.tweenTo(hex, 0.8)
  )
  watch(
    () => color4,
    (hex) => c4.tweenTo(hex, 0.8)
  )

  try {
    const runtime = useShaderRuntimeContext()
    watch(
      () => [runtime.mouse.mouseX.value, runtime.mouse.mouseY.value],
      ([mx, my]) => {
        uniforms.mouseX.value = mx
        uniforms.mouseY.value = my
      },
      { immediate: true }
    )
  } catch {
    // No runtime context
  }

  watch(
    () => speed,
    (v) => {
      uniforms.speed.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      uniforms.intensity.value = v
    }
  )
  watch(
    () => mouseInteraction,
    (v) => {
      uniforms.mouseStrength.value = v ? mouseStrength : 0
    }
  )
  watch(
    () => mouseStrength,
    (v) => {
      if (mouseInteraction) uniforms.mouseStrength.value = v
    }
  )

  emit('node', colorNode)
  defineExpose({ uniforms, colorNode })
</script>

<template>
  <slot />
</template>
