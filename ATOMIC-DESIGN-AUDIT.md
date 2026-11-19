# Atomic design audit: nuxt-layers (2026-10-29)

Scope: the 100 UI components recorded in `docs/component-levels.md` (all of `layers/**/app/components`
except the `render/shader` pipeline nodes, which are a render graph, not UI), the layer pages and layouts,
the layer CSS, and the playground as the pattern library. Levels come from `docs/component-levels.md`,
not from folders: folders here are by domain, so a folder-based scan can't see them. The inventory
script ran against `apps/playground/.nuxt/components.d.ts` after `nuxt prepare` with every layer loaded.
**Every finding below was verified by reading the file**; the script's raw hits that turned out to be
false positives are listed at the end.

## Summary

Components 100 (atoms 34, behaviours 14, molecules 13, organisms 28, templates 4, page components 7) ·
layer pages 1 (`core/[...slug].vue`) · layer layouts 2 · playground pages 59, Demo components 12

Correctly levelled 96% (4 mislevelled) · upward deps 3 (one root cause) · SSR state leaks 0 ·
raw-palette uses in layer components 15 (3 files) · `text-step-*` uses in layer components **0** vs
90 Tailwind `text-*` sizes · organisms/templates with loading+error+empty coverage 5 of the 11 that
load data

Top issues:

1. **High**: missing content returns HTTP 200. `NuxtContentDetail` and `GalleryImageDetail` render
   "Content not found" / "Image not found" instead of throwing a 404, so bad slugs become indexable soft-404s.
