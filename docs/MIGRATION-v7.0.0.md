# Migration Guide — v6.7.x → v7.0.0

**Audience:** an AI coding agent (or developer) updating a downstream Nuxt app that consumes these
layers.
**What changed:** props that meant different things in different components now mean one thing
everywhere (`as`, Element's text colour, every motion duration), near-duplicate components were
merged into one component with a variant prop, and the stack primitives moved into `core`.

Work top to bottom. Each change has a **Detect** step and an **Apply** step; skip anything Detect
doesn't find. Most Detect steps are one grep over `app/` (or wherever your templates live).

## 0. Preconditions

- Update the package to `^7.0.0`, reinstall, run `npx nuxt prepare`.
- If you run Vitest, delete `node_modules/.vitest-cache` once. Its file cache is keyed on each
  file's own content, so a component whose imported prop types changed keeps its v6 props.

---

## Required changes

### 1. `tag` → `as`

Every polymorphic component now takes `as`, the name Element, Nuxt UI and Reka UI already use.
Neither `tag` nor `as` is a Vue built-in; this just picks one.

Affected: `AppContainer`, `LayoutMain`, `Typography`, `TypographyRepeatText`,
`TypographyTextStroke`, `AccentScene`, `TintOverlay`, `HoverDimGroup`.

**Detect:** `grep -rnE "<(AppContainer|LayoutMain|Typography(RepeatText|TextStroke)?|AccentScene|TintOverlay|HoverDimGroup)\b[^>]*\s:?tag=" app`

**Apply:** rename the attribute: `tag="section"` → `as="section"`, `:tag="x"` → `:as="x"`.

### 2. `GradientBackground` / `GradientText` → `Gradient`

**Detect:** `grep -rnE "GradientBackground|GradientText" app`

**Apply:**

```vue
<!-- before -->
<GradientBackground preset="brand" class="p-8" />
<GradientText preset="hero">Title</GradientText>

<!-- after -->
<Gradient preset="brand" class="p-8" />
<Gradient target="text" preset="hero">Title</Gradient>
```

`as` defaults to `div` for a background and `span` for text, as before.

### 3. Removed navigation components

`SiteTitle`, `SiteSubtitle` and `LinksNamed` (deprecated in v6) are gone, along with the
navigation layer's `.site-word` class that only they used.

**Detect:** `grep -rnE "SiteTitle|SiteSubtitle|LinksNamed|site-word" app`

**Apply:**

| Before                                 | After                                              |
| -------------------------------------- | -------------------------------------------------- |
| `<SiteTitle />`                        | `<SiteLogo :stacked="false" />`                    |
| `<SiteSubtitle />`                     | render `useSite().subtitleWords` yourself          |
| `<LinksNamed name="post" :params="…">` | `<ULink :to="{ name: 'post', params: … }">`        |
| `.site-word` in your own markup        | add `display: block` (or `class="block"`) yourself |

### 4. Element / ElementTw: `color` → `fg`

Element's raw-CSS text colour is now `fg` (pairs with `bg`). `color` is no longer an Element
prop, so it falls through to the rendered component — `<Element :as="UBadge" color="error">`
now reaches UBadge without `componentProps`.

**Detect:** `grep -rnE "<Element(Tw)?\b[^>]*\scolor=" app`

**Apply:** `color="crimson"` → `fg="crimson"` where you meant the CSS text colour.

### 5. Spacing, gap, align and justify are token-only

`gap`, `align`, `justify`, `p`/`px`/`py` and `m`/`mx`/`my` on Element and the stacks no longer
accept breakpoint objects. v6 accepted `{ default, md }` but silently used only `default`, so
nothing rendered differently — this only surfaces as a type error. Gap and padding are fluid
(`--space-*` scales with the viewport), so a breakpoint jump is rarely needed.

**Detect:** typecheck errors, or `grep -rnE ":(gap|align|justify|p|px|py|m|mx|my)=\"\{" app`

**Apply:** pass the `default` value as a plain token: `:gap="{ default: 'sm', lg: 'md' }"` →
`gap="sm"`. For a real step change use a structural prop (`collapse-below`, see "New") or a
Tailwind class.

### 6. Every motion duration is milliseconds

v6 mixed seconds and milliseconds under the same `duration` name. Every motion duration now takes
milliseconds or a token (`fast` 150 · `base` 700 · `slow` 1000, from core's `--duration-*`).

| API                                       | v6 unit              | v7                             |
| ----------------------------------------- | -------------------- | ------------------------------ |
| `MotionTextReveal` `duration`             | seconds              | ms (default 800)               |
| `MotionTextReveal` `stagger`              | seconds              | ms (default 30)                |
| `MotionCountUp` / `useCountUp` `duration` | seconds              | ms (default 2000)              |
| `MotionScrollLink` `duration`             | seconds              | ms (default 1500)              |
| `scrollTo()` / `scrollToTop()` `duration` | seconds              | ms (defaults 1200 / 2000)      |
| `MotionPinnedSection` `duration`          | % of viewport height | renamed `distance` (same unit) |

`scrollTo`'s native-scroll fallback used to treat the same number as milliseconds for
`onComplete`, so `{ duration: 1.5 }` fired the callback after 1.5 ms. That's fixed by the change.

**Detect:** `grep -rnE "MotionTextReveal|MotionCountUp|useCountUp|MotionScrollLink|scrollTo\(|scrollToTop\(|MotionPinnedSection" app`

**Apply:** multiply each seconds value by 1000 (`:duration="1.5"` → `:duration="1500"`,
`:stagger="0.02"` → `:stagger="20"`). Rename `MotionPinnedSection :duration` → `:distance`.

### 7. MotionTransition and MotionStaggered take a typed `preset`

Both now share one preset set: `fade`, `rise`, `drop`, `slide-start`, `slide-end`, `scale`,
`blur` (defined once in `transitions.css`).

**Detect:** `grep -rnE "<MotionTransition|<MotionStaggered" app`

**Apply:**

| Before                                      | After                                                             |
| ------------------------------------------- | ----------------------------------------------------------------- |
| `<MotionTransition name="fade">`            | `<MotionTransition preset="fade">`                                |
| `<MotionTransition name="slide">`           | `<MotionTransition preset="rise">` (or `slide-start`/`slide-end`) |
| `<MotionTransition name="scale">`           | `<MotionTransition preset="scale">`                               |
| `<MotionStaggered :stagger-delay="80">`     | `<MotionStaggered :stagger="80">`                                 |
| `<MotionStaggered :initial-delay="200">`    | `<MotionStaggered :delay="200">`                                  |
| `<MotionStaggered animation="slide-in-up">` | `<MotionStaggered preset="rise">`                                 |

In v6, `slide` and `scale` only changed `transition-property`, so every `MotionTransition`
faded; they now move. The `transitions.css` utility classes (`.transition-*`, `.animate-*`) are
unchanged.

### 8. Shader nodes and presets merged into variant props

`mode` / `axis` / `variant` are read once when the node graph is built (like `PipelineGrain`'s
`style`); to switch at runtime, give the component a `:key`.

| Before                                                                                                                                                                                                        | After                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PipelineMultiplyBlend`, `…ScreenBlend`, `…OverlayBlend`, `…SoftLightBlend`, `…HardLightBlend`, `…DifferenceBlend`, `…ExclusionBlend`, `…ColorDodgeBlend`, `…ColorBurnBlend`, `…DarkenBlend`, `…LightenBlend` | `<PipelineBlend mode="multiply">` (`screen`, `overlay`, `soft-light`, `hard-light`, `difference`, `exclusion`, `color-dodge`, `color-burn`, `darken`, `lighten`) |
| `PipelineUVFlipX` / `UVFlipY` / `UVFlipXY`                                                                                                                                                                    | `<PipelineUVFlip axis="x">` (`y`, `xy`)                                                                                                                          |
| `PipelineRayRotateX` / `Y` / `Z`                                                                                                                                                                              | `<PipelineRayRotate axis="x">` (`y`, `z`)                                                                                                                        |
| `PipelineUVScrollX :speed="s"` / `UVScrollY :speed="s"`                                                                                                                                                       | `<PipelineUVScroll :speed-x="s" :speed-y="0">` / `:speed-x="0" :speed-y="s"`                                                                                     |
| `PresetAurora` / `Flow` / `GradientMesh` / `Nebula` / `Ocean`                                                                                                                                                 | `<PresetAmbient variant="aurora">` (`flow`, `gradient-mesh`, `nebula`, `ocean`)                                                                                  |
| `PresetThemeAurora` / `Bubble` / `Flow` / `Gradient` / `LavaLamp` / `Plasma` / `Wave`                                                                                                                         | `<PresetTheme variant="aurora">` (`bubble`, `flow`, `gradient`, `lava-lamp`, `plasma`, `wave`)                                                                   |

With `ShaderHost`, pass the merged preset once and switch looks with the new `variant` prop — it
crossfades exactly like changing `preset` did:

```vue
<ShaderHost :preset="PresetAmbient" :variant="look" :preset-props="{ speed }" />
```

**Detect:** `grep -rnE "Pipeline(\w+Blend|UVFlip(X|Y|XY)|RayRotate(X|Y|Z)|UVScroll(X|Y))\b|Preset(Theme)?(Aurora|Flow|GradientMesh|Nebula|Ocean|Bubble|Gradient|LavaLamp|Plasma|Wave)\b|components/Preset/" app`

### 9. Stacks: `.h-stack-wrap` → `data-wrap`

If your CSS targeted HStack's wrap class, select the attribute instead.

**Detect:** `grep -rn "h-stack-wrap" app`

**Apply:** `.h-stack-wrap` → `.h-stack[data-wrap]`.

---

## Behaviour changes (no action unless you rely on them)

- **Stacks moved to `core`.** `HStack`, `VStack`, `ZStack` and `Spacer` now ship with `core`, so
  every layer and app can use them without extending `layout`. Same component names.
- **Motion content is visible without JavaScript.** `MotionTransition` and `MotionStaggered` used
  to render `opacity: 0` in the server HTML. The hidden starting state now applies only under a
  `data-motion-js` flag that the `transitions` layer sets with an inline `<head>` script, and a
  2.5s failsafe reveals content if hydration never runs. A strict CSP without `'unsafe-inline'`
  for scripts needs a hash or nonce for that script, or motion will simply render without the
  entrance animation.
- **Reduced motion** is now respected by `MotionTransition`.
- **`useReducedMotion()` moved from `scroll` to `core`**, so `transitions` (which extends only
  `core`) can use it. It's auto-imported, so callers don't change; only a path import of
  `#layers/scroll/app/composables/useReducedMotion` needs updating to
  `#layers/core/app/composables/useReducedMotion`.
- **`TypographyRepeatText`** no longer creates a computed per row on every recompute.

## New (opt-in)

- **Element prop sets.** `AsProps`, `SpacingProps`, `FlexProps`, `DisplayProps`,
  `GridTrackProps`, `SizingProps`, `SurfaceProps`, `InteractionProps` and `BoxProps` are exported
  from `#layers/core/app/types/element`, each with its own resolver in `resolveElementStyle.ts`.
- **Stacks:** `as` and `p`/`px`/`py`/`m`/`mx`/`my` on all three; `wrap` on VStack; `place` on
  ZStack (`start|center|end|stretch`); `collapse-below="sm|md|lg|xl"` on HStack (row becomes a
  column below that breakpoint); `snap` + `snap-span` on HStack, which lands the items on the
  parent grid's column tracks via subgrid:

  ```vue
  <HStack snap :snap-span="{ default: 12, md: 4 }" gap="md">…</HStack>
  ```

- **Motion vocabulary in core:** `MotionPreset`, `TimingProps`, `DURATION_MS`, `MotionEase`,
  `resolveDurationMs()`, `resolveEaseCss()`, and `--ease-emphasized` / `--ease-spring` tokens.
- **`MotionTransition`:** `trigger="visible"` plays when the element scrolls into view; `duration`
  takes a token; `ease` takes a token (`out`, `in-out`, `emphasized`, `spring`) or any CSS easing.
- **Typography:** `TypographyStyleProps` / `TypographyProps` types, and pure `typographyClasses()`
  / `colorClass()` builders behind `useTypography` / `useColor`.
