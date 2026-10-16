# Peer Dependency Mismatches

## Context

Checked on 2026-10-16 against the `KMCOMv5/frontend` consumer after upgrading its dependencies. `pnpm peers check` reports four unmet peers from `kmcom-nuxt-layers@5.0.0`:

| Package          | Consumer version | Current layer peer range | Suggested supported majors, after testing |
| ---------------- | ---------------- | ------------------------ | ----------------------------------------- |
| `@nuxtjs/seo`    | `6.0.1`          | `^5.0.0`                 | 5 and 6                                   |
| `@vueuse/nuxt`   | `15.0.0`         | `^14.3.0`                | 14 and 15                                 |
| `better-sqlite3` | `13.0.3`         | `^12.10.0`               | 12 and 13                                 |
| `pinia`          | `4.1.0`          | `^3.0.4`                 | 3 and 4                                   |

Suggested `peerDependencies` values:

```json
{
  "@nuxtjs/seo": "^5.0.0 || ^6.0.0",
  "@vueuse/nuxt": "^14.3.0 || ^15.0.0",
  "better-sqlite3": "^12.10.0 || ^13.0.0",
  "pinia": "^3.0.4 || ^4.1.0"
}
```

These ranges are proposals, not proof of compatibility. A peer range is a support promise: widen it only after the layer code and tests pass against the new major. `@pinia/nuxt@1.0.3` itself requires `pinia@^4.1.0`, so the consumer's Pinia 4 pairing is intentional.

## Recommended Fix

1. In the layers repo root `package.json`, update the four entries under `peerDependencies` to the proposed ranges above. Keep their existing `peerDependenciesMeta` optional flags; these packages are optional for consumers that do not use those layers.
2. Align the layers repo's development catalog and test dependencies with the versions being claimed. In particular, test Pinia 4 together with `@pinia/nuxt` 1, not the existing Pinia 3 test setup.
3. Run the affected layer checks and tests, then build the playground with the SEO, VueUse, and database layers enabled. Check both the currently supported older majors and the new majors where practical. If an older major is no longer supported, remove it from the range and document the minimum instead of claiming compatibility.
4. Publish a patch release if the change only adds verified compatibility to the existing v5 contract. Use a breaking release if layer APIs or supported behavior must change.
5. In the frontend consumer, reinstall and run `pnpm peers check`. Do not silence these warnings with `allowedVersions` or overrides; those mechanisms do not establish runtime compatibility.

## Separate Transitive Warnings

The same consumer check also reported two warnings that do not come from `kmcom-nuxt-layers`' peer declarations:

| Package      | Installed | Requested by `unctx@3.0.1` |
| ------------ | --------- | -------------------------- |
| `oxc-parser` | `0.139.0` | `>=0.140.0`                |
| `unplugin`   | `2.3.11`  | `^3.3.0`                   |

Trace these with `pnpm why unctx` in the consumer and inspect the resolved dependency chain. Update the dependency that brings in `unctx` or move to a compatible `unctx` release; only use an override after confirming the affected packages support the overridden versions. Keep this investigation separate from the four layer peer-range changes.

## Runtime Note

`@nuxtjs/seo@6.0.1` declares Node support for `^22.22.3 || ^24.15.0 || >=26.0.0`. The frontend check used Node `24.22.0`, which is supported. Consumers on Node 25 or earlier Node 24 releases are outside that declared range and should not be considered covered by this upgrade.
