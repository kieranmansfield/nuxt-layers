<script setup lang="ts">
import type { AccentSceneConfig, BlobConfig } from '../../types/accent'

const props = withDefaults(
  defineProps<{
    preset?: string
    blobs?: BlobConfig[]
    tag?: string
  }>(),
  {
    tag: 'div',
  }
)

const appConfig = useAppConfig()

const resolvedBlobs = computed((): BlobConfig[] => {
  if (props.blobs) return props.blobs
  if (props.preset) {
    const scenes = (appConfig.uiLayer as Record<string, unknown> | undefined)?.accentScenes as
      | Record<string, AccentSceneConfig>
      | undefined
    return scenes?.[props.preset]?.blobs ?? []
  }
  return []
})
</script>

<template>
  <component :is="tag" class="relative overflow-clip isolate">
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <AccentBlob v-for="(blob, i) in resolvedBlobs" :key="i" v-bind="blob" />
    </div>
    <div class="relative z-10">
      <slot />
    </div>
  </component>
</template>
