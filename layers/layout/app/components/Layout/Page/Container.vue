<script setup lang="ts">
/**
 * PageContainer - Unified page wrapper component
 *
 * Integrates with the Swiss Grid System and optionally supports UPage layout.
 * Manages page metadata via useHead() and provides title redundancy.
 *
 * @prop {string} title - Page title (required) - sets <title> and displays in header
 * @prop {string} description - Optional meta description for SEO
 * @prop {boolean} showHeader - Show visible page header (default: true)
 * @prop {string} headerPreset - Grid preset for header: 'hero', 'centered', 'fullWidth' (default: 'centered')
 * @prop {string} layout - Layout mode: 'grid' | 'upage' (default: 'grid')
 *
 * @example
 * <!-- Simple centered page -->
 * <PageContainer title="About" description="Learn about our company">
 *   <LayoutSection>
 *     <LayoutGridItem preset="centered">
 *       <p>Content here</p>
 *     </LayoutGridItem>
 *   </LayoutSection>
 * </PageContainer>
 *
 * @example
 * <!-- Hero page with custom grid (no visible header) -->
 * <PageContainer title="Welcome" :show-header="false" description="Welcome page">
 *   <LayoutSectionHero full-height>
 *     <h1>{{ title }}</h1>
 *   </LayoutSectionHero>
 * </PageContainer>
 *
 * @example
 * <!-- Documentation-style with UPage -->
 * <PageContainer title="Documentation" layout="upage">
 *   <UPageBody>
 *     <p>Documentation content</p>
 *   </UPageBody>
 * </PageContainer>
 */

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  headerPreset: 'centered',
  layout: 'grid',
})

interface Props {
  title: string
  description?: string
  showHeader?: boolean
  headerPreset?: string
  layout?: 'grid' | 'upage'
}

// Set page metadata for SEO and browser tab
useHead({
  title: props.title,
  meta: props.description
    ? [
        { name: 'description', content: props.description },
        { property: 'og:title', content: props.title },
        { property: 'og:description', content: props.description },
      ]
    : undefined,
})

// Provide title to child components (e.g., for breadcrumbs, schema.org)
provide('pageTitle', props.title)
</script>

<template>
  <!-- Grid Layout Mode (default) - no wrapper, direct children of parent MastMain -->
  <template v-if="layout === 'grid'">
    <!-- Optional visible header -->
    <LayoutSection v-if="showHeader">
      <LayoutGridItem :preset="headerPreset">
        <LayoutPageHeader :title :description />
      </LayoutGridItem>
    </LayoutSection>

    <!-- Main content slot -->
    <slot />

    <!-- Grid debugging helper -->
    <LayoutGridDebug />
  </template>

  <!-- UPage Layout Mode - needs wrapper with MastMain -->
  <div v-else>
    <MastMain>
      <UPage v-bind="$attrs">
        <slot />
      </UPage>
    </MastMain>

    <!-- Grid debugging helper -->
    <LayoutGridDebug />
  </div>
</template>
