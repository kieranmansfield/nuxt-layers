# Layer Taxonomy Redesign — Part 3: Tier 3 (Content)

## Scope

Forensic audit of `content` (only member of Tier 3) — every real file read, every component/
composable traced to actual consumers via grep. Continues the process established in the Tier 0/1
and Tier 2 docs. Findings below were investigated, decided, and implemented in the same pass (user
explicitly asked to close the gaps rather than just record them).

## Findings and resolution

### Dead code — deleted

- `_jiti_test.ts` (layer root) — scratch diagnostic testing zod's `.def`/`._def` shape, leftover
  from investigating the documented jiti/`moduleCache:false` bug. Zero consumers.
- `useBlogPost.ts`, `useGalleryItem.ts`, `usePortfolioItem.ts` (all singular) — zero consumers;
  `NuxtContent/Detail.vue` calls the generic `useCollectionItem(collection, slug)` directly.
- `usePortfolioItems.ts` (plural) — zero consumers; superseded by the generic path below.
- `createPortfolioComposables.ts` — absorbed into the new generic composable (see below).
- `Gallery/Card.vue`, `Blog/Card.vue`, `Portfolio/Card.vue`, `Gallery/AmbientImage.vue` — all zero
  consumers. Each was a complete, working component that got bypassed by an inline reimplementation
  of the same markup in its real consumer (`Gallery/Grid.vue`, `Blog/List.vue` via `<UBlogPost>`,
  `Portfolio/List.vue` via `<UPageCard>`, `Gallery/ImageDetail.vue`).
- `NuxtContent/Renderer.vue` — zero consumers; `NuxtContent/Detail.vue` uses `@nuxt/content`'s raw
  `<ContentRenderer>` directly instead.

### List-composable duplication — resolved with one generic composable

`docs/fallow-refactor/layers-content.md` (pre-existing repo doc) had already flagged
`useGalleryItems`/`usePortfolioItems` as near-duplicates. Confirmed broader than that doc knew:
`useBlogPosts`, `useGalleryItems`, and `createPortfolioComposables`'s `useItems` all reimplemented
the same sort → filter-by-tags → filter-by-boolean-field → limit pipeline, differing only in the
sort key (`date` vs `year`) and the boolean field (`draft` vs `featured`).

**Implemented**: one generic `useCollectionItems(collectionName, { tags, limit, sortKey,
sortDirection, filter })` (`composables/useCollectionItems.ts`) — `sortKey` and the boolean
`filter` predicate are duck-typed, so the same function serves both compile-time-known collections
and `Portfolio/List.vue`'s runtime `collection` prop. `useBlogPosts.ts`/`useGalleryItems.ts` are
now thin wrappers over it (per fallow's own recommendation); `Portfolio/List.vue` calls it directly
since it has no fixed domain to wrap. `createPortfolioComposables.ts` deleted, fully absorbed.

### Missing `/blog` and `/portfolio` routes — resolved (design was misread, corrected by user)

Initial read: `content.vue`'s own demo page claimed _"the content layer provides default pages at
`/blog`, `/portfolio`, and `/gallery`... out of the box"_, but `layers/content` has no `app/pages/`
directory and the playground had no `/blog` or `/portfolio` routes — only `/gallery`.

**User correction**: the layer has never auto-registered routes — that was tried once and produced
stray unused pages, so it was deliberately rebuilt as components-only. "Out of the box with very
little coding" means each domain ships a `Page.vue` + `ItemPage.vue`/`SlugPage.vue` pair that the
consuming app copies into `app/pages/` as a 1–3 line wrapper — exactly what `gallery/index.vue` →
`<GalleryPage />` already does. The actual gap: `Portfolio` already had this `Page.vue`/
`ItemPage.vue` pair but the playground never copied the wrapper pages in; `Blog` didn't have the
pair built at all.

**Implemented**:

- Added `Blog/Page.vue` and `Blog/ItemPage.vue`, mirroring `Portfolio/Page.vue`/`ItemPage.vue`
  exactly (`contentLayer.sections.blog` guard, `LayoutSection`/`LayoutGridItem` wrapper).
- Added the four thin playground route wrappers: `apps/playground/app/pages/blog/index.vue`,
  `blog/[slug].vue`, `portfolio/index.vue`, `portfolio/[slug].vue` — same 1–3 line shape as the
  existing `gallery/*` routes.
- Rewrote `content.vue`'s Architecture Note to describe the real, components-only/copy-in pattern
  instead of the false "layer provides pages" claim.

### `content`: `app.config.ts` structural defect — fixed (6th instance of the repo-wide pattern)

Same defect as `core`/`layout`/`routing` (Tiers 0-2): bare `export default {...}`, augmentation
split into a separate `app/types/app-config.d.ts`. Fixed identically: `defineAppConfig()`, merged
`declare module` into the same file, deleted the `.d.ts`. `theme`'s own instance of this (Tier 1)
is still pending — not touched here.

## Confirmed correct, no action

- `content.config.ts` — all four collection schemas correctly mirrored into
  `types/collections.d.ts`'s frontmatter augmentation, per the documented jiti constraint.
- `useContentData`, `useContentPage`, `useCollectionItem`, `useCollectionSurround` — real,
  consumed, correctly layered.
- `NuxtContent/Detail.vue`, `NuxtContent/List.vue`, `NuxtContent/Surround.vue`, `NuxtContent/Toc.vue`
  — real, well-built generic wrappers, correctly consumed by all three domains.
- `Gallery/Grid.vue`, `Gallery/Detail.vue`, `Gallery/ImageDetail.vue`, `Gallery/Lightbox.vue`,
  `Gallery/Page.vue`, `Gallery/SlugPage.vue`, `Gallery/ImagePage.vue` — real, fully wired.
- `Portfolio/Detail.vue`, `Portfolio/ColorPalette.vue`, `Portfolio/Typography.vue`, `Blog/Article.vue`
  — real, complete; now reachable via the routes added above.
- `content/Figure.vue` — MDC component invoked from markdown (`::figure`), not from Vue templates;
  zero grep hits is expected and correct for this component category.
- `types/content.ts`, `types/collections.d.ts` — clean, kept in sync with `content.config.ts`.
- `nuxt-studio` conditional dev-only module load — real, deliberate optional peer dependency
  pattern, correctly guarded.

## Consolidated action list (Tier 3)

- [x] Delete `layers/content/_jiti_test.ts`
- [x] Fix `content/app/app.config.ts` structural defect
- [x] Delete `useBlogPost.ts`, `useGalleryItem.ts`, `usePortfolioItem.ts`, `usePortfolioItems.ts`,
      `createPortfolioComposables.ts`
- [x] Delete `Gallery/Card.vue`, `Gallery/AmbientImage.vue`, `Blog/Card.vue`, `Portfolio/Card.vue`,
      `NuxtContent/Renderer.vue`
- [x] Build generic `useCollectionItems`; migrate `useBlogPosts`/`useGalleryItems`/
      `Portfolio/List.vue` onto it
- [x] Add `Blog/Page.vue` + `Blog/ItemPage.vue`; wire `/blog` + `/portfolio` playground routes
- [x] Fix `content.vue`'s stale "provides default pages... out of the box" claim

Tier 3 is fully closed — nothing left open.

## Not yet covered

Tiers 4 (Data), 5 (Motion), 6 (Render), 7 (Delivery), and the Tier sub-layer/toggle mechanism
design are separate passes.
