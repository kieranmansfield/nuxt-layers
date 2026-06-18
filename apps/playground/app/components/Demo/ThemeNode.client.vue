<script setup lang="ts">
  import {
    createThemeBubbleColorNode,
    createThemeGradientColorNode,
    createThemeLavaLampColorNode,
    createThemePlasmaColorNode,
    createThemeWaveColorNode,
    type AmbientUniforms,
    type ThemeColorUniforms,
  } from '#layers/shader/app/composables/useAmbientMaterials'
  import type { TSLNode } from '#layers/shader/app/types/tsl'
  import { useThemeNodeUniforms } from '~/composables/useThemeNodeUniforms'

  type ThemeId = 'mesh' | 'wave' | 'lavalamp' | 'bubble' | 'plasma'

  const props = defineProps<{
    themeId: ThemeId
    speed?: number
    intensity?: number
    color1?: string
    color2?: string
    color3?: string
    color4?: string
  }>()
  const { colorUniforms, ambientUniforms } = useThemeNodeUniforms(props)

  const creators: Record<ThemeId, (u: AmbientUniforms, c: ThemeColorUniforms) => TSLNode> = {
    mesh: createThemeGradientColorNode,
    wave: createThemeWaveColorNode,
    lavalamp: createThemeLavaLampColorNode,
    bubble: createThemeBubbleColorNode,
    plasma: createThemePlasmaColorNode,
  }

  const colorNode = (creators[props.themeId] ?? creators.mesh)(ambientUniforms, colorUniforms)

  useShaderStage(() => colorNode, 0)
</script>
