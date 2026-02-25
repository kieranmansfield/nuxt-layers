<script setup lang="ts">
/**
 * LayoutPage — canonical page wrapper for the Swiss Grid System.
 *
 * This is a fragment component (no wrapper element). The grid root is already
 * provided by MastMain at the layout level via <div class="mastmain">.
 * Adding another mastmain wrapper here would nest grids and misalign everything.
 *
 * Responsibilities:
 *   - SEO via useHead()
 *   - provides 'pageTitle' to child components
 *   - optional visible header (LayoutSection + LayoutPageHeader)
 *
 * LayoutGridDebug is owned by the default layout — do NOT add it here.
 *
 * @prop {string}  title       — Page title: sets <title> and optional visible heading
 * @prop {string}  description — Optional meta description for SEO
 * @prop {boolean} showHeader  — Render a LayoutPageHeader block (default: false)
 *
 * @example
 * <LayoutPage title="Home">
 *   <LayoutSectionHero>
 *     <h1>Welcome</h1>
 *   </LayoutSectionHero>
 * </LayoutPage>
 *
 * @example
 * <LayoutPage title="About" description="Learn more." :show-header="true">
 *   <LayoutSection>
 *     <LayoutGridItem preset="centered">
 *       <p>Content here.</p>
 *     </LayoutGridItem>
 *   </LayoutSection>
 * </LayoutPage>
 */

interface Props {
  title: string
  description?: string
  showHeader?: boolean
}

const { title, description, showHeader = false } = defineProps<Props>()

useHead({
  title,
  meta: description
    ? [
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
      ]
    : undefined,
})

provide('pageTitle', title)
</script>

<template>
  <!-- Optional visible page header — rendered as a grid section -->
  <LayoutSection v-if="showHeader">
    <LayoutGridItem preset="centered">
      <LayoutPageHeader :title :description />
    </LayoutGridItem>
  </LayoutSection>

  <!-- Page content — direct children of mastmain (via MastMain in the layout) -->
  <slot />
</template>
