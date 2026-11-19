<script setup lang="ts">
  const { feature, periods = 'future_1,current,past_1,past_2' } = defineProps<{
    feature: string
    periods?: string
  }>()

  const height = ref(400)

  const src = computed(
    () =>
      `https://caniuse.bitsofco.de/embed/index.html?feat=${encodeURIComponent(feature)}` +
      `&periods=${periods}&accessible-colours=false&image-base=none`
  )

  // The embed posts "ciu_embed:<feature>:<height>" once rendered.
  useEventListener('message', (e: MessageEvent) => {
    if (typeof e.data !== 'string') return
    const [tag, id, h] = e.data.split(':')
    if (tag === 'ciu_embed' && id === feature) height.value = Number(h) + 30
  })
</script>

<template>
  <iframe
    :src
    :height
    :title="`Can I use: ${feature}`"
    width="100%"
    loading="lazy"
    style="border: 0"
  />
</template>
