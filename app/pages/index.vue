<script setup lang="ts">
import { ref } from 'vue'

const umainRef = ref()
</script>

<template>
  <MastMain :umain="umainRef">
    <UContainer class="py-12 space-y-12">
      <!-- Header Section -->
      <div class="space-y-4">
        <SiteTitle
          site-title="UI Layer"
          tag="h1"
          title-variant="default"
        />
        <Typography
          tag="p"
          weight="font-normal"
          leading="leading-relaxed"
          color="muted"
          class="text-lg"
        >
          A unified, typed design system for Nuxt applications. This layer provides
          typography, colors, media handling, and reusable UI primitives.
        </Typography>
      </div>

      <!-- Typography Section -->
      <section class="space-y-6">
        <TypographyHeadline :level="2" color="highlighted">
          Typography Components
        </TypographyHeadline>

        <div class="space-y-4">
          <div class="space-y-2">
            <TypographyHeadline :level="1">
              Headline Level 1
            </TypographyHeadline>
            <TypographyHeadline :level="2">
              Headline Level 2
            </TypographyHeadline>
            <TypographyHeadline :level="3">
              Headline Level 3
            </TypographyHeadline>
            <TypographyHeadline :level="4">
              Headline Level 4
            </TypographyHeadline>
          </div>

          <Typography
            tag="p"
            leading="leading-relaxed"
          >
            The Typography component provides full control over font weight, width, slant,
            leading, tracking, alignment, and text transformation through typed props.
          </Typography>

          <TypographyCodeBlock language="typescript" color="muted">
&lt;Typography
  weight="font-bold"
  leading="leading-tight"
  tracking="tracking-tight"
&gt;
  Fully typed typography
&lt;/Typography&gt;</TypographyCodeBlock>
        </div>
      </section>

      <!-- Color System Section -->
      <section class="space-y-6">
        <TypographyHeadline :level="2" color="highlighted">
          Color System
        </TypographyHeadline>

        <div class="space-y-4">
          <div>
            <Typography tag="h3" weight="font-semibold" class="mb-2">
              Semantic Colors
            </Typography>
            <div class="flex flex-wrap gap-2">
              <Typography color="dimmed" class="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                Dimmed
              </Typography>
              <Typography color="muted" class="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                Muted
              </Typography>
              <Typography color="toned" class="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                Toned
              </Typography>
              <Typography color="highlighted" class="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                Highlighted
              </Typography>
            </div>
          </div>

          <div>
            <Typography tag="h3" weight="font-semibold" class="mb-2">
              Status Colors
            </Typography>
            <div class="flex flex-wrap gap-2">
              <Typography color="info" class="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                Info
              </Typography>
              <Typography color="success" class="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                Success
              </Typography>
              <Typography color="warning" class="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                Warning
              </Typography>
              <Typography color="error" class="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                Error
              </Typography>
            </div>
          </div>
        </div>
      </section>

      <!-- Components Section -->
      <section class="space-y-6">
        <TypographyHeadline :level="2" color="highlighted">
          Available Components
        </TypographyHeadline>

        <div class="grid md:grid-cols-2 gap-6">
          <UCard>
            <template #header>
              <TypographyHeadline :level="3">
                Typography
              </TypographyHeadline>
            </template>
            <div class="space-y-2">
              <Typography tag="p" color="muted" leading="leading-relaxed">
                Base component with full control over font properties
              </Typography>
              <ul class="list-disc list-inside space-y-1 text-sm text-muted">
                <li>Typography (base)</li>
                <li>Headline (h1-h6)</li>
                <li>CodeBlock</li>
                <li>QuoteBlock</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <TypographyHeadline :level="3">
                Links
              </TypographyHeadline>
            </template>
            <div class="space-y-2">
              <Typography tag="p" color="muted" leading="leading-relaxed">
                Type-safe navigation with named routes
              </Typography>
              <ul class="list-disc list-inside space-y-1 text-sm text-muted">
                <li>Named route enforcement</li>
                <li>Color support</li>
                <li>ULink wrapper</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <TypographyHeadline :level="3">
                Media
              </TypographyHeadline>
            </template>
            <div class="space-y-2">
              <Typography tag="p" color="muted" leading="leading-relaxed">
                Responsive image handling with optimization
              </Typography>
              <ul class="list-disc list-inside space-y-1 text-sm text-muted">
                <li>Picture component</li>
                <li>Multiple formats (avif, webp)</li>
                <li>Responsive sizing</li>
                <li>Lazy loading</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <TypographyHeadline :level="3">
                Branding
              </TypographyHeadline>
            </template>
            <div class="space-y-2">
              <Typography tag="p" color="muted" leading="leading-relaxed">
                Site branding and structure components
              </Typography>
              <ul class="list-disc list-inside space-y-1 text-sm text-muted">
                <li>Masthead/Main wrapper</li>
                <li>Site Title with variants</li>
                <li>Semantic HTML structure</li>
              </ul>
            </div>
          </UCard>
        </div>
      </section>

      <!-- Quote Example -->
      <section class="space-y-6">
        <TypographyHeadline :level="2" color="highlighted">
          Quote Block
        </TypographyHeadline>

        <TypographyQuoteBlock color="muted" class="border-l-4 border-primary pl-4 italic">
          A unified, typed design system that provides consistency across projects
          while maintaining flexibility for customization.
        </TypographyQuoteBlock>
      </section>

      <!-- Features List -->
      <section class="space-y-6">
        <TypographyHeadline :level="2" color="highlighted">
          Key Features
        </TypographyHeadline>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <Typography weight="font-semibold" color="primary">
              Fully Typed
            </Typography>
            <Typography tag="p" color="muted" leading="leading-relaxed" class="text-sm">
              Complete TypeScript coverage with semantic types for typography, colors, and breakpoints
            </Typography>
          </div>

          <div class="space-y-2">
            <Typography weight="font-semibold" color="primary">
              Composable First
            </Typography>
            <Typography tag="p" color="muted" leading="leading-relaxed" class="text-sm">
              Built on Vue composables (useTypography, useColor, usePicture) for maximum reusability
            </Typography>
          </div>

          <div class="space-y-2">
            <Typography weight="font-semibold" color="primary">
              Responsive Ready
            </Typography>
            <Typography tag="p" color="muted" leading="leading-relaxed" class="text-sm">
              Comprehensive breakpoint system supporting Tailwind, device, phone, and tablet breakpoints
            </Typography>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <Typography tag="p" color="dimmed" align="center" class="text-sm">
          UI Layer - A reusable design system for Nuxt
        </Typography>
      </footer>
    </UContainer>
  </MastMain>
</template>
