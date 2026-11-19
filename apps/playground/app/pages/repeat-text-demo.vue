<script setup lang="ts">
  definePageMeta({ layout: false })
</script>

<template>
  <LayoutPage
    title="RepeatText"
    description="Static repeating text columns — the Swiss/modernist poster effect"
  >
    <div>
      <!-- Hero -->
      <section class="bg-default flex h-[70vh] overflow-hidden">
        <TypographyRepeatText
          text="SWISS"
          :step="10"
          weight="font-black"
          color="highlighted"
          class="w-full"
        />
      </section>

      <!-- ─── Auto-fill, single column ───────────────────────────────────────── -->
      <section class="bg-default border-default border-t py-16">
        <UContainer>
          <div class="mb-12 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Default</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Auto-fill, single column</h2>
            <p class="text-muted">
              <code class="text-primary">repeat="auto"</code> measures the container height and
              repeats the text edge-to-edge, top to bottom.
            </p>
          </div>
        </UContainer>
        <div class="h-[40vh]">
          <TypographyRepeatText text="MODERNIST" :step="7" weight="font-bold" color="highlighted" />
        </div>
      </section>

      <!-- ─── Fixed repeat count ─────────────────────────────────────────────── -->
      <section class="bg-default border-default border-t py-16">
        <UContainer>
          <div class="mb-12 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Fixed count</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Explicit repeat</h2>
            <p class="text-muted">
              <code class="text-primary">:repeat="6"</code> — a set number of copies per column.
            </p>
          </div>
        </UContainer>
        <div class="h-screen">
          <TypographyRepeatText
            text="POSTER"
            :repeat="6"
            :step="7"
            weight="font-black"
            color="primary"
          />
        </div>
      </section>

      <!-- ─── Letter / word spacing ──────────────────────────────────────────── -->
      <section class="bg-default border-default border-t py-16">
        <UContainer>
          <div class="mb-12 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Spacing</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Letter &amp; word spacing</h2>
            <p class="text-muted">
              <code class="text-primary">letter-spacing</code> /
              <code class="text-primary">word-spacing</code> accept arbitrary CSS values.
            </p>
          </div>
        </UContainer>
        <div class="h-[40vh]">
          <TypographyRepeatText
            text="GRID"
            :step="7"
            weight="font-bold"
            color="highlighted"
            letter-spacing="0.1em"
          />
        </div>
      </section>

      <!-- ─── Alternating stroke ─────────────────────────────────────────────── -->
      <section class="bg-default border-default border-t py-16">
        <UContainer>
          <div class="mb-12 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Stroke</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Alternating fill / outline</h2>
            <p class="text-muted">
              <code class="text-primary">stroke="even"</code> renders every even repetition as
              outline-only instead of filled.
            </p>
          </div>
        </UContainer>
        <div class="h-[40vh]">
          <TypographyRepeatText
            text="FUTURA"
            :step="7"
            weight="font-black"
            color="highlighted"
            stroke="even"
          />
        </div>
      </section>

      <!-- ─── Center fill ────────────────────────────────────────────────────── -->
      <section class="bg-default border-default border-t py-16">
        <UContainer>
          <div class="mb-12 text-center">
            <UBadge color="primary" variant="subtle" class="mb-4">Stroke</UBadge>
            <h2 class="text-highlighted mb-3 text-4xl font-bold">Center fill</h2>
            <p class="text-muted">
              <code class="text-primary">stroke="center"</code> fills only the middle repetition and
              outlines the rest.
            </p>
          </div>
        </UContainer>
        <div class="h-screen">
          <TypographyRepeatText
            text="CENTRE"
            :repeat="7"
            :step="7"
            weight="font-black"
            color="highlighted"
            stroke="center"
          />
        </div>
      </section>

      <!-- Footer nav -->
      <section class="bg-default border-default border-t py-16">
        <UContainer>
          <div class="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h2 class="text-highlighted mb-2 text-2xl font-bold">RepeatText</h2>
              <p class="text-muted">Static repeating text columns — typography layer</p>
            </div>
            <div class="flex flex-wrap gap-4">
              <UButton variant="ghost" to="/marquee-text">MarqueeText</UButton>
              <UButton to="/">Home</UButton>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPage>
</template>
