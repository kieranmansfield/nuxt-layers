<script setup lang="ts">
  /**
   * LayoutMain — grid root container applying the `grid-root` utility.
   *
   * Use this component when you need an explicit wrapper element that owns the
   * Swiss Grid stacking context. The default layout can use it in place of a
   * raw `<main class="grid-root">`.
   *
   * When `mode` is `'disabled'`, falls back to a plain semantic `<main>` so the
   * page renders correctly without grid dependencies.
   *
   * @prop {string} as — element to render (default: 'main')
   *
   * @example
   * <LayoutMain>
   *   <LayoutSection>…</LayoutSection>
   * </LayoutMain>
   */

  interface Props {
    as?: string
  }

  const { as = 'main' } = defineProps<Props>()

  const { mode } = useGridConfig()
</script>

<template>
  <component
    :is="as"
    :class="mode !== 'disabled' ? 'grid-root' : undefined"
    :style="
      mode !== 'disabled'
        ? { paddingInline: 'var(--grid-padding, clamp(1rem, 2.5vw, 2rem))' }
        : undefined
    "
  >
    <slot />
  </component>
</template>
