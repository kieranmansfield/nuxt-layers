# Plan 007: Fix the current `kmcom-nuxt-layers` typecheck failures

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise.
>
> **Drift check (run first)**: `git diff --stat e26de8a..HEAD -- layers/animations layers/canvas layers/content layers/feeds layers/shader layers/theme`
> If the current `vue-tsc` output no longer matches the 29 errors listed
> below, stop and re-scope before editing anything.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `e26de8a`, 2026-06-16

## Why this matters

Nuxt is still pulling `kmcom-nuxt-layers` source into the typecheck graph
through generated aliases. That means the package has to satisfy the app's
compiler, not just the package's own build. The current failures are all
source-level contract mismatches: nullability, exact optional props, renderer
typing, and a color-node alias that does not match the actual runtime node
shape.

Fixing the package source is the durable solution. Changing the consumer's
`exclude` or other `nuxt.config.ts` settings would only hide the problem and
would leave every downstream project exposed to the same diagnostics.

## Current state

- The current package-local check, `node_modules/.bin/vue-tsc --noEmit -p tsconfig.typecheck.json`, reports 29 errors in 12 files.
- The failing files are:
  - `layers/animations/app/components/Motion/MarqueeText.vue:102`
  - `layers/canvas/app/composables/useRendererCapabilities.ts:19`
  - `layers/content/app/components/NuxtContent/Detail.vue:54`
  - `layers/feeds/server/utils/content-adapter.ts:18-35`
  - `layers/shader/app/components/Preset/Aurora.client.vue:34-35`
  - `layers/shader/app/components/Preset/Flow.client.vue:35-36`
  - `layers/shader/app/components/Preset/GradientMesh.client.vue:35-36`
  - `layers/shader/app/components/Preset/Nebula.client.vue:35-36`
  - `layers/shader/app/components/Preset/Ocean.client.vue:35-36`
  - `layers/shader/app/components/Shader/Background.client.vue:108, 181`
  - `layers/shader/app/composables/useThemePreset.ts:38-55`
  - `layers/theme/app/components/ThemePicker/Colors.vue:13`
- The two new regressions that were not in the earlier draft are the content
  surround prop handoff and the theme accent list narrowing.
- Shared type-contract context:
  - `layers/shader/app/shaders/types.ts` currently defines `FloatUniform` and
    `Vec3Uniform`.
  - `layers/shader/app/composables/useUniforms.ts` shows `useColorUniform()`
    returning `uniform(color)` for a color node, not a vector-3 uniform.
  - `layers/shader/app/composables/useAmbientMaterials.ts` is the shared place
    to align the theme color-node contract if a common alias is introduced.

Current code excerpts that matter:

`layers/content/app/components/NuxtContent/Detail.vue`

```ts
const surroundLinks = computed(
  () => (surround.value ?? undefined) as ContentSurroundLink[] | undefined
)
```

```vue
<NuxtContentSurround :surround="surroundLinks" />
```

`layers/theme/app/components/ThemePicker/Colors.vue`

```ts
const accents = computed(() => appConfig.themeLayer?.accents ?? [])
```

```vue
<ThemePickerAccentButton
  v-for="color in accents"
  :key="color"
  :color
  :active="activeAccent === color"
  @select="setAccent"
/>
```

`layers/shader/app/composables/useUniforms.ts`

```ts
export function useColorUniform(initialHex: string) {
  const hex = ref(initialHex)
  const color = new Color(initialHex)
  const node = uniform(color)
  ...
}
```

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Local package check | `node_modules/.bin/vue-tsc --noEmit -p tsconfig.typecheck.json` | exit 0, no diagnostics in the 12 files above |
| Consumer regression gate | `pnpm run typecheck` in KMCOM frontend after linking/publishing the package change | exit 0, 0 errors |

## Scope

**In scope** (apply the same edits in the `kmcom-nuxt-layers` source repo):
- `layers/animations/app/components/Motion/MarqueeText.vue`
- `layers/canvas/app/composables/useRendererCapabilities.ts`
- `layers/content/app/components/NuxtContent/Detail.vue`
- `layers/feeds/server/utils/content-adapter.ts`
- `layers/shader/app/components/Preset/Aurora.client.vue`
- `layers/shader/app/components/Preset/Flow.client.vue`
- `layers/shader/app/components/Preset/GradientMesh.client.vue`
- `layers/shader/app/components/Preset/Nebula.client.vue`
- `layers/shader/app/components/Preset/Ocean.client.vue`
- `layers/shader/app/components/Shader/Background.client.vue`
- `layers/shader/app/composables/useThemePreset.ts`
- `layers/shader/app/composables/useAmbientMaterials.ts`
- `layers/shader/app/shaders/types.ts` (only if you introduce a shared color-uniform alias)
- `layers/theme/app/components/ThemePicker/Colors.vue`

**Out of scope** (do NOT touch):
- `nuxt.config.ts`, `package.json`, `.nuxt/**` in the frontend repo - those
  files only prove why the package is being typechecked.
- Any consumer config change that tries to hide the package from typecheck.
- Any fix that only suppresses errors with `any` or `as unknown as` outside a
  tiny, justified boundary.

## Git workflow

- Work on the current branch or a conventional feature branch if your local
  workflow requires one.
- Commit message style should stay conventional-commit friendly.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Fix the base nullability and shape errors

Update:

- `layers/animations/app/components/Motion/MarqueeText.vue`
- `layers/canvas/app/composables/useRendererCapabilities.ts`
- `layers/feeds/server/utils/content-adapter.ts`

