# kmcom-nuxt-layers Peer Dependency Update

This is the upstream handoff for the `pnpm peers check` warning that is actually owned by `kmcom-nuxt-layers@2.6.0`.

## Required fix

### `@nuxt/scripts` peer range is stale

**Consumer evidence**

In this frontend repo:

- `@nuxt/scripts` is installed at `^1.3.1`
- `kmcom-nuxt-layers` is installed at `2.6.0`
- `pnpm peers check` reports:

```text
✕ unmet peer @nuxt/scripts
  Installed: 1.3.1
  Wanted:
    ^0.11.0:
      kmcom-nuxt-layers@2.6.0
```

**Current package metadata**

The published `kmcom-nuxt-layers@2.6.0` peer range still declares:

```json
"peerDependencies": {
  "@nuxt/scripts": "^0.11.0"
}
```

That range no longer matches the version this consumer is using successfully.

**Fix**

Update the root `package.json` in `kmcom-nuxt-layers` to widen the peer range for `@nuxt/scripts`.

Suggested change:

```json
// BEFORE
"peerDependencies": {
  "@nuxt/scripts": "^0.11.0"
}

// AFTER
"peerDependencies": {
  "@nuxt/scripts": "^0.11.0 || ^1.0.0"
}
```

If the package is only intended to support the current Nuxt Scripts major, this is also reasonable:

```json
"peerDependencies": {
  "@nuxt/scripts": "^1.3.0"
}
```

The broader range is safer if you want to avoid breaking older consumers unnecessarily.

## Why this should be fixed upstream

This is not a local KMCOM frontend bug. The app is already pinned to:

- `nuxt@4.4.8`
- `@nuxt/scripts@^1.3.1`
- `kmcom-nuxt-layers@2.6.0`

The peer warning is being produced by the published `kmcom-nuxt-layers` metadata, not by an invalid local install command or lockfile corruption.

## Not part of this package fix

The other peer warnings from the same `pnpm peers check` run do not currently point to `kmcom-nuxt-layers` metadata:

- `vite ^8.0.0-0` comes from `vite-plugin-inspect@12.0.0-beta.3` through `@nuxt/devtools@4.0.0-alpha.7`
- `@opentelemetry/api ~1.8.0` comes from Netlify packages
- `prettier-plugin-tailwindcss ^0.7` comes from `prettier-plugin-tailwind-styled-components`
- `unhead ^3.1.4` comes from `@unhead/bundler` in the SEO toolchain

Those can be evaluated separately. The `kmcom-nuxt-layers` action item from this report is the stale `@nuxt/scripts` peer range.

## Verification

After updating and publishing `kmcom-nuxt-layers`:

1. Bump the package in this frontend repo.
2. Run `pnpm install`.
3. Run `pnpm peers check`.
4. Confirm the `@nuxt/scripts` warning for `kmcom-nuxt-layers` is gone.
