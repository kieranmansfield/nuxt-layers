<script setup lang="ts">
  import type { Component, Ref } from 'vue'

  const SPACING_TOKENS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
  type SpacingToken = (typeof SPACING_TOKENS)[number]

  // The select binds a plain string key, never the resolved component object —
  // Nuxt UI's USelect doesn't preserve object identity through its internal state,
  // so matching a selection back to an option by `===` on a Component value silently
  // fails. The actual components are resolved once, eagerly, below — resolveComponent()
  // only works synchronously during setup(), not lazily inside a computed getter.
  const NATIVE_TAGS = new Set(['div', 'section', 'article', 'span', 'button'])
  const AS_OPTIONS = [
    { label: 'div (default)', value: 'div' },
    { label: 'section', value: 'section' },
    { label: 'article', value: 'article' },
    { label: 'span', value: 'span' },
    { label: 'button', value: 'button' },
    { label: 'UButton (Nuxt UI)', value: 'UButton' },
    { label: 'UCard (Nuxt UI)', value: 'UCard' },
    { label: 'UBadge (Nuxt UI)', value: 'UBadge' },
  ]
  const RESOLVED_COMPONENTS: Record<string, Component> = {
    UButton: resolveComponent('UButton'),
    UCard: resolveComponent('UCard'),
    UBadge: resolveComponent('UBadge'),
  }

  const LAYOUT_MODE_OPTIONS = [
    { label: 'none', value: 'none' },
    { label: 'block', value: 'block' },
    { label: 'flex', value: 'flex' },
    { label: 'grid', value: 'grid' },
    { label: 'hidden', value: 'hidden' },
  ]

  // 'unset' is a sentinel distinct from the real 'none' token (which means "explicit
  // 0px") — USelectItem rejects an empty-string value, so this can't just be ''.
  const UNSET = 'unset'
  const spacingItems = SPACING_TOKENS.map((token) => ({ label: token, value: token }))
  const emptyItems = [{ label: '(not set)', value: UNSET }, ...spacingItems]

  const as = ref('div')
  const layoutMode = ref<'none' | 'block' | 'flex' | 'grid' | 'hidden'>('flex')
  const cols = ref(3)
  const rows = ref<number | undefined>(undefined)
  const gap = ref<SpacingToken | typeof UNSET>('md')
  const p = ref<SpacingToken | typeof UNSET>('lg')
  const m = ref<SpacingToken | typeof UNSET>(UNSET)
  const w = ref('')
  const h = ref('120px')
  const bg = ref('var(--color-green-500)')
  const color = ref('white')
  const border = ref('')
  const radius = ref('0.5rem')
  const shadow = ref('')
  const cursor = ref('')
  const select = ref('')
  const pointer = ref('')
  const slotText = ref('Element content')

  const asValue = computed<string | Component>(() =>
    NATIVE_TAGS.has(as.value) ? as.value : RESOLVED_COMPONENTS[as.value]
  )
  const asAttr = computed(() =>
    NATIVE_TAGS.has(as.value) ? `as="${as.value}"` : `:as="${as.value}"`
  )

  // Each group's own resolver — one branchy computed per property group is easier to
  // reason about (and keeps complexity per function low) than one function covering all six.
  function layoutBindings(): Record<string, unknown> {
    const bindings: Record<string, unknown> = {}
    if (layoutMode.value !== 'none') bindings[layoutMode.value] = true
    if (layoutMode.value === 'grid') {
      bindings.cols = cols.value
      if (rows.value) bindings.rows = rows.value
    }
    return bindings
  }

  function spacingBindings(): Record<string, unknown> {
    const bindings: Record<string, unknown> = {}
    if (gap.value !== UNSET) bindings.gap = gap.value
    if (p.value !== UNSET) bindings.p = p.value
    if (m.value !== UNSET) bindings.m = m.value
    return bindings
  }

  // Shared by the three groups below — each is just "pass through every non-empty
  // string ref under its own key," so one loop replaces N near-identical if-checks.
  function pickTruthy(pairs: [string, Ref<string>][]): Record<string, unknown> {
    const bindings: Record<string, unknown> = {}
    for (const [key, valueRef] of pairs) {
      if (valueRef.value) bindings[key] = valueRef.value
    }
    return bindings
  }

  const sizingBindings = () =>
    pickTruthy([
      ['w', w],
      ['h', h],
    ])

  const surfaceBindings = () =>
    pickTruthy([
      ['bg', bg],
      ['color', color],
      ['border', border],
      ['radius', radius],
      ['shadow', shadow],
    ])

  const interactionBindings = () =>
    pickTruthy([
      ['cursor', cursor],
      ['select', select],
      ['pointer', pointer],
    ])

  // Only the props actually set — mirrors the escape-hatch spirit of Element itself:
  // absent props stay absent rather than resolving to a noisy default value.
  const elementBindings = computed<Record<string, unknown>>(() => ({
    as: asValue.value,
    ...layoutBindings(),
    ...spacingBindings(),
    ...sizingBindings(),
    ...surfaceBindings(),
    ...interactionBindings(),
  }))

  function formatAttr(key: string, value: unknown): string {
    if (value === true) return key
    if (typeof value === 'number') return `:${key}="${value}"`
    return `${key}="${value}"`
  }

  const codeSnippet = computed(() => {
    const attrs = [asAttr.value]
    for (const [key, value] of Object.entries(elementBindings.value)) {
      if (key !== 'as') attrs.push(formatAttr(key, value))
    }
    return `<Element ${attrs.join(' ')}>\n  ${slotText.value}\n</Element>`
  })

  const propertyGroups = [
    {
      name: 'Layout',
      icon: 'i-lucide-box',
      props: [
        {
          name: 'block / flex / grid / hidden',
          type: 'boolean',
          description: 'Display mode. Priority: hidden > grid > flex > block.',
        },
      ],
    },
    {
      name: 'Grid',
      icon: 'i-lucide-grid-3x3',
      props: [
        {
          name: 'cols / rows',
          type: 'number | string',
          description:
            'Track count (number → repeat(n, 1fr)) or a raw CSS track string. Only applies when grid is set.',
        },
      ],
    },
    {
      name: 'Spacing',
      icon: 'i-lucide-move',
      props: [
        {
          name: 'gap / p / px / py / m / mx / my',
          type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'",
          description:
            'Fluid spacing tokens, resolved to clamp() custom properties — not raw CSS values.',
        },
        {
          name: 'align / justify',
          type: "'start' | 'center' | 'end' | ...",
          description: 'Flexbox alignment, via the shared core useLayoutAttrs resolver.',
        },
      ],
    },
    {
      name: 'Sizing',
      icon: 'i-lucide-ruler',
      props: [
        {
          name: 'w / h / minW / maxW / minH / maxH / aspect',
          type: 'string',
          description:
            'Raw CSS passthrough — width/height/min-width/max-width/min-height/max-height/aspect-ratio.',
        },
      ],
    },
    {
      name: 'Surface',
      icon: 'i-lucide-palette',
      props: [
        {
          name: 'bg / color / border / radius / shadow',
          type: 'string',
          description:
            'Raw CSS passthrough — background/color/border/border-radius/box-shadow. No semantic colour tokens.',
        },
      ],
    },
    {
      name: 'Interaction',
      icon: 'i-lucide-mouse-pointer-click',
      props: [
        {
          name: 'cursor / select / pointer',
          type: 'string',
          description: 'Raw CSS passthrough — cursor/user-select/pointer-events.',
        },
      ],
    },
  ]
