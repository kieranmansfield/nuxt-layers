<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('amber')
  onUnmounted(() => setPageAccent(null))

  const works = [
    { id: 'a', name: 'Atlas', type: 'Identity', year: 2026, color: 'bg-blue-500' },
    { id: 'b', name: 'Beacon', type: 'Web app', year: 2025, color: 'bg-green-500' },
    { id: 'c', name: 'Cinder', type: 'iOS', year: 2024, color: 'bg-purple-500' },
    { id: 'd', name: 'Delta', type: 'Identity', year: 2023, color: 'bg-amber-500' },
    { id: 'e', name: 'Ember', type: 'Web app', year: 2022, color: 'bg-rose-500' },
    { id: 'f', name: 'Fable', type: 'Print', year: 2021, color: 'bg-cyan-500' },
    { id: 'g', name: 'Gantry', type: 'iOS', year: 2020, color: 'bg-lime-500' },
    { id: 'h', name: 'Harbor', type: 'Web app', year: 2019, color: 'bg-indigo-500' },
  ]

  const columns = [
    { key: 'name', label: 'Project', class: 'grow-2 basis-50' },
    { key: 'type', label: 'Category', class: 'text-muted grow basis-30' },
    { key: 'year', label: 'Year', class: 'shrink-0 basis-14' },
  ]

  const views = [
    { label: 'Cards', value: 'cards' },
    { label: 'List', value: 'list' },
    { label: 'Compact', value: 'compact' },
  ]
  const view = ref('cards')

  const newestFirst = ref(true)
  const sorted = computed(() => (newestFirst.value ? works : [...works].reverse()))
  const sortRoot = useTemplateRef<HTMLElement>('sortRoot')
  useFlip(sortRoot, { on: newestFirst, vars: { stagger: 0.02 } })
</script>

<template>
  <LayoutPage
    title="Flip Views Demo"
    description="Morph shared elements with GSAP Flip when switching between views or components"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="FLIP VIEWS"
        description="Switch a section between views or components. Elements sharing a data-flip-id travel to their match, and everything else fades."
      >
        <div class="flex flex-wrap justify-center gap-4">
          <UButton size="lg" @click="() => $router.push('#views-demo')">Switch views</UButton>
          <UButton size="lg" variant="outline" @click="() => $router.push('#sort-demo')">
            Same DOM
          </UButton>
        </div>
      </DemoPageHero>

      <DemoSection
        id="views-demo"
        title="MotionFlipViews"
        description="Three different layouts, one slot each. Colour blocks and names are tagged."
      >
        <div class="mb-10 flex justify-center">
          <UTabs v-model="view" :items="views" :content="false" />
        </div>

        <MotionFlipViews id="views" :view :flip="{ stagger: 0.015 }">
          <template #cards>
            <LayoutItemCards :items="works" item-key="id" min="200px">
              <template #media="{ item }">
                <div
                  :data-flip-id="`${item.id}:media`"
                  class="aspect-4/3 rounded-lg"
                  :class="item.color"
                />
              </template>
              <template #caption="{ item }">
                <span :data-flip-id="`${item.id}:name`" class="block w-fit font-medium">
                  {{ item.name }}
                </span>
                <span class="text-muted text-sm">{{ item.type }}, {{ item.year }}</span>
              </template>
            </LayoutItemCards>
          </template>

          <template #list>
            <LayoutItemList :items="works" :columns item-key="id" numbered>
              <template #cell-name="{ item }">
                <span class="flex items-center gap-3">
                  <span
                    :data-flip-id="`${item.id}:media`"
                    class="size-8 shrink-0 rounded-sm"
                    :class="item.color"
                  />
                  <span :data-flip-id="`${item.id}:name`" class="font-medium">
                    {{ item.name }}
                  </span>
                </span>
              </template>
            </LayoutItemList>
          </template>

          <template #compact>
            <ul class="m-0 flex list-none flex-wrap gap-3 p-0">
              <li
                v-for="item in works"
                :key="item.id"
                class="border-default flex items-center gap-2 rounded-full border py-1 pr-4 pl-1"
              >
                <span
                  :data-flip-id="`${item.id}:media`"
                  class="size-6 rounded-full"
                  :class="item.color"
                />
                <span :data-flip-id="`${item.id}:name`" class="text-sm">{{ item.name }}</span>
              </li>
            </ul>
          </template>
        </MotionFlipViews>

        <p class="text-muted border-default mt-10 border-t pt-4 text-sm">
          Content below the section slides as its height changes.
        </p>
      </DemoSection>

      <DemoSection
        id="sort-demo"
        title="useFlip"
        description="The same elements rearranged, with no component swap. Works for sort, filter and class changes."
      >
        <div class="mb-10 flex justify-center">
          <UButton variant="outline" @click="newestFirst = !newestFirst">
            {{ newestFirst ? 'Oldest first' : 'Newest first' }}
          </UButton>
        </div>
        <ul ref="sortRoot" class="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4">
          <li
            v-for="item in sorted"
            :key="item.id"
            :data-flip-id="item.id"
            class="flex aspect-video items-center justify-center rounded-lg font-medium text-white"
            :class="item.color"
          >
            {{ item.name }}
          </li>
        </ul>
      </DemoSection>

      <DemoPageFooter
        name="Flip Views"
        description="Part of the Animations layer"
        :links="[
          { label: 'Animations Layer', to: '/animations', icon: 'i-lucide-wand-sparkles' },
          { label: 'Page Transitions', to: '/page-transitions', icon: 'i-lucide-arrow-left-right' },
          { label: 'Motion Layer', to: '/motion', icon: 'i-lucide-sparkles' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
