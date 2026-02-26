<script setup lang="ts">
/**
 * LayoutMain — grid root container applying the `mastmain` utility.
 *
 * Use this component when you need an explicit wrapper element that owns the
 * Swiss Grid stacking context. The default layout can use it in place of a
 * raw `<main class="mastmain">`.
 *
 * When `mode` is `'disabled'`, falls back to a plain semantic `<main>` so the
 * page renders correctly without grid dependencies.
 *
 * @prop {string} tag — HTML element to render (default: 'main')
 *
 * @example
 * <LayoutMain>
 *   <LayoutSection>…</LayoutSection>
 * </LayoutMain>
 */

interface Props {
  tag?: string
}

const { tag = 'main' } = defineProps<Props>()

const { mode } = useGridConfig()
</script>

<template>
  <component
    :is="tag"
    :class="mode !== 'disabled' ? 'mastmain' : undefined"
  >
    <slot />
  </component>
</template>