</script>

<template>
  <UContainer class="space-y-10 py-10">
    <div>
      <h1 class="text-3xl font-bold">Element</h1>
      <p class="text-muted mt-2 max-w-2xl">
        A polymorphic primitive giving templates a small, typed vocabulary — layout, grid, spacing,
        sizing, surface, interaction — instead of utility-class strings. Lives in
        <code class="bg-elevated px-1 rounded">layers/design-system/element</code>, depends only on
        <code class="bg-elevated px-1 rounded">core</code>.
      </p>
    </div>

    <!-- Interactive playground -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Playground</h2>
        <p class="text-sm text-muted mt-1">
          Pick a tag or component, tune the props, see the result and the generated markup.
        </p>
      </template>

      <div class="grid gap-8 lg:grid-cols-[320px_1fr]">
        <!-- Controls -->
        <div class="space-y-6">
          <UFormField label="as">
            <USelect v-model="as" :items="AS_OPTIONS" class="w-full" />
          </UFormField>

          <UFormField label="Layout mode">
            <USelect v-model="layoutMode" :items="LAYOUT_MODE_OPTIONS" class="w-full" />
          </UFormField>

          <div v-if="layoutMode === 'grid'" class="grid grid-cols-2 gap-3">
            <UFormField label="cols">
              <UInput v-model.number="cols" type="number" min="1" />
            </UFormField>
            <UFormField label="rows">
              <UInput v-model.number="rows" type="number" min="1" placeholder="auto" />
            </UFormField>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-muted">Spacing</p>
            <div class="grid grid-cols-3 gap-3">
              <UFormField label="gap">
                <USelect v-model="gap" :items="emptyItems" />
              </UFormField>
              <UFormField label="p">
                <USelect v-model="p" :items="emptyItems" />
              </UFormField>
              <UFormField label="m">
                <USelect v-model="m" :items="emptyItems" />
              </UFormField>
            </div>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-muted">Sizing</p>
            <div class="grid grid-cols-2 gap-3">
              <UFormField label="w">
                <UInput v-model="w" placeholder="e.g. 200px" />
              </UFormField>
              <UFormField label="h">
                <UInput v-model="h" placeholder="e.g. 120px" />
              </UFormField>
            </div>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-muted">Surface</p>
            <div class="grid grid-cols-2 gap-3">
              <UFormField label="bg">
                <UInput v-model="bg" placeholder="var(--ui-bg-elevated)" />
              </UFormField>
              <UFormField label="color">
                <UInput v-model="color" placeholder="white" />
              </UFormField>
              <UFormField label="border">
                <UInput v-model="border" placeholder="1px solid var(--ui-border)" />
              </UFormField>
              <UFormField label="radius">
                <UInput v-model="radius" placeholder="0.5rem" />
              </UFormField>
              <UFormField label="shadow" class="col-span-2">
                <UInput v-model="shadow" placeholder="0 4px 12px rgb(0 0 0 / 0.15)" />
              </UFormField>
            </div>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-muted">Interaction</p>
            <div class="grid grid-cols-3 gap-3">
              <UFormField label="cursor">
                <UInput v-model="cursor" placeholder="pointer" />
              </UFormField>
              <UFormField label="select">
                <UInput v-model="select" placeholder="none" />
              </UFormField>
              <UFormField label="pointer">
                <UInput v-model="pointer" placeholder="none" />
              </UFormField>
            </div>
          </div>

          <UFormField label="Content">
            <UInput v-model="slotText" />
          </UFormField>
        </div>

        <!-- Preview + generated code -->
        <div class="space-y-4">
          <div
            class="rounded-lg border border-default p-6 flex items-center justify-center min-h-40"
          >
            <Element v-bind="elementBindings">
              {{ slotText }}
            </Element>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
              Generated markup
            </p>
            <pre
              class="bg-elevated rounded-lg p-4 text-sm overflow-x-auto font-mono"
            ><code>{{ codeSnippet }}</code></pre>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Static reference examples -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold">Reference examples</h2>

      <Element block p="xl" class="rounded-lg border border-default">
        <h3 class="font-medium mb-3">Grid container (container axis only)</h3>
        <Element grid :cols="12" gap="lg" p="lg" bg="var(--ui-bg-elevated)" radius="0.5rem">
          <Element bg="var(--color-green-400)" color="white" p="md" radius="0.25rem">
            Item placement isn't part of Element — use LayoutGridItem inside a grid for that, or CSS
            `grid-column`/`grid-row` directly via `:style`.
          </Element>
        </Element>
      </Element>

      <Element block p="xl" class="rounded-lg border border-default">
        <h3 class="font-medium mb-3">Flex + sizing + interaction</h3>
        <Element flex gap="md" p="lg" bg="var(--ui-bg-elevated)" radius="0.5rem">
          <Element
            w="80px"
            h="80px"
            bg="var(--color-green-400)"
            radius="9999px"
            cursor="pointer"
            select="none"
          />
          <Element
            w="160px"
            h="80px"
            bg="var(--color-green-500)"
            color="white"
            p="sm"
            radius="0.5rem"
            shadow="0 4px 12px rgb(0 0 0 / 0.15)"
          >
            card
          </Element>
          <Element
            min-w="120px"
            max-w="240px"
            h="80px"
            bg="var(--color-green-600)"
            color="white"
            p="sm"
            radius="0.5rem"
          >
            min/max width
          </Element>
        </Element>
      </Element>

      <Element block p="xl" class="rounded-lg border border-default">
        <h3 class="font-medium mb-3">Layout modes</h3>
        <Element flex gap="sm">
          <Element block bg="var(--color-green-400)" p="sm" radius="0.25rem" color="white">
            block
          </Element>
          <Element flex bg="var(--color-green-500)" p="sm" radius="0.25rem" color="white">
            flex
          </Element>
          <Element hidden bg="var(--color-green-600)" p="sm" radius="0.25rem" color="white">
            hidden (not rendered visibly)
          </Element>
        </Element>
      </Element>

      <Element block p="xl" class="rounded-lg border border-default">
        <h3 class="font-medium mb-3">Margin</h3>
        <Element bg="var(--ui-bg-elevated)" p="md">
          <Element bg="var(--color-green-500)" color="white" p="sm" m="lg" radius="0.25rem">
            m="lg" pushes this box away from its siblings
          </Element>
        </Element>
      </Element>
    </div>

    <!-- Syntax documentation -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold">Syntax reference</h2>
      <p class="text-muted -mt-2">
        Six property groups, one flat prop list. Every prop is optional — Element only ever sets the
        CSS it's actually given.
      </p>

      <UCard v-for="group in propertyGroups" :key="group.name">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon :name="group.icon" class="text-primary" />
            <h3 class="font-semibold">{{ group.name }}</h3>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="prop in group.props"
            :key="prop.name"
            class="grid gap-1 sm:grid-cols-[140px_1fr]"
          >
            <code class="font-mono text-sm text-primary">{{ prop.name }}</code>
            <div>
              <p class="text-sm">{{ prop.type }}</p>
              <p class="text-xs text-muted">{{ prop.description }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold">as — polymorphic root</h3>
        </template>
        <div class="space-y-2 text-sm">
          <p>
            Controls what Element renders as. Accepts a native tag string (<code
              class="bg-elevated px-1 rounded"
              >as="section"</code
            >) or a component (<code class="bg-elevated px-1 rounded">:as="UButton"</code>).
            Defaults to <code class="bg-elevated px-1 rounded">'div'</code>.
          </p>
          <pre
            class="bg-elevated rounded p-3 overflow-x-auto"
          ><code>&lt;Element :as="UButton" p="3 5"&gt;
  Continue
&lt;/Element&gt;</code></pre>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