2. **High**: `NuxtContentDetail` is recorded as a _template_ but fetches its own data, and three
   organisms wrap it (the script's 3 `UPWARD` hits). The level labels are inverted.
3. **Medium**: the modular step type scale from ADR 0003 isn't used by any layer component. It lives in
   `typography`, and most layers can't extend it, so they fall back to Tailwind's scale (90 uses, 9 sizes).
4. **Medium**: four `*Page` components each hand-roll the same `LayoutSection > LayoutGridItem` shell.
   That's an unextracted detail template; the index side already has `NuxtContentIndexTemplate`.
5. **Medium**: `MotionScrollStats` bypasses tokens: raw `gray`/`green` palette, `bg-black/80 text-white`,
   and `z-50`, which is off the `--z-*` scale.

## Findings

| #   | Sev    | Rule    | Location                                                                                                                                                        | Evidence                                                                                                                                                                                                                                                                                                       | Fix                                                                                                                                                                                                                                                                              |
| --- | ------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | High   | C7      | `layers/content/app/components/NuxtContent/Detail.vue:71`, `Gallery/ImageDetail.vue:91`                                                                         | `<div v-else class="text-muted py-12 text-center">{{ notFoundMessage }}</div>`. Nothing on the path throws: `useCollectionItem` → `useContentData` (`createUseAsyncData`) returns `null`, and `Blog/ItemPage`, `Portfolio/ItemPage`, `Gallery/SlugPage` and `Gallery/ImagePage` only check `useContentSection` | In each `*Page` component, after `await useContentItemSeo(...)` / `useCollectionItem(...)`: `if (!data.value) throw createError({ status: 404 })` (for the image page, also when `index` is out of range). Keep the inline message for `status === 'error'` only                 |
| 2   | High   | C6, C1  | `layers/content/app/components/NuxtContent/Detail.vue:18-19`; used by `Blog/Article.vue:22`, `Gallery/Detail.vue`, `Portfolio/Detail.vue`                       | `const { data: item, status } = await useCollectionItem(collection, slug)` plus `useCollectionSurround` inside a component recorded as `template`. The script reported organism → template as `UPWARD` ×3. The script's fetch regex missed it because the call is wrapped in a composable                      | Re-level it as an **organism** (a connected detail shell, like `NuxtContentList`'s callers) in `docs/component-levels.md`. Then the three organisms that wrap it are peers, not upward. Optionally add an `item` prop override, the same opt-out `BlogList` has for `items`      |
| 3   | Medium | C7, C13 | `Blog/ItemPage.vue:11-15`, `Portfolio/ItemPage.vue:14-18`, `Gallery/SlugPage.vue`, `Gallery/ImagePage.vue:21-25`                                                | All four are `<LayoutSection><LayoutGridItem><X …/></LayoutGridItem></LayoutSection>`. The script flags them `NO-TEMPLATE`                                                                                                                                                                                     | Add `NuxtContentDetailTemplate` (props and slots only, the twin of `IndexTemplate.vue`) and have each `*Page` render it                                                                                                                                                          |
| 4   | Medium | S9, S1  | 90 `text-xs…text-9xl` uses across layer components, e.g. `Feeds/Index.vue` (23), `ThemePicker/Menu.vue` (8), `Layout/Page/Header.vue:37` (`text-4xl font-bold`) | `grep text-step-` over layer `.vue` files finds 0 matches. The step scale is defined in `design-system/typography/app/assets/css/typography.css:71+`, and `core`, `layout`, `content` and `feeds` don't extend `typography`                                                                                    | Decide which scale is canonical. Either move the `--type-*`/`--step` tokens and `text-step-*` utilities into `core` (Tier 0, so every layer can use them) and sweep, or record in ADR 0003 that Tailwind `text-*` is the UI-chrome scale and `text-step-*` is for editorial type |
| 5   | Medium | S2, S10 | `layers/motion/scroll/app/components/Motion/ScrollStats.vue:26,62,65,70,76,82,88`                                                                               | `['fixed', 'z-50']`, `bg-black/80 text-white`, `isScrolling ? 'bg-green-500' : 'bg-gray-600'`, `text-gray-500` ×4                                                                                                                                                                                              | `z-(--z-debug)`, `bg-inverted/80 text-inverted`, `bg-success` / `bg-accented`, `text-dimmed`                                                                                                                                                                                     |
| 6   | Medium | C3, C2  | `Typography/RepeatText.vue` (atom)                                                                                                                              | Renders the project atoms `ElementTw` and `TypographyTextStroke` (`PEER`)                                                                                                                                                                                                                                      | Re-level as a molecule                                                                                                                                                                                                                                                           |
| 7   | Medium | C3, C2  | `Motion/ScrollProgress.vue` (atom)                                                                                                                              | Renders the `ProgressCircular` atom and binds it to smooth-scroll state (`PEER`)                                                                                                                                                                                                                               | Re-level as a molecule. It's a connected wrapper, so note that in the row                                                                                                                                                                                                        |
| 8   | Medium | C13     | `layers/core/app/pages/[...slug].vue` vs `layers/core/app/error.vue`                                                                                            | Both use the same shell: `flex min-h-screen items-center justify-center p-4 md:p-8 > UContainer > mx-auto max-w-2xl > UEmpty size="xl"` + action buttons                                                                                                                                                       | Extract one status-page template that both fill. The catch-all could also just `throw createError({ status: 404 })` and let `error.vue` render it, which removes the duplicate entirely                                                                                          |
| 9   | Medium | C5      | `ProjectStats/GithubCard.vue:8`, `ObsidianCard.vue`                                                                                                             | `useGithubRepoStats(() => repo)` fetches inside the organism, with no opt-out                                                                                                                                                                                                                                  | Acceptable as a documented connected organism. For parity with `BlogList`, accept an optional `stats` prop so a page can pass data it already has                                                                                                                                |
| 10  | Medium | S3      | `Feeds/Index.vue:37,48,58`, `Motion/MarqueeText.vue:135`                                                                                                        | `tracking-[0.35em]` ×4, `tracking-[0.3em]` ×4, `text-[0.9em]` ×5, `md:text-[5rem] tracking-[-0.02em]`                                                                                                                                                                                                          | Add `--tracking-*` tokens for the eyebrow/caps style, or reuse `tracking-widest`. Put the marquee size on the step scale (`text-step-display`)                                                                                                                                   |
| 11  | Low    | S2      | `Feeds/RouteCard.vue:21-30`, `ProjectStats/ObsidianCard.vue:38`, `Portfolio/StackCard.vue:13`                                                                   | `bg-orange-400/500` (RSS), `bg-violet-*` (Atom), `bg-amber-*` (JSON), `text-violet-500` (Obsidian), default `color = '#94a3b8'`                                                                                                                                                                                | These are brand colours, so the choice is fine. Name them as tokens (`--color-feed-rss`, `--color-brand-obsidian`) so they live in one place, and give `StackCard` a token default (`var(--ui-text-dimmed)`)                                                                     |
| 12  | Low    | S8      | `Motion/Staggered.vue:52,60,65`, `Motion/PinnedSection.vue:93`                                                                                                  | `.motion-staggered > :deep(*)` targets the component's own slot content                                                                                                                                                                                                                                        | `:slotted(*)`                                                                                                                                                                                                                                                                    |
| 13  | Low    | C4      | `Layout/Page/Header.vue:31-46`                                                                                                                                  | The `back` prop switches between two unrelated layouts (back button + left-aligned title vs centred title + lead)                                                                                                                                                                                              | Split into `LayoutPageHeader` and `LayoutSubPageHeader`, or make `align` an explicit variant                                                                                                                                                                                     |
| 14  | Low    | C2, C9  | `layers/core/app/components/DiagnosticsPage.vue:21`                                                                                                             | Recorded as an organism, but it calls `useSeoMeta` and owns `h1` and `min-h-screen` (a whole page)                                                                                                                                                                                                             | Re-level as `page`, matching the content `*Page` components                                                                                                                                                                                                                      |
| 15  | Low    | C10     | `Layout/Page/index.vue:59`                                                                                                                                      | `provide('pageTitle', title)` provides the setup-time string, so later `title` changes don't reach injectors                                                                                                                                                                                                   | `provide('pageTitle', toRef(() => title))`                                                                                                                                                                                                                                       |
| 16  | Low    | M1, M5  | Playground                                                                                                                                                      | No demo for `LayoutSectionHero`/`Split`/`Gallery`, `ErrorBoundary` or `LinksGroup` (each is used only in `docs/`). The 12 `apps/playground/app/components/Demo/*` components aren't in `component-levels.md`, so the test doesn't cover them                                                                   | Add a playground section per missing pattern, and extend the level record (or the test glob) to `apps/playground/app/components`                                                                                                                                                 |
| 17  | Low    | M4      | `Site/Title.vue`, `Site/Subtitle.vue`, `Links/Named.vue`                                                                                                        | Deprecated, with a dev `console.warn` and "remove in the next major". No callers anywhere                                                                                                                                                                                                                      | Remove in the next major, as planned                                                                                                                                                                                                                                             |

