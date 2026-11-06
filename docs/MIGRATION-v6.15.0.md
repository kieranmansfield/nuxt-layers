# Migration Guide — v6.14.x → v6.15.0

**Audience:** an AI coding agent (or developer) updating a downstream Nuxt app that consumes these
layers.
**What changed:** metadata sync needs a secret in production, the contact rate limit moved to Nitro
storage, and two small behaviour changes affect apps that rely on the old values.

Work top to bottom. Each change has a **Detect** step and an **Apply** step; skip anything Detect
doesn't find.

## 0. Preconditions

- Update the package to `^6.15.0`, reinstall, run `npx nuxt prepare`.

---

## Required changes

### 1. `POST /api/metadata/sync` is closed in production without a secret

**Detect:** the app calls `/api/metadata/sync` in production.

**Apply:** set `NUXT_METADATA_LAYER_SYNC_SECRET` and send it from the caller:

```http
Authorization: Bearer <secret>
```

With no secret set, sync stays open in dev and returns 401 in production. To let signed-in users
sync instead, call `resolveRecord` from your own authenticated route.

### 2. `inject('pageTitle')` now returns a ref

**Detect:** search for `inject('pageTitle')`.

**Apply:** read it with `unref()` or `.value`. `LayoutPage` provides a ref so the value follows its
`title` prop.

---

## Optional changes

### 3. Make the contact rate limit hold across instances

The limit now lives in the `rate-limit` Nitro storage mount, which defaults to the in-memory driver,
so each instance still keeps its own count. To share it, point the mount at a shared driver:

```ts
export default defineNuxtConfig({
  nitro: {
    storage: {
      'rate-limit': { driver: 'redis', url: process.env.REDIS_URL },
    },
  },
})
```

### 4. Check `ProgressCircular` and `MotionScrollProgress` colours

Their default `colors` are now `--ui-primary`, `--ui-secondary` and `--ui-info` rather than the old
purple and pink stops.

**Detect:** either component rendered without a `colors` prop.

**Apply:** nothing, or pass `colors` to keep the previous look.

### 5. Check `PipelineRectangle` and `PipelineCross` output

Both render differently because their props now work. `PipelineRectangle` uses `height` (`width` used
to set both sides), and limits `cornerRadius` to what the shorter side can hold.
`PipelineCross` draws a cross with arms set by `size` and `thickness` (it used to draw a square of
side `thickness`). `PipelineLensFlare`'s `ghostCount` now works too, 0 to 8, and its default of 4
looks the same as before.

**Detect:** search for `<PipelineRectangle` and `<PipelineCross`.

**Apply:** nothing if the new shape is what you wanted. Otherwise set `height` equal to `width`, or
use a smaller `size`.

### 6. Replace `useFormSchema()` with `createFormSchema()`

`createFormSchema()` and `getFieldValidation()` are auto-imported utils. `useFormSchema()` still
works but is deprecated.

### 7. Replace the removed `SiteTitle`, `SiteSubtitle` and `LinksNamed`

The components are gone, but global fallbacks keep the same names rendering the same output, with a
dev warning. The fallbacks will be deleted in the next major.

**Detect:** search for `<SiteTitle`, `<SiteSubtitle` and `<LinksNamed`.

**Apply:**

- `<SiteTitle>` → `<SiteLogo :stacked="false">`
- `<SiteSubtitle>` → render `useSite().subtitleWords`
- `<LinksNamed name="x">` → `<ULink :to="{ name: 'x' }">`

---

## New, no action needed

- **`pageTransitions.once`** in app config plays a preset on first page load. Use one that reveals
  the page itself (`fade`, `slide`, `crossfade`, `slide-x`).
- **Runtime hooks** `page-transition:before-leave`, `after-leave`, `before-enter` and `after-enter`
  receive `{ name, direction, el }`. `after-leave` fires after `before-enter`, because Vue removes
  the old page, which mounts the new one, before calling it.
- **Persistent elements:** put anything that should survive navigation in a Nuxt layout.
- **`loadGsapPlugins(...names)`** loads and registers Draggable, InertiaPlugin, DrawSVGPlugin,
  MorphSVGPlugin, MotionPathPlugin, ScrambleTextPlugin, TextPlugin and Physics2DPlugin on demand.
- **`NuxtContentDetail`** takes `item` and `surround`, and the `ProjectStats` cards take `stats`, to
  skip their own fetches.
- **`NuxtContentDetailTemplate`** is the layout shared by the content item pages.
- **`selectCollection(items, options)`** is the pure sort, filter and limit step behind
  `useCollectionItems`. Items missing the sort field now sort last in `asc` as well as `desc`, as
  the option's docs always said.
- **`useMetadataSearch`** takes getters as well as refs, and refetches when `providers` or `limit`
  change.
- **`useUniformProp(() => prop)`** creates a shader uniform that follows a numeric prop.
  `watchUniformProp` stays for uniforms that need a transform.
- **`useColorProp(() => hex)`** and **`useVector2Prop(() => [x, y])`** do the same for colours and
  positions. **`useColorMixStage(colorA, colorB, factor, order)`** is the stage for generators that
  mix two colours, and **`useAmbientControls`** wires an ambient preset's props and mouse.
- **`useScrollScene(caller)`** returns the enclosing `MotionScrollScene`'s context.
  `useScrollSteps` and `MotionScrollStep` now warn in dev outside a scene, and `SCROLL_SCENE_KEY` is
  a typed `InjectionKey`.
- **`resolveNotFoundConfig(config, onBack)`** fills the 404 page's defaults and returns its actions
  as `ButtonProps[]`.
