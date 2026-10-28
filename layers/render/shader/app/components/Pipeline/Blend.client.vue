<script setup lang="ts">
  import {
    blendColorBurn,
    blendColorDodge,
    blendDarken,
    blendDifference,
    blendExclusion,
    blendHardLight,
    blendLighten,
    blendMultiply,
    blendOverlay,
    blendScreen,
    blendSoftLight,
  } from '../../shaders/common/blend'

  /**
   * Blends a solid colour over the pipeline with one of the standard blend modes (v7 merged
   * the eleven per-mode blend nodes). `mode` is read once, when the node graph is built; give
   * the node a `:key` to switch modes at runtime. colour and opacity update live.
   */
  type BlendMode =
    | 'color-burn'
    | 'color-dodge'
    | 'darken'
    | 'difference'
    | 'exclusion'
    | 'hard-light'
    | 'lighten'
    | 'multiply'
    | 'overlay'
    | 'screen'
    | 'soft-light'

  const {
    mode,
    color = '#808080',
    opacity = 1,
    order = 0,
  } = defineProps<{
    mode: BlendMode
    color?: string
    opacity?: number
    order?: number
  }>()

  const MODES = {
    'color-burn': blendColorBurn,
    'color-dodge': blendColorDodge,
    darken: blendDarken,
    difference: blendDifference,
    exclusion: blendExclusion,
    'hard-light': blendHardLight,
    lighten: blendLighten,
    multiply: blendMultiply,
    overlay: blendOverlay,
    screen: blendScreen,
    'soft-light': blendSoftLight,
  } satisfies Record<BlendMode, unknown>

  useShaderMixBlend(
    MODES[mode],
    () => color,
    () => opacity,
    order
  )
</script>
