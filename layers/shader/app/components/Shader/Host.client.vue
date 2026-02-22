<script setup lang="ts">
// @ts-nocheck - TSL types
import { DoubleSide } from 'three'
import { mix as tslMix, uniform } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import type { Component } from 'vue'
import { tweenUniform } from '#layers/shader/app/utils/tsl/tween'

const props = withDefaults(
  defineProps<{
    /** The active preset component */
    preset?: Component | null
    /** Crossfade duration in seconds */
    transitionDuration?: number
    /** Props forwarded to the active preset component */
    presetProps?: Record<string, any>
    /** ShaderBackground props */
    clearColor?: string
    toneMapping?: 'aces' | 'reinhard' | 'cineon' | 'linear'
    fixed?: boolean
    zIndex?: number
    pointerEvents?: 'none' | 'auto'
  }>(),
  {
    preset: null,
    transitionDuration: 1.0,
    presetProps: () => ({}),
    clearColor: '#000000',
    toneMapping: 'aces',
    fixed: true,
    zIndex: -1,
    pointerEvents: 'none',
  }
)

const emit = defineEmits<{
  transitionStart: []
  transitionEnd: []
}>()

// Transition state
const transitionProgress = uniform(0)
const isTransitioning = ref(false)

// Current and next preset tracking
const currentPreset = shallowRef<Component | null>(props.preset)
const nextPreset = shallowRef<Component | null>(null)

// Material created once, updated via colorNode
const material = new MeshBasicNodeMaterial()
material.side = DoubleSide

// Current and next graph nodes (set by preset via @node event)
let currentNode: any = null
let nextNode: any = null

function setCurrentNode(node: any) {
  currentNode = node
  updateMaterialNode()
}

function setNextNode(node: any) {
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

// Watch preset changes for crossfade
watch(
  () => props.preset,
  async (newPreset, oldPreset) => {
    if (!newPreset || newPreset === oldPreset) return

    if (!currentPreset.value) {
      // First preset — no transition
      currentPreset.value = newPreset
      return
    }

    // Start crossfade
    isTransitioning.value = true
    nextPreset.value = newPreset
    transitionProgress.value = 0
    emit('transitionStart')

    const handle = tweenUniform(
      transitionProgress,
      0,
      1,
      props.transitionDuration,
      (t) => t * t * (3 - 2 * t) // smoothstep
    )

    await handle.promise

    // Swap: next becomes current
    currentPreset.value = newPreset
    currentNode = nextNode
    nextPreset.value = null
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
  <ShaderBackground
    :material="material"
    :clear-color="clearColor"
    :tone-mapping="toneMapping"
    :fixed="fixed"
    :z-index="zIndex"
    :pointer-events="pointerEvents"
  />

  <!-- Render current preset (invisible — just registers its TSL node) -->
  <component
    :is="currentPreset"
    v-if="currentPreset"
    :key="'current'"
    v-bind="presetProps"
    @node="setCurrentNode"
  />

  <!-- Render next preset during crossfade -->
  <component
    :is="nextPreset"
    v-if="nextPreset && isTransitioning"
    :key="'next'"
    v-bind="presetProps"
    @node="setNextNode"
  />
</template>
