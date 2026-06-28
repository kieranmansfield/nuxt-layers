# Stage 1 — Changes to `kmcom-nuxt-layers`

## Scope

Only **generic, cross-project infrastructure** lands here. Chronos's domain (the chronology engine, reading-order UI, franchise content) does **not** — that stays in the Chronos repo (Stage 3). The bar for this repo is: *would any future app I build reuse this?* Two new layers clear that bar:

```txt
layers/database   Drizzle + Neon Postgres connection, useDrizzle() helper, env config
layers/auth       nuxt-auth-utils + GitHub OAuth, session utilities
```

Both follow the existing layer conventions exactly: `kmcom-layer-<name>` package, `main: ./nuxt.config.ts`, `$meta.name`, explicit `extends: ['../core']`, `#layers/<name>` alias, `app/` + `server/` split, `.playground/`, catalog-pinned deps, and `runtimeConfig`/`app.config` augmentation in-file.

Neither layer owns application tables. They are storage-agnostic infrastructure: the **consuming app owns its schema and migrations**. This keeps them reusable and keeps `auth` and `database` independent of each other.

---

## New layer: `database`

Package `kmcom-layer-database`. Mirrors the `mailer` pattern — a service layer that reads `runtimeConfig` at call time and exposes server utilities.

```txt
layers/database/
├── nuxt.config.ts            $meta, extends ['../core'], alias, runtimeConfig + augmentation
├── package.json             kmcom-layer-database; deps: drizzle-orm, @neondatabase/serverless
├── server/
│   └── utils/
│       ├── sql.ts           useSql()  → neon client from runtimeConfig
│       └── drizzle.ts       useDrizzle(schema) → drizzle instance (schema app-provided)
├── tsconfig.json
└── .playground/
```

`nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  $meta: { name: 'database' },
  extends: ['../core'],
  alias: { '#layers/database': import.meta.dirname },
  runtimeConfig: {
    databaseLayer: {
      url: '', // env: NUXT_DATABASE_LAYER_URL  (Neon connection string)
    },
  },
  compatibilityDate: '2026-06-28',
})

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    databaseLayer?: { url: string }
  }
}
```

`server/utils/sql.ts` and `server/utils/drizzle.ts` (read config at call time, not module init):

```ts
// sql.ts
import { neon } from '@neondatabase/serverless'
export function useSql() {
  const { databaseLayer } = useRuntimeConfig()
  if (!databaseLayer?.url) throw createError('Database URL not configured')
  return neon(databaseLayer.url)
}

// drizzle.ts — schema is supplied by the consuming app, keeping the layer generic
import { drizzle } from 'drizzle-orm/neon-http'
export function useDrizzle<TSchema extends Record<string, unknown>>(schema: TSchema) {
  return drizzle(useSql(), { schema })
}
```

Notes:

```txt
- Neon's @neondatabase/serverless HTTP driver is the right choice on Netlify Functions
  (no pooling/SSL config, works over HTTP). Use drizzle-orm/neon-http.
- This is the APP-DATA database. It is unrelated to the content layer's better-sqlite3,
  which backs @nuxt/content. Both coexist; different concerns.
- Migrations live in the consuming app (drizzle-kit + app-owned schema + migration dir),
  not in this layer. See Stage 2.
- CONTRACT: the connection env var is NUXT_DATABASE_LAYER_URL (= runtimeConfig.databaseLayer.url).
  Stage 2's drizzle.config.ts and .env.example depend on this exact name — keep it stable.
```

How apps consume this layer is app-side, not the layer's concern: the boilerplate registers it via its `LAYER_ORDER` + `layers.config.ts` addon-toggle system (default off), not bare `extends` strings. The layer stays agnostic to that.

Catalog additions (`pnpm-workspace.yaml`):

```txt
drizzle-orm: ^0.x            # latest stable
@neondatabase/serverless: ^1.x
drizzle-kit: ^0.x           # dev-only; used by consuming apps for migrations
```

---

## New layer: `auth`

Package `kmcom-layer-auth`. Wraps `nuxt-auth-utils` and ships a GitHub OAuth handler. Storage-agnostic: sealed-cookie sessions, no user table of its own.

