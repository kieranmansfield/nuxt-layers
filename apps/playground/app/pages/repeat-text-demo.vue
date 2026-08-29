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
      <section class="h-[70vh] flex bg-default overflow-hidden">
        <TypographyRepeatText
          text="SWISS"
          size="7xl"
          weight="font-black"
          color="highlighted"
          class="w-full"
        />
      </section>

      <!-- ─── Auto-fill, single column ───────────────────────────────────────── -->
      <section class="py-16 bg-default border-t border-default">
        <UContainer>
          <div class="text-center mb-12">
            <UBadge color="primary" variant="subtle" class="mb-4">Default</UBadge>
            <h2 class="text-4xl font-bold text-highlighted mb-3">Auto-fill, single column</h2>
            <p class="text-muted">
              <code class="text-primary">repeat="auto"</code> measures the container height and
              repeats the text edge-to-edge, top to bottom.
            </p>
          </div>
        </UContainer>
        <div class="h-[40vh]">
          <TypographyRepeatText
            text="MODERNIST"
            size="4xl"
            weight="font-bold"
            color="highlighted"
          />
        </div>
      </section>

      <!-- ─── Fixed repeat count ─────────────────────────────────────────────── -->
      <section class="py-16 bg-default border-t border-default">
        <UContainer>
          <div class="text-center mb-12">
            <UBadge color="primary" variant="subtle" class="mb-4">Fixed count</UBadge>
            <h2 class="text-4xl font-bold text-highlighted mb-3">Explicit repeat</h2>
            <p class="text-muted">
              <code class="text-primary">:repeat="6"</code> — a set number of copies per column.
            </p>
          </div>
        </UContainer>
        <div class="h-screen">
          <TypographyRepeatText
            text="POSTER"
            :repeat="6"
            size="4xl"
            weight="font-black"
            color="primary"
          />
        </div>
      </section>

      <!-- ─── Letter / word spacing ──────────────────────────────────────────── -->
      <section class="py-16 bg-default border-t border-default">
        <UContainer>
          <div class="text-center mb-12">
            <UBadge color="primary" variant="subtle" class="mb-4">Spacing</UBadge>
            <h2 class="text-4xl font-bold text-highlighted mb-3">Letter &amp; word spacing</h2>
            <p class="text-muted">
              <code class="text-primary">letter-spacing</code> /
              <code class="text-primary">word-spacing</code> accept arbitrary CSS values.
            </p>
          </div>
        </UContainer>
        <div class="h-[40vh]">
          <TypographyRepeatText
            text="GRID"
            size="4xl"
            weight="font-bold"
            color="highlighted"
            letter-spacing="0.1em"
          />
        </div>
      </section>

      <!-- ─── Alternating stroke ─────────────────────────────────────────────── -->
      <section class="py-16 bg-default border-t border-default">
        <UContainer>
          <div class="text-center mb-12">
            <UBadge color="primary" variant="subtle" class="mb-4">Stroke</UBadge>
            <h2 class="text-4xl font-bold text-highlighted mb-3">Alternating fill / outline</h2>
            <p class="text-muted">
              <code class="text-primary">stroke="even"</code> renders every even repetition as
              outline-only instead of filled.
            </p>
          </div>
        </UContainer>
        <div class="h-[40vh]">
          <TypographyRepeatText
            text="FUTURA"
            size="4xl"
            weight="font-black"
            color="highlighted"
            stroke="even"
          />
        </div>
      </section>

      <!-- ─── Center fill ────────────────────────────────────────────────────── -->
      <section class="py-16 bg-default border-t border-default">
        <UContainer>
          <div class="text-center mb-12">
            <UBadge color="primary" variant="subtle" class="mb-4">Stroke</UBadge>
            <h2 class="text-4xl font-bold text-highlighted mb-3">Center fill</h2>
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
            size="4xl"
            weight="font-black"
            color="highlighted"
            stroke="center"
          />
        </div>
      </section>

      <!-- Footer nav -->
      <section class="py-16 bg-default border-t border-default">
        <UContainer>
          <div class="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-highlighted mb-2">RepeatText</h2>
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
