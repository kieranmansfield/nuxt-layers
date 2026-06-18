import { fileURLToPath } from 'node:url'
import { toRaw } from 'vue'
import { defineVitestProject } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const nuxtRootDir = fileURLToPath(new URL('./apps/playground', import.meta.url))

function cloneSerializable<T>(value: T, seen = new WeakMap<object, unknown>()): T {
  if (value === null || typeof value !== 'object') {
    return value
  }

  const raw = toRaw(value as object) as T
  if (raw === null || typeof raw !== 'object') {
    return raw
  }

  if (seen.has(raw as object)) {
    return seen.get(raw as object) as T
  }

  if (Array.isArray(raw)) {
    const clone: unknown[] = []
    seen.set(raw as object, clone)

    for (const item of raw) {
      clone.push(cloneSerializable(item, seen))
    }

    return clone as T
  }

  if (raw instanceof Date) {
    return new Date(raw) as T
  }

  if (raw instanceof RegExp) {
    return new RegExp(raw) as T
  }

  if (raw instanceof Map) {
    const clone = new Map()
    seen.set(raw as object, clone)

    for (const [key, entry] of raw) {
      clone.set(cloneSerializable(key, seen), cloneSerializable(entry, seen))
    }

    return clone as T
  }

  if (raw instanceof Set) {
    const clone = new Set()
    seen.set(raw as object, clone)

    for (const entry of raw) {
      clone.add(cloneSerializable(entry, seen))
    }

    return clone as T
  }

  const clone: Record<string, unknown> = {}
  seen.set(raw as object, clone)

  for (const key of Reflect.ownKeys(raw as object)) {
    if (typeof key === 'symbol') {
      continue
    }

    const descriptor = Object.getOwnPropertyDescriptor(raw as object, key)
    if (descriptor?.enumerable) {
      clone[key] = cloneSerializable((raw as Record<string, unknown>)[key], seen)
    }
  }

  return clone as T
}

async function withStructuredCloneFallback<T>(callback: () => Promise<T>): Promise<T> {
  const originalStructuredClone = globalThis.structuredClone

  globalThis.structuredClone = ((...args: Parameters<typeof originalStructuredClone>) => {
    try {
      return originalStructuredClone(...args)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'DataCloneError') {
        return cloneSerializable(args[0])
      }

      throw error
    }
  }) as typeof structuredClone

  try {
    const resolved = cloneSerializable(await callback())

    if (
      resolved &&
      typeof resolved === 'object' &&
      'plugins' in resolved &&
      Array.isArray((resolved as { plugins?: unknown[] }).plugins)
    ) {
      ;(resolved as { plugins: unknown[] }).plugins = (resolved as { plugins: unknown[] }).plugins
        .flat(Infinity)
        .filter(
          (plugin): plugin is { name: string } =>
            Boolean(plugin) &&
            typeof plugin === 'object' &&
            typeof (plugin as { name?: unknown }).name === 'string'
        )
    }

    return resolved
  } finally {
    globalThis.structuredClone = originalStructuredClone
  }
}

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['layers/**/*.test.ts', 'layers/**/*.spec.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'vitest',
          include: ['tests/vitest/**/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      {
        plugins: [vue()],
        test: {
          name: 'vue',
          include: ['tests/vue/**/*.{test,spec}.ts'],
          environment: 'happy-dom',
        },
      },
      await withStructuredCloneFallback(() =>
        defineVitestProject({
          test: {
            name: 'nuxt',
            include: ['tests/nuxt/**/*.{test,spec}.ts'],
            hookTimeout: 30000,
            environmentOptions: {
              nuxt: {
                rootDir: nuxtRootDir,
                domEnvironment: 'happy-dom',
              },
            },
          },
        })
      ),
    ],
  },
})