## Level map (changes only; the other 94 rows are correct)

| Component                                                                  | Placed   | Actual             | Action                                                                                               |
| -------------------------------------------------------------------------- | -------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| `content/…/NuxtContent/Detail.vue`                                         | template | organism           | move (relabel) + add a real detail template                                                          |
| `design-system/typography/…/Typography/RepeatText.vue`                     | atom     | molecule           | move                                                                                                 |
| `motion/scroll/…/Motion/ScrollProgress.vue`                                | atom     | molecule           | move                                                                                                 |
| `core/…/DiagnosticsPage.vue`                                               | organism | page               | move                                                                                                 |
| `core/…/Element.vue`, `ElementTw.vue`                                      | atom     | primitive (rank 0) | keep, and document that atoms rendering `ElementTw` (AccentBlob, Gradient*, Typography) aren't peers |
| `structure/navigation/…/Site/Title.vue`, `Subtitle.vue`, `Links/Named.vue` | atom     | atom               | delete next major (already deprecated)                                                               |

## CSS and tokens (layer components and layer CSS, shader excluded)

Distinct values: raw palette colours 10 (3 files; all others semantic) · font sizes 9 (Tailwind scale; 0
step-scale uses) · radii 8 · shadows 6 · z-index utilities 3 (`z-10` ×2, `z-50`, and `z-9999`, which
appears only in the `z-index.css` comment that forbids it) · arbitrary values 7 · button styles 16
(`UButton` colour/variant/size combinations, plus 2 project button atoms) · `dark:` overrides 5 (blend modes in
`Gallery/ImageDetail.vue:46` and the `sm:dark:bg-default/40` translucency in `ThemePicker/Menu.vue:19`;
both use semantic tokens, neither pairs a raw palette colour with `dark:`) · `!important` 1 (inside
LoadingScreen's `<noscript>`, which is correct) · `:deep` 4 (all slot children, see #12)

The colour literals live almost entirely in token files (`core/…/tokens/elevation-motion.css`), the feeds
XSL stylesheet (`delivery/feeds/public/feed/style.css`, which is outside the app and can't read tokens) and
debug defaults (`Layout/Grid/Debug.vue` `rgba(255,0,0,.1)`). That's fine.

## States matrix (components that load data or take a collection)

| Organism/Template                                | loading    | error           | empty                                              | 1                  | many      | long text                     | no image          | role |
| ------------------------------------------------ | ---------- | --------------- | -------------------------------------------------- | ------------------ | --------- | ----------------------------- | ----------------- | ---- |
| NuxtContentList (+ Blog/Gallery/Portfolio lists) | ✓ skeleton | ✓ slot+alert    | ✓ message                                          | ✓                  | ✓         | – (UBlogPost/UPageCard clamp) | ✓ `v-if` on image | n/a  |
| NuxtContentDetail                                | ✓          | ✓               | ✗ soft-404 (#1)                                    | ✓                  | n/a       | –                             | n/a               | n/a  |
| GalleryImageDetail                               | ✗          | ✗               | ✗ soft-404 (#1)                                    | ✓                  | n/a       | –                             | ✓                 | n/a  |
| GalleryLightbox                                  | n/a        | n/a             | ✓ `v-if="currentImage"`                            | ✓ prev/next hidden | ✓ counter | –                             | –                 | n/a  |
| ProjectStatsGithubCard / ObsidianCard            | ✓ skeleton | ✓ fallback card | ✓                                                  | n/a                | n/a       | ✓ `truncate`/`min-w-0`        | n/a               | n/a  |
| FeedsIndex                                       | –          | ✓ alert         | ✓                                                  | ✓                  | ✓         | –                             | n/a               | n/a  |
| FormContact                                      | ✓ submit   | ✓               | n/a                                                | –                  | –         | –                             | n/a               | n/a  |
| PortfolioStackGrid                               | –          | –               | ✓                                                  | ✓                  | ✓         | –                             | –                 | n/a  |
| MastNavModal                                     | n/a        | n/a             | ✗ renders an empty `<nav>` if every link is hidden | ✓                  | ✓         | –                             | n/a               | n/a  |

"–" means the state isn't handled explicitly and isn't covered by a playground demo. Long-string
resilience (a 340-character title in `LayoutPageHeader`, `BlogArticle`'s headline row, `FeedsRouteCard`) is
the biggest gap across the board. The playground has no long-content variants.

## Fix plan (phased, smallest safe steps first)

1. **Records (no code):** apply the level-map changes to `docs/component-levels.md`, and add a
   `primitive` row to the legend for `Element`/`ElementTw`.
2. **Soft 404s (#1):** add `throw createError({ status: 404 })` to the four content `*Page` components. Add a
   Playwright check that `/blog/does-not-exist` returns 404.
3. **Tokens (#5, #10, #11):** fix ScrollStats with semantic utilities and `--z-debug`; add tracking and brand
   colour tokens; sweep the arbitrary values.
4. **Type-scale decision (#4):** an ADR amendment first, then either move the step tokens to `core` or document the split.
5. **Templates (#3, #8):** add `NuxtContentDetailTemplate` and a status-page template; slim the `*Page`
   components and `[...slug].vue`.
6. **Molecules/organisms (#9, #12, #13, #15):** `stats` prop override, `:slotted`, split the header, reactive provide.
7. **Library (#16, #17):** playground demos for the uncovered patterns, long-content and empty variants per
   organism, cover `Demo/*` in the level record; remove the deprecated nav atoms in the next major.

## Keep doing

- **The level record and its test.** `docs/component-levels.md` plus `component-levels.test.ts` is a
  stronger contract than folder names. The `behaviour` level is a sensible extension of Frost's five levels.
- **SSR-safe state.** No module-level `ref`/`reactive` anywhere. Shared composables use `useState`, and
  `createSharedComposable` from `@vueuse` 15 is a no-op on the server. `useAccentColor` even documents why.
- **Pages own meta.** `useContentItemSeo` shares the organism's cache key, so meta lives at page level without a double fetch.
- **A real z-index scale** (`core/…/tokens/z-index.css`) with a drift test; Nuxt UI overlays use `z-(--z-modal)`.
- **Central reduced-motion handling.** `usePointerMotionFrame` gates every pointer effect (Tilt, Magnetic),
  and the scroll components check `useReducedMotion`.
- **Accessible atoms.** No `div`-buttons and no `outline-none`; `TextStroke` pairs its SVG with an `sr-only` label;
  `MastNavModal` uses `UModal` for the focus trap and sets `aria-current`.
- **Governance.** Deprecations carry `@deprecated`, a dev-only warning naming the replacement, and a removal target.
- **Lists that fetch but accept `items`**, so a page can pass data it already has.

## Script false positives (checked, not findings)

- `PEER` atom → `ElementTw` ×5: a polymorphic primitive, not a peer atom (see level map).
- `UNUSED` `Figure`: used from Markdown (`::figure` in `apps/playground/content/portfolio/*.md`). `MediaPicture` is used in `pages/typography.vue`.
- `SMELL?` `LoadingScreen` head: `useHead` only locks scroll and adds a `<noscript>` escape, which is app-shell behaviour.
- `SMELL?` `MastNavModal` route: a documented connected organism rendered once in the layout.
- `SMELL` `LayoutPage` head: documented as a deliberately connected template (`Page/index.vue:51`).
  Acceptable, but it's the one template exception; keep it listed in the doc.
- `CONTEXT-NAME` `FormContact`: a content name that encodes domain logic (mailer submission), so it stays an organism.
- `FAT-PAGE`/`NO-TEMPLATE` on 35 playground pages: these are demo pages, and they already share `LayoutPage` + `DemoPageHero`/`DemoPageFooter`.
