<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
const {
  src,
  alt = '',
  width,
  height,
  caption,
} = defineProps<{
  src: string
  alt?: string
  width?: number
  height?: number
  caption?: string
}>()
</script>

<template>
  <div>
    <!-- Full-viewport ambient glow teleported to body to escape stacking contexts -->
    <ClientOnly>
      <Teleport to="body">
        <div
          class="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <img
            :src="src"
            alt=""
            class="absolute inset-0 w-full h-full object-cover blur-[100px] opacity-30 saturate-150 scale-125"
          />
          <!-- Gradient fade so it blends into the page bg -->
          <div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-default" />
        </div>
      </Teleport>
    </ClientOnly>

    <!-- Main image in normal flow -->
    <figure class="my-6">
      <img
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        class="w-full rounded-lg"
      />
      <figcaption v-if="caption" class="mt-3 text-center text-sm text-muted italic">
        {{ caption }}
      </figcaption>
    </figure>
  </div>
</template>
