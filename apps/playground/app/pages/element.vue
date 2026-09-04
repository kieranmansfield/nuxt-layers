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

  // Content presets aren't tied to a particular "as" — any tag or component can
  // hold any of these, so a bare <div> gets the same "stock content" options a
  // UCard does instead of just an editable text label.
  const CONTENT_PRESET_OPTIONS = [
    { label: 'Plain text', value: 'text' },
    { label: 'Card body (title + description + action)', value: 'card' },
    { label: 'Stat (number + label)', value: 'stat' },
    { label: 'List (checklist)', value: 'list' },
  ]
  const contentPreset = ref<'text' | 'card' | 'stat' | 'list'>('text')

  // Sensible starting point per "as" — still just a default, not a lock. Picking
  // a different content preset afterwards works for any "as" value.
  const AS_CONTENT_DEFAULTS: Record<string, { preset: typeof contentPreset.value; text?: string }> =
    {
      div: { preset: 'text', text: 'Element content' },
      section: { preset: 'text', text: 'Element content' },
      article: { preset: 'text', text: 'Element content' },
      span: { preset: 'text', text: 'Element content' },
      button: { preset: 'text', text: 'Element content' },
      UButton: { preset: 'text', text: 'Continue' },
      UBadge: { preset: 'text', text: 'New' },
      UCard: { preset: 'card' },
    }

  const CARD_DEMO_MARKUP = `  <div class="space-y-2">
    <h3 class="font-semibold">Team plan</h3>
    <p class="text-sm text-muted">Unlimited projects, priority support, billed monthly.</p>
    <UButton label="Upgrade" trailing-icon="i-lucide-arrow-right" size="sm" />
  </div>`
  const STAT_DEMO_MARKUP = `  <div class="text-center">
    <p class="text-3xl font-bold">128</p>
    <p class="text-xs text-muted uppercase tracking-wide">Active users</p>
  </div>`
  const LIST_DEMO_MARKUP = `  <ul class="space-y-1 text-sm text-left">
    <li>Unlimited projects</li>
    <li>Priority support</li>
    <li>Custom domains</li>
  </ul>`
  const CONTENT_DEMO_MARKUP: Record<'card' | 'stat' | 'list', string> = {
    card: CARD_DEMO_MARKUP,
    stat: STAT_DEMO_MARKUP,
    list: LIST_DEMO_MARKUP,
  }

  // Surface defaults exist to make the *native-tag* preview visible (a bare div
  // has no shape). Nuxt UI components already look like something on their own —
  // forcing the same overrides on them just flattens their real styling, which is
  // the whole reason "switching component" didn't visibly change anything before.
  const NATIVE_SURFACE_DEFAULTS = {
    h: '120px',
    bg: 'light-dark(#eef1fb, #16233d)',
    color: 'light-dark(#1e2a4a, #dbe4f7)',
    radius: '0.5rem',
  }
  // Layout/spacing defaults have the same problem as surface ones — flex + p="lg"
  // stretches a compact UBadge pill into a big square. Reset alongside surface.
  const NATIVE_LAYOUT_DEFAULTS = {
    layoutMode: 'flex' as const,
    gap: 'md' as const,
    p: 'lg' as const,
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
  const h = ref(NATIVE_SURFACE_DEFAULTS.h)
  const bg = ref(NATIVE_SURFACE_DEFAULTS.bg)
  const color = ref(NATIVE_SURFACE_DEFAULTS.color)
  const border = ref('')
  const radius = ref(NATIVE_SURFACE_DEFAULTS.radius)
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

  // Switching to/from a Nuxt UI component toggles the surface + layout defaults:
  // clear them going to a component (so its own default styling shows through,
  // unstretched by flex/padding), restore them coming back to a native tag (so
  // the box stays visible).
  watch(as, (next) => {
    if (NATIVE_TAGS.has(next)) {
      h.value = NATIVE_SURFACE_DEFAULTS.h
      bg.value = NATIVE_SURFACE_DEFAULTS.bg
      color.value = NATIVE_SURFACE_DEFAULTS.color
      radius.value = NATIVE_SURFACE_DEFAULTS.radius
      layoutMode.value = NATIVE_LAYOUT_DEFAULTS.layoutMode
      gap.value = NATIVE_LAYOUT_DEFAULTS.gap
      p.value = NATIVE_LAYOUT_DEFAULTS.p
    } else {
      h.value = ''
      bg.value = ''
      color.value = ''
      radius.value = ''
      layoutMode.value = 'none'
      gap.value = UNSET
      p.value = UNSET
    }
    const preset = AS_CONTENT_DEFAULTS[next] ?? { preset: 'text', text: 'Element content' }
    contentPreset.value = preset.preset
    if (preset.text) slotText.value = preset.text
  })

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
    const body =
      contentPreset.value === 'text'
        ? `  ${slotText.value}`
        : CONTENT_DEMO_MARKUP[contentPreset.value]
    return `<Element ${attrs.join(' ')}>\n${body}\n</Element>`
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
            <USelect v-model="contentPreset" :items="CONTENT_PRESET_OPTIONS" class="w-full" />
          </UFormField>
          <UFormField v-if="contentPreset === 'text'" label="Text">
            <UInput v-model="slotText" />
          </UFormField>
        </div>

        <!-- Preview + generated code -->
        <div class="space-y-4 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wide text-muted"
              >Rendered as</span
            >
            <UBadge color="neutral" variant="subtle" size="sm" class="font-mono">
              {{ as }}
            </UBadge>
          </div>

          <div
            class="rounded-lg border border-default p-6 flex items-center justify-center min-h-40"
          >
            <Element v-bind="elementBindings">
              <div v-if="contentPreset === 'card'" class="space-y-2">
                <h3 class="font-semibold">Team plan</h3>
                <p class="text-sm text-muted">
                  Unlimited projects, priority support, billed monthly.
                </p>
                <UButton label="Upgrade" trailing-icon="i-lucide-arrow-right" size="sm" />
              </div>
              <div v-else-if="contentPreset === 'stat'" class="text-center">
                <p class="text-3xl font-bold">128</p>
                <p class="text-xs text-muted uppercase tracking-wide">Active users</p>
              </div>
              <ul v-else-if="contentPreset === 'list'" class="space-y-1 text-sm text-left">
                <li>Unlimited projects</li>
                <li>Priority support</li>
                <li>Custom domains</li>
              </ul>
              <template v-else>{{ slotText }}</template>
            </Element>
          </div>

          <div class="min-w-0">
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
            <UIcon :name="group.icon" class="text-primary size-5" />
            <h3 class="font-semibold mb-0">{{ group.name }}</h3>
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