```txt
layers/auth/
├── nuxt.config.ts            $meta, extends ['../core'], modules: ['nuxt-auth-utils'],
│                             alias, runtimeConfig (session + oauth) + augmentation
├── package.json             kmcom-layer-auth; deps: nuxt-auth-utils
├── server/
│   └── routes/auth/
│       └── github.get.ts    defineOAuthGitHubEventHandler → setUserSession
├── app/
│   └── middleware/
│       └── auth.ts          opt-in named route middleware (redirects if no session)
├── tsconfig.json
└── .playground/
```

`nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  $meta: { name: 'auth' },
  extends: ['../core'],
  modules: ['nuxt-auth-utils'],
  alias: { '#layers/auth': import.meta.dirname },
  runtimeConfig: {
    // nuxt-auth-utils reads these env vars automatically:
    session: { password: '' },          // env: NUXT_SESSION_PASSWORD
    oauth: {
      github: {
        clientId: '',                    // env: NUXT_OAUTH_GITHUB_CLIENT_ID
        clientSecret: '',                // env: NUXT_OAUTH_GITHUB_CLIENT_SECRET
      },
    },
  },
  compatibilityDate: '2026-06-28',
})
```

`server/routes/auth/github.get.ts`:

```ts
export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: { provider: 'github', providerId: user.id, username: user.login, avatarUrl: user.avatar_url },
    })
    return sendRedirect(event, '/')
  },
})
```

`app/middleware/auth.ts` (opt-in — apps add `definePageMeta({ middleware: 'auth' })`):

```ts
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value) return navigateTo('/auth/github')
})
```

Notes:

```txt
- nuxt-auth-utils auto-imports useUserSession(), setUserSession(), requireUserSession(),
  and the defineOAuth*EventHandler helpers. No re-export needed.
- Persisting a users row (to attach data like Chronos orders) is the APP's job, done via
  the database layer. Keeping that out of this layer is what makes it reusable.
- Add Google / email providers later by adding handlers + runtimeConfig — no API change.
```

Catalog addition:

```txt
nuxt-auth-utils: ^0.x        # latest stable
```

---

## Cross-layer contract: root `types/`

The session user shape is shared by the `auth` layer and every consuming app, so per the repo's types rule (2+ consumers → root `types/`) it becomes a contract.

```ts
// types/auth.ts
export type SessionUser = {
  provider: 'github'
  providerId: string
  username: string
  avatarUrl?: string
}
```

Add to the `types/index.ts` barrel:

```ts
export type { SessionUser } from './auth'
```

---

## Registration checklist (the wiring)

```txt
pnpm-workspace.yaml            catalog: + drizzle-orm, @neondatabase/serverless,
                               drizzle-kit, nuxt-auth-utils
apps/playground/nuxt.config.ts AVAILABLE_LAYERS:   + 'database', 'auth'
                               LAYER_PATHS:        + database, auth → '../../layers/<name>'
                               LAYER_DEPENDENCIES: database: ['core'], auth: ['core']
.claude/rules/nuxt-layers.md   add both rows to the "All Layers" table + dependency graph
CLAUDE.md                      add both to the Architecture tree + Layer Dependency Graph
docs/ARCHITECTURE.md           add both to the structure + Layer Details table
README.md                      add both to the Layers table
types/index.ts                 + SessionUser export
package.json (root)            optional dev scripts: dev:database, dev:auth (match pattern)
```

Dependency graph delta:

```txt
database → core
auth     → core
```

---

## Subtree note

Existing layers are git subtrees from upstream `kmcom-layer-*` repos. Two clean options:

```txt
A. Create kmcom-layer-database and kmcom-layer-auth upstreams now, add as subtrees.
B. Build both in-monorepo first; `git subtree split` to fresh upstreams later.
```

B is lower friction and doesn't block Chronos. Split once the layers stabilise.

---

## Out of scope for this stage (explicit)

```txt
✗ chronology engine        → Stage 3 (packages/@chronos/engine in the Chronos repo)
✗ reading-order UI / domain → Stage 3 (apps/web in the Chronos repo)
✗ franchise content packs   → Stage 3 (Chronos content/)
✗ app users/orders schema   → Stage 2 boilerplate pattern + Stage 3 Chronos tables
```

## Build order

```txt
1. Catalog entries
2. database layer + .playground smoke test (PLAYGROUND_LAYERS=core,database)
3. auth layer + .playground (real GitHub OAuth app for testing)
4. types/auth.ts contract
5. Playground registration + docs/rules/README updates
```
