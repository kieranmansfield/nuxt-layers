<script setup lang="ts">
  // Client-only host for the `shaders` library. Import effect children directly from
  // 'shaders/vue' (tree-shakeable) and pass them in the default slot:
  //   <FxShader><LinearGradient color-a="#0f172a" color-b="#7c3aed" /></FxShader>
  // The `fallback` slot renders when WebGPU is unavailable.
  import { Shader } from 'shaders/vue'

  defineOptions({ inheritAttrs: false })

  // Left without prop defaults on purpose: absent props fall through to app.config.effects.
  const { colorSpace = undefined, toneMapping = undefined } = defineProps<{
    colorSpace?: 'srgb' | 'p3-linear'
    toneMapping?: 'linear' | 'reinhard' | 'cineon' | 'aces' | 'agx' | 'neutral' | 'hable' | 'unreal'
  }>()

  const emit = defineEmits<{
    ready: []
    unavailable: []
  }>()

  const { effects } = useAppConfig()
  const { supported } = useEffectsSupport()
  const failed = ref(false)

  // Telemetry is app-wide opt-in only; there is deliberately no per-instance switch to forget.
  const telemetryOff = computed(() => !effects?.telemetry)

  function onUnavailable() {
    failed.value = true
    emit('unavailable')
  }
</script>

<template>
  <Shader
    v-if="supported && !failed"
    v-bind="$attrs"
    :color-space="colorSpace ?? effects?.colorSpace"
    :tone-mapping="toneMapping ?? effects?.toneMapping"
    :disable-telemetry="telemetryOff"
    @ready="emit('ready')"
    @unavailable="onUnavailable"
  >
    <slot />
  </Shader>
  <slot v-else-if="supported || failed" name="fallback" />
</template>
