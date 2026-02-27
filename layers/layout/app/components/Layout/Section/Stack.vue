<script setup lang="ts">
/**
 * LayoutSectionStack — Pancake Stack layout
 *
 * Full-section wrapper using `auto 1fr auto` row template. Header and footer
 * take natural height; the default slot fills the remaining space.
 *
 * @prop {boolean} fullHeight - Force 100svh on the section (default: true)
 *
 * @slot header - Top-pinned content (auto height)
 * @slot default - Main content area (fills remaining space)
 * @slot footer - Bottom-pinned content (auto height)
 *
 * @example
 * <LayoutSectionStack>
 *   <template #header><nav>...</nav></template>
 *   <main>Content</main>
 *   <template #footer><footer>...</footer></template>
 * </LayoutSectionStack>
 */

interface Props {
  fullHeight?: boolean
}

const { fullHeight = true } = defineProps<Props>()
</script>

<template>
  <LayoutSection :full-height>
    <LayoutGridItem>
      <div class="stack-inner">
        <div v-if="$slots.header" class="stack-header">
          <slot name="header" />
        </div>
        <div class="stack-main">
          <slot />
        </div>
        <div v-if="$slots.footer" class="stack-footer">
          <slot name="footer" />
        </div>
      </div>
    </LayoutGridItem>
  </LayoutSection>
</template>

<style scoped>
.stack-inner {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  width: 100%;
}

.stack-header,
.stack-footer {
  /* auto — natural height */
}

.stack-main {
  /* 1fr — grows to fill remaining space */
}
</style>