Implement the narrowest safe changes:

- Use optional chaining for `containerRef.value` before indexing the first
  marquee container.
- Narrow the renderer branch so `renderer.capabilities` is only read on the
  WebGL path; keep the WebGPU fallback behavior intact.
- Replace the loose `AnyContent` shape in the feed adapter with a concrete
  local source-item type that matches the fields the adapter actually reads.
  Normalize `title`, `description`, `link`, `id`, `date`, `author`, and
  `tags` to the `FeedItem` contract instead of letting `unknown` flow through.

**Verify**: `node_modules/.bin/vue-tsc --noEmit -p tsconfig.typecheck.json`
-> the diagnostics for those three files disappear.

### Step 2: Fix the content surround prop and theme accent narrowing

Update:

- `layers/content/app/components/NuxtContent/Detail.vue`
- `layers/theme/app/components/ThemePicker/Colors.vue`

Implement the narrowest safe changes:

- Do not pass `surround: undefined` through a prop object. Use a conditional
  prop bind or a `v-if` gate so `NuxtContentSurround` only receives
  `surround` when links exist. Keep the child component's prop contract
  unchanged.
- Keep the accent list typed as `AccentColor[]` so the loop variable and
  `setAccent` stay in the theme union. If `useAppConfig()` inference drops the
  literal union, add an explicit computed annotation instead of loosening the
  button prop.

**Verify**: `node_modules/.bin/vue-tsc --noEmit -p tsconfig.typecheck.json`
-> no diagnostics remain in `Detail.vue` or `Colors.vue`.

### Step 3: Fix the shared mouse-uniform writes in the shader presets

Update:

- `layers/shader/app/components/Preset/Aurora.client.vue`
- `layers/shader/app/components/Preset/Flow.client.vue`
- `layers/shader/app/components/Preset/GradientMesh.client.vue`
- `layers/shader/app/components/Preset/Nebula.client.vue`
- `layers/shader/app/components/Preset/Ocean.client.vue`
- `layers/shader/app/composables/useThemePreset.ts`

Use the runtime mouse coordinates as optional numbers and provide the existing
center fallback when writing to float uniforms:

- `uniforms.mouseX.value = mx ?? 0.5`
- `uniforms.mouseY.value = my ?? 0.5`

Do not change the runtime mouse source or the preset component APIs; this is a
type alignment fix, not a behavior change.

**Verify**: `node_modules/.bin/vue-tsc --noEmit -p tsconfig.typecheck.json`
-> no `number | undefined` assignment errors remain in the preset or
theme-preset files.

### Step 4: Align the background renderer typing and the color-uniform contract

Update:

- `layers/shader/app/components/Shader/Background.client.vue`
- `layers/shader/app/composables/useAmbientMaterials.ts`
- `layers/shader/app/shaders/types.ts` only if needed for the color alias

Make two separate cleanups:

- Type `toneMappingMap` as a keyed map to `ToneMapping` so
  `renderer.toneMapping` is assigned a real `ToneMapping` value, not a plain
  `number`. Also guard `renderer` in the resize watcher before calling
  `setSize`.
- Replace the `ThemeColorUniforms` `Vec3Uniform` contract with a color-uniform
  alias that matches the node returned by `useShaderColor()` /
  `useColorUniform()`.
- Keep the shader math helpers using those color nodes directly; do not force
  them through a vector-3 type just to satisfy the compiler.

If the cleanest fix is to add a shared `ColorUniform` alias, define it once in
`layers/shader/app/shaders/types.ts` and import it into
`useAmbientMaterials.ts` and `useThemePreset.ts`.

**Verify**: `node_modules/.bin/vue-tsc --noEmit -p tsconfig.typecheck.json`
-> no diagnostics remain in `Background.client.vue`, `useAmbientMaterials.ts`,
or `useThemePreset.ts`.

### Step 5: Re-run the consumer gate

Publish, link, or otherwise install the updated package into the KMCOM frontend
workspace, then run the frontend typecheck again.

**Verify**: `pnpm run typecheck` in the frontend repo -> exit 0, 0 errors.

## Test plan

No new tests are required for this patch. The fix is a type-safety and
nullability cleanup across existing runtime code paths, so the gate is the
package-local `vue-tsc` run plus the consumer repo's `pnpm run typecheck`.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `node_modules/.bin/vue-tsc --noEmit -p tsconfig.typecheck.json` exits 0 in the package repo
- [ ] `pnpm run typecheck` exits 0 in the KMCOM frontend after the package is linked/published
- [ ] No diagnostics remain for the 12 files listed in the current-state summary
- [ ] No consumer config files were touched to hide the package from typecheck

## STOP conditions

Stop and report back (do not improvise) if:

- The current diagnostics differ materially from the pasted 29 errors in 12
  files.
- A proposed fix requires changing the frontend consumer's `exclude` or other
  `nuxt.config.ts` settings instead of fixing the package source.
- The shader color contract cannot be expressed cleanly without scattering
  `any` or double casts through the shader helpers.
- A step's verification still reports one of the current 29 errors after the
  relevant files were edited twice.

## Maintenance notes

- Keep `useShaderColor()` and `useColorUniform()` aligned with the actual node
  shape they return; do not coerce them into vector aliases.
- If the feed layer gains more content fields, grow the local source-item type
  in `content-adapter.ts` rather than widening `FeedItem`.
- When future renderer support is added, keep the WebGL/WebGPU narrowing
  explicit; don't rely on constructor-name checks for type safety.
- If `themeLayer.accents` gains new accents, update the `AccentColor` union and
  the button palette together.
