<script setup lang="ts">
  /**
   * LayoutPage — canonical page wrapper for the Swiss Grid System.
   *
   * The grid root is already provided by LayoutMain at the layout level via
   * <main class="grid-root">. Adding another grid-root wrapper here would nest grids and
   * misalign everything, so the single root element below is `display: contents` — it
   * generates no box, and the header section and slot content still lay out as direct
   * children of the grid root. A real root element (rather than a fragment) is what Vue's
   * <Transition> and Nuxt's page-root check (NUXT_E4004) require.
   *
   * Responsibilities:
   *   - title/description meta via useSeoMeta() (pages may override)
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

  const { title, description = undefined, showHeader = false } = defineProps<Props>()

  // Deliberately a "connected" template: pages (and consumers such as KMCOMv5) set their title
  // and description through these props. useSeoMeta rather than hand-written useHead tags, so a
  // page that also calls useSeoMeta overrides these keys instead of adding duplicates.
  useSeoMeta({
    title: () => title,
    ogTitle: () => title,
    description: () => description,
    ogDescription: () => description,
  })

  provide('pageTitle', title)
</script>

<template>
  <div class="contents">
    <!-- Optional visible page header — rendered as a grid section -->
    <LayoutSection v-if="showHeader">
      <LayoutGridItem preset="centered">
        <LayoutPageHeader :title v-bind="description !== undefined ? { description } : {}" />
      </LayoutGridItem>
    </LayoutSection>

    <!-- Page content — grid items of grid-root (via LayoutMain in the layout) -->
    <slot />
  </div>
</template>
