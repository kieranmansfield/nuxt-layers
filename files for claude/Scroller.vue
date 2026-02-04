<script lang="ts" setup>
const lenisRef = ref()
const options = ref({
  smooth: true,
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
  autoRaf: true,
  lerp: 0.1,
  duration: 1.5,
  anchors: true,
})

//  autoRaf: false

// const scrollCallback = (lenis) => {
//   console.log(lenis)
// }

// useLenis(scrollCallback, 0)

// console.log(useLenis().value)
</script>

<template>
  <VueLenis ref="lenisRef" :options root>
    <slot />
  </VueLenis>
</template>
