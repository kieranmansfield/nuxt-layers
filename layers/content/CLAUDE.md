# Content Layer

Nuxt Content v3 collections and components (blog, portfolio, gallery, pages).

## Consumer apps must define their own collections

`@nuxt/content` loads `content.config.ts` from every layer and merges collections by name, but a
collection's `source` is rooted at the layer that defined it (`collection.__rootDir`). This layer's
collections therefore look in `layers/content/content/**`, which is empty. Only a collection
declared in the app itself reads the app's `content/` folder. The app's `content.config.ts` is not
duplication — it is required (see `docs/adr/0002-content-config-is-app-owned.md`).

Copy this into the app's `content.config.ts`:

```ts
import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({ type: 'page', source: 'pages/**/*.md' }),
    blog: defineCollection({ type: 'page', source: 'blog/**/*.md' }),
    portfolio: defineCollection({ type: 'page', source: 'portfolio/**/*.md' }),
    gallery: defineCollection({ type: 'page', source: 'gallery/**/*.md' }),
  },
})
```

**Never pass `schema:` to `defineCollection`.** c12 loads each config through jiti with
`moduleCache: false`, so zod validators are never initialized and the call throws. The schema
objects exported from this layer's `content.config.ts` exist for type inference only;
`app/types/collections.d.ts` types the frontmatter and must be kept in sync with them.

## Nuxt Studio

`nuxt-studio` is an optional peer dependency. This layer adds it to `modules` whenever the app has
it installed, in dev and production alike, so the app doesn't need to list it (listing it as well is
harmless: Nuxt installs a module once per name).

- **Dev (`nuxt dev`)**: Studio opens on every page with no login and writes straight to the app's
  `content/` and `public/` folders.
- **Production**: needs a server (`nuxt build`, not `nuxt generate`) for the OAuth callback at
  `/__nuxt_studio/auth/github`. The app sets `studio.repository` (owner/repo/branch, plus `rootDir`
  if the app isn't at the repo root) and supplies `STUDIO_GITHUB_CLIENT_ID` /
  `STUDIO_GITHUB_CLIENT_SECRET` at runtime. Logging in is `Cmd/Ctrl + .` or visiting `/_studio`.
- **Opting out of production editing**: set `$production: { studio: false }` in the app's
  `nuxt.config.ts` — Nuxt skips any module whose config key is `false`. The playground does this.

Studio builds its frontmatter forms from each collection's schema; a collection without one is
edited as raw YAML. That interacts with the `schema:` caveat above.

## Comark formatting

Studio (1.8+) reads and writes markdown through [Comark](https://comark.dev), the successor to
MDC. Nuxt Content still renders through `@nuxtjs/mdc`; the syntax is the same, only the formatting
differs. When a file isn't in Comark's canonical form, Studio shows "Comark formatting available"
(production) or silently rewrites the file on open (dev), and the first edit reformats the whole
file.

- **`pnpm content:format`** (root: the playground's content; in an app:
  `node <this layer>/scripts/format-content.mjs content`) rewrites files into exactly what Studio
  emits; `content:format:check` fails on any that aren't. `pnpm check` and CI run the check.
- The script loads comark through the installed `nuxt-studio`, so it always matches that Studio
  version. Its parse/render options mirror Studio's `documentFromMarkdownContent` /
  `contentFromMarkdownDocument`, plus a key sort on attributes (Studio renders from the stored
  Content document, whose props come back sorted). Re-check it against Studio after a Studio bump:
  open a file in dev and `git diff` — Studio writes its own output to disk.
- **oxfmt must not touch content markdown** — `vite.config.ts` ignores `**/content/**/*.md`. oxfmt
  doesn't know component syntax: it reads `::name` + `---` (a YAML props block) as a setext heading
  and rewrites it as `## ::name` plus a horizontal rule, breaking the component.
- Comark needs js-yaml 5. Don't widen the `js-yaml` override in `pnpm-workspace.yaml` back to all
  versions — forcing 4.x breaks Studio's editor (`mergeTag` export missing).

## `::` components

Plain markdown by default. `::` components are for things markdown can't express, and Studio's
slash menu offers only a curated set (`studioComponentGroups` in `nuxt.config.ts`): callouts
(callout/note/tip/warning/caution), card/card-group, steps, tabs/tabs-item, code-group, and
`Figure`. Everything else still renders and stays editable in existing content.

- Component names are public API for content — renaming one breaks every file that uses it.
- Components in `app/components/content/` are marked global (a `components:extend` hook), since
  Studio only lists global components. To offer one in Studio, add its PascalCase name (as
  nuxt-component-meta reports it, e.g. `ProseTip`, `Figure`) to a group; an app can override the
  groups through its own `studio.editor.components`.
- Add new rows to `docs/component-levels.md` as usual.
