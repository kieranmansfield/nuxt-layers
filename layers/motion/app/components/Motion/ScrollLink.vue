<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /**
     * Target to scroll to (selector, element, or pixel position)
     */
    to: string | number
    /**
     * Scroll duration in seconds
     */
    duration?: number
    /**
     * Offset from target (negative = above target)
     */
    offset?: number
    /**
     * Tag to render as
     */
    as?: string
  }>(),
  {
    duration: 1.5,
    offset: 0,
    as: 'button',
  }
)

const emit = defineEmits<{
  scrollStart: []
  scrollComplete: []
}>()

const { scrollTo } = useSmoothScroll()

function handleClick() {
  emit('scrollStart')
  scrollTo(props.to, {
    duration: props.duration,
    offset: props.offset,
    onComplete: () => emit('scrollComplete'),
  })
}
</script>

<template>
  <component :is="as" class="motion-scroll-link" @click="handleClick">
    <slot />
  </component>
</template>
