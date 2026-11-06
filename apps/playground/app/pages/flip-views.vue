<script setup lang="ts">
  definePageMeta({ layout: false })

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
    { key: 'name', label: 'Project', class: 'flex-[2_1_200px]' },
    { key: 'type', label: 'Category', class: 'text-muted flex-[1_1_120px]' },
    { key: 'year', label: 'Year', class: 'flex-[0_0_56px]' },
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
  <LayoutPage title="Flip Views">
    <div class="bg-default mx-auto flex min-h-screen max-w-5xl flex-col gap-16 p-8">
      <section class="flex flex-col gap-6">
        <header class="flex flex-wrap items-center justify-between gap-4">
          <h1 class="text-highlighted text-3xl font-semibold">MotionFlipViews</h1>
          <UTabs v-model="view" :items="views" :content="false" />
        </header>

        <MotionFlipViews id="views" :view="view" :flip="{ stagger: 0.015 }">
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

        <p class="text-muted border-default border-t pt-4 text-sm">
          Content below the section slides as its height changes.
        </p>
      </section>

      <section class="flex flex-col gap-6">
        <header class="flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-highlighted text-2xl font-semibold">useFlip, same DOM</h2>
          <UButton variant="outline" @click="newestFirst = !newestFirst">
            {{ newestFirst ? 'Oldest first' : 'Newest first' }}
          </UButton>
        </header>
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
      </section>
    </div>
  </LayoutPage>
</template>
