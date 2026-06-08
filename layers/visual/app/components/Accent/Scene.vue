<!-- eslint-disable vue/require-default-prop -->
<!-- eslint-disable vue/define-props-destructuring -->
<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
  // @ts-nocheck
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
      <AccentBlob
        v-for="(blob, i) in resolvedBlobs"
        :key="i"
        :x="blob.x"
        :y="blob.y"
        v-bind="{
          ...(blob.size !== undefined && { size: blob.size }),
          ...(blob.blur !== undefined && { blur: blob.blur }),
          ...(blob.opacity !== undefined && { opacity: blob.opacity }),
          ...(blob.color !== undefined && { color: blob.color }),
          ...(blob.shade !== undefined && { shade: blob.shade }),
          ...(blob.customColor !== undefined && { customColor: blob.customColor }),
        }"
      />
    </div>
    <div class="relative z-10">
      <slot />
    </div>
  </component>
</template>
