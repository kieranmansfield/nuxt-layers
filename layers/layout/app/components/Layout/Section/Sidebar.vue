<script setup lang="ts">
/**
 * LayoutSectionSidebar — Sidebar Says layout
 *
 * Two-column layout where the sidebar takes a clamped width and main content
 * fills the rest. Uses `minmax(min, max) 1fr` (or reversed for right sidebar).
 *
 * @prop {string} sidebarMin - Minimum sidebar width (default: '150px')
 * @prop {string} sidebarMax - Maximum sidebar width (default: '25%')
 * @prop {boolean} reverse - Put sidebar on the right (default: false)
 * @prop {boolean} fullHeight - Force 100svh on the section (default: false)
 *
 * @slot sidebar - Sidebar content
 * @slot default - Main content (fills remaining space)
 *
 * @example
 * <LayoutSectionSidebar sidebar-max="20rem">
 *   <template #sidebar><nav>...</nav></template>
 *   <article>Main content</article>
 * </LayoutSectionSidebar>
 */

interface Props {
  sidebarMin?: string
  sidebarMax?: string
  reverse?: boolean
  fullHeight?: boolean
}

const { sidebarMin = '150px', sidebarMax = '25%', reverse = false, fullHeight = false } = defineProps<Props>()
</script>

<template>
  <LayoutSection :full-height>
    <LayoutGridItem>
      <div
        class="sidebar-inner"
        :class="{ 'sidebar-reverse': reverse }"
        :style="{ '--sidebar-min': sidebarMin, '--sidebar-max': sidebarMax }"
      >
        <div class="sidebar-aside">
          <slot name="sidebar" />
        </div>
        <div class="sidebar-main">
          <slot />
        </div>
      </div>
    </LayoutGridItem>
  </LayoutSection>
</template>

<style scoped>
.sidebar-inner {
  display: grid;
  grid-template-columns: minmax(var(--sidebar-min, 150px), var(--sidebar-max, 25%)) 1fr;
  gap: var(--grid-gap, clamp(0.75rem, 1.5vw, 1.5rem));
  width: 100%;
  height: 100%;
}

.sidebar-inner.sidebar-reverse {
  grid-template-columns: 1fr minmax(var(--sidebar-min, 150px), var(--sidebar-max, 25%));
}

.sidebar-inner.sidebar-reverse .sidebar-aside {
  order: 2;
}

.sidebar-inner.sidebar-reverse .sidebar-main {
  order: 1;
}
</style>
