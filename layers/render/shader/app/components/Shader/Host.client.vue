<script setup lang="ts">
  import type { Component } from 'vue'
  import type { TSLNode } from '#layers/shader/app/types/tsl'
  import { tweenUniform } from '#layers/shader/app/utils/tsl/tween'
  import { DoubleSide } from 'three'
  import { mix as tslMix, uniform } from 'three/tsl'
  import { MeshBasicNodeMaterial } from 'three/webgpu'

  const {
    preset = null,
    variant = undefined,
    transitionDuration = 1.0,
    presetProps = {} as Record<string, unknown>,
    clearColor = '#000000',
    toneMapping = 'aces',
    fixed = true,
    zIndex = -1,
    pointerEvents = 'none',
  } = defineProps<{
    /** The active preset component */
    preset?: Component | null
    /**
     * The preset's look, for presets that take one (PresetAmbient, PresetTheme). Changing it
     * crossfades exactly like changing `preset`.
     */
    variant?: string
    /** Crossfade duration in seconds */
    transitionDuration?: number
    /** Props forwarded to the active preset component */
    presetProps?: Record<string, unknown>
    /** ShaderBackground props */
    clearColor?: string
    toneMapping?: 'aces' | 'reinhard' | 'cineon' | 'linear'
    fixed?: boolean
    zIndex?: number
    pointerEvents?: 'none' | 'auto'
  }>()

  const emit = defineEmits<{
    transitionStart: []
    transitionEnd: []
  }>()

  // Transition state
  const transitionProgress = uniform(0)
  const isTransitioning = ref(false)

  // Current and next preset tracking — a component plus the variant it renders with
  const currentPreset = shallowRef<Component | null>(preset)
  const nextPreset = shallowRef<Component | null>(null)
  const currentVariant = ref(variant)
  const nextVariant = ref<string | undefined>(undefined)

  function setCurrentPreset(preset: Component | null, presetVariant: string | undefined) {
    currentPreset.value = preset
    currentVariant.value = presetVariant
  }

  // Material created once, updated via colorNode
  const material = new MeshBasicNodeMaterial()
  material.side = DoubleSide

  // Current and next graph nodes (set by preset via @node event)
  let currentNode: TSLNode | null = null
  let nextNode: TSLNode | null = null

  function setCurrentNode(node: TSLNode) {
    currentNode = node
    updateMaterialNode()
  }

  function setNextNode(node: TSLNode) {
    nextNode = node
    updateMaterialNode()
  }

  function updateMaterialNode() {
    if (isTransitioning.value && currentNode && nextNode) {
      material.colorNode = tslMix(currentNode, nextNode, transitionProgress)
      material.needsUpdate = true
    } else if (currentNode) {
      material.colorNode = currentNode
      material.needsUpdate = true
    }
  }

  // Watch preset (or variant) changes for crossfade
  watch(
    () => [preset, variant] as const,
    async ([newPreset, newVariant], [oldPreset, oldVariant]) => {
      if (!newPreset || (newPreset === oldPreset && newVariant === oldVariant)) return

      if (!currentPreset.value) {
        // First preset — no transition (setter call sidesteps the null-narrowing
        // TS applies to `currentPreset.value` inside this branch)
        setCurrentPreset(newPreset, newVariant)
        return
      }

      // Start crossfade
      isTransitioning.value = true
      nextPreset.value = newPreset
      nextVariant.value = newVariant
      transitionProgress.value = 0
      emit('transitionStart')

      const handle = tweenUniform(
        transitionProgress,
        0,
        1,
        transitionDuration,
        (t) => t * t * (3 - 2 * t) // smoothstep
      )

      await handle.promise

      // Swap: next becomes current
      setCurrentPreset(newPreset, newVariant)
      currentNode = nextNode
      nextPreset.value = null
      nextVariant.value = undefined
      nextNode = null
      isTransitioning.value = false
      transitionProgress.value = 0
      updateMaterialNode()
      emit('transitionEnd')
    }
  )

  onUnmounted(() => {
    material.dispose()
  })
</script>

<template>
  <ShaderBackground :material :clear-color :tone-mapping :fixed :z-index :pointer-events />

  <!-- Render current preset (invisible — just registers its TSL node). Keyed by variant: a
       preset builds its graph once, so a new variant needs a fresh instance, the same way a
       new preset component got one. -->
  <component
    :is="currentPreset"
    v-if="currentPreset"
    :key="`current:${currentVariant ?? ''}`"
    v-bind="{ ...presetProps, ...(currentVariant !== undefined && { variant: currentVariant }) }"
    @node="setCurrentNode"
  />

  <!-- Render next preset during crossfade -->
  <component
    :is="nextPreset"
    v-if="nextPreset && isTransitioning"
    key="next"
    v-bind="{ ...presetProps, ...(nextVariant !== undefined && { variant: nextVariant }) }"
    @node="setNextNode"
  />
</template>
