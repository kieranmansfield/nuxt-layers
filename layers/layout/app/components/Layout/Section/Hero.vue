<script setup lang="ts">
/**
 * SectionHero - Full-viewport hero section
 *
 * Pre-configured hero layout with optional background and footer slots.
 * Main content is vertically and horizontally centered.
 *
 * @prop {boolean} fullHeight - Force 100svh (default: true)
 *
 * @slot background - Full-bleed background layer (z-index: 0)
 * @slot default - Main centered content (z-index: 10)
 * @slot footer - Bottom-aligned content (z-index: 10)
 *
 * @example
 * <SectionHero>
 *   <template #background>
 *     <NuxtImg src="/hero.jpg" class="size-full object-cover" />
 *   </template>
 *   <h1>Main Heading</h1>
 *   <p>Subtitle</p>
 *   <template #footer>
 *     <UButton>CTA</UButton>
 *   </template>
 * </SectionHero>
 */

interface Props {
  fullHeight?: boolean
}

const { fullHeight = true } = defineProps<Props>()
</script>

<template>
  <LayoutSection :full-height>
    <LayoutGridItem
      v-if="$slots.background"
      :col-span="18"
      :row-span="12"
      layer="back"
      bleed="both"
    >
      <slot name="background" />
    </LayoutGridItem>

    <LayoutGridItem
      :col-start="{ default: 1, md: 2, lg: 4 }"
      :col-span="{ default: 6, md: 10, lg: 12 }"
      :row-start="4"
      :row-span="5"
      align="center"
      justify="center"
      layer="mid"
    >
      <slot />
    </LayoutGridItem>

    <LayoutGridItem
      v-if="$slots.footer"
      :col-start="{ default: 1, md: 2, lg: 4 }"
      :col-span="{ default: 6, md: 10, lg: 12 }"
      :row-start="11"
      :row-span="2"
      align="end"
      justify="center"
      layer="mid"
    >
      <slot name="footer" />
    </LayoutGridItem>
  </LayoutSection>
</template>
