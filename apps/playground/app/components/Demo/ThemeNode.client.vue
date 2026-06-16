<script setup lang="ts">
  import {
    createAmbientUniforms,
    createThemeBubbleColorNode,
    createThemeGradientColorNode,
    createThemeLavaLampColorNode,
    createThemePlasmaColorNode,
    createThemeWaveColorNode,
    type AmbientUniforms,
    type ThemeColorUniforms,
  } from '#layers/shader/app/composables/useAmbientMaterials'
  import type { TSLNode } from '#layers/shader/app/types/tsl'
  import { Color, Vector3 } from 'three'
  import { uniform } from 'three/tsl'

  type ThemeId = 'mesh' | 'wave' | 'lavalamp' | 'bubble' | 'plasma'

  const {
    themeId,
    speed = 1,
    intensity = 1,
    color1 = '#8b5cf6',
    color2 = '#6366f1',
    color3 = '#a78bfa',
    color4 = '#38bdf8',
  } = defineProps<{
    themeId: ThemeId
    speed?: number
    intensity?: number
    color1?: string
    color2?: string
    color3?: string
    color4?: string
  }>()

  function hex(h: string) {
    const c = new Color(h)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorUniforms = {
    color1: hex(color1),
    color2: hex(color2),
    color3: hex(color3),
    color4: hex(color4),
  }
  const ambientUniforms = createAmbientUniforms({
    speed: speed,
    intensity: intensity,
    mouseInteraction: false,
  })

  watch(
    () => color1,
    (v) => {
      const c = new Color(v)
      colorUniforms.color1.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => color2,
    (v) => {
      const c = new Color(v)
      colorUniforms.color2.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => color3,
    (v) => {
      const c = new Color(v)
      colorUniforms.color3.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => color4,
    (v) => {
      const c = new Color(v)
      colorUniforms.color4.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => speed,
    (v) => {
      ambientUniforms.speed.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      ambientUniforms.intensity.value = v
    }
  )

  const creators: Record<ThemeId, (u: AmbientUniforms, c: ThemeColorUniforms) => TSLNode> = {
    mesh: createThemeGradientColorNode,
    wave: createThemeWaveColorNode,
    lavalamp: createThemeLavaLampColorNode,
    bubble: createThemeBubbleColorNode,
    plasma: createThemePlasmaColorNode,
  }

  const colorNode = (creators[themeId] ?? creators.mesh)(ambientUniforms, colorUniforms)

  useShaderStage(() => colorNode, 0)
</script>
