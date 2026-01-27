# CLAUDE.md - layer-core

> Foundation layer for the Nuxt Layer System - provides essential app bootstrap, error handling, feature detection, and loading states.

---

## Overview

`layer-core` is the foundation layer that every project must extend. It provides:

- ✅ Safe app initialization and module registration
- ✅ Global error handling and boundaries
- ✅ Feature & capability detection (CSS, JS, PWA)
- ✅ Device, browser, and network detection
- ✅ Loading states and screens
- ✅ Rendering mode detection
- ✅ Environment validation
- ✅ Core types and utilities

**Philosophy:** Keep it minimal - only what's needed to boot safely and provide a foundation for other layers.

---

## Architecture

### Dependency Graph

```
layer-core (no dependencies)
    ↓
  Other layers extend core
```

### File Structure

```
layer-core/
├── app/
│   ├── pages/
│   │   └── [...slug].vue              # 404 catch-all
│   ├── plugins/
│   │   ├── init.ts                    # App initialization
│   │   ├── error-handler.ts           # Global error handler
│   │   ├── feature-detection.client.ts # Feature detection
│   │   └── loading.client.ts          # Loading system setup
│   ├── composables/
│   │   ├── useEnv.ts                  # Environment access
│   │   ├── useErrorLog.ts             # Error logging
│   │   ├── useFeatures.ts             # CSS/JS feature flags
│   │   ├── useDevice.ts               # Device detection
│   │   ├── useBrowser.ts              # Browser detection
│   │   ├── useScreen.ts               # Screen size/orientation
│   │   ├── useNetworkInfo.ts          # Network speed/status
│   │   ├── useRendering.ts            # Render mode detection
│   │   ├── usePWAInfo.ts                  # PWA state & install
│   │   ├── useCache.ts                # Cache management
│   │   └── useLoading.ts              # Loading state
│   ├── components/
│   │   ├── ErrorBoundary.vue          # Error boundary wrapper
│   │   └── LoadingScreen.vue          # Global loading overlay
│   ├── types/
│   │   ├── index.ts                   # Base types
│   │   ├── runtime-config.ts          # Config types
│   │   └── detection.ts               # Detection types
│   └── utils/
│       ├── validate-env.ts            # Env validation (Zod)
│       └── helpers.ts                 # Core utilities
├── error.vue                          # Fatal error page (500)
├── nuxt.config.ts                     # Layer config
├── app.config.ts                      # App config defaults
├── package.json
├── README.md
└── CLAUDE.md                          # This file
```

---

## Key Concepts

### 1. Error Handling Strategy

**Two-tier approach:**

- **`pages/[...slug].vue`** → 404s (route not found)
  - User navigates to non-existent page
  - Clean, styled 404 with suggestions
  
- **`error.vue`** → Fatal errors (500s, crashes)
  - Unhandled exceptions
  - SSR failures
  - Last resort boundary

**Component-level:**
- `<ErrorBoundary>` wraps components to catch errors without crashing entire app
- Errors logged via `useErrorLog()` (can integrate external services)

### 2. Feature Detection

**Leverages VueUse** for most detection to avoid reinventing the wheel.

**Detects:**
- **CSS Features:** Grid, Subgrid, Container Queries, :has(), aspect-ratio, logical properties, backdrop-filter, etc.
- **JS APIs:** IntersectionObserver, ResizeObserver, Service Workers, WebGL
- **User Preferences:** Reduced motion, dark mode, high contrast, data saver
- **Image Formats:** WebP, AVIF

**Storage:** SessionStorage (fresh each session, auto-clears)

**Usage:**
```typescript
const { grid, subgrid, containerQueries } = useFeatures()

if (!subgrid) {
  // Use fallback layout
}
```

**CSS Classes:** Automatically adds classes to `<html>`:
```html
<html class="supports-grid supports-subgrid no-container-queries">
```

### 3. Device/Browser/Network Detection

**All powered by VueUse:**

```typescript
// Device
const { isMobile, isTablet, isDesktop, isIOS, isAndroid } = useDevice()

// Browser
const { isChrome, isSafari, isFirefox, version } = useBrowser()

// Screen
const { breakpoint, isRetina, orientation } = useScreen()

// Network
const { isOnline, connectionType, isSlow, isFast, saveData } = useNetworkInfo()
```

**Adaptive Loading Pattern:**
```typescript
const { isMobile } = useDevice()
const { isSlow, saveData } = useNetworkInfo()

const shouldLoadHeavyAssets = computed(() => {
  return !isMobile && !isSlow && !saveData
})
```

### 4. PWA & Service Workers

**Auto-update flow:**
1. New version deployed
2. Service worker checks for updates (every hour or on page load)
3. `needRefresh` becomes `true`
4. User sees update prompt
5. Clicks "Update" → `updateServiceWorker()` → page reloads

**Usage:**
```typescript
const { 
  isInstalled,        // Is PWA installed?
  canInstall,         // Can show install prompt?
  install,            // Trigger install prompt
  needRefresh,        // Update available?
  updateServiceWorker // Install update
} = usePWAInfo()
```

**Cache Management:**
```typescript
const {
  isOnline,
  offlineReady,
  isCached,
  clearCache,
  getCacheSize
} = useCache()
```

### 5. Rendering Mode Detection

**What it detects:**
- SSR (Server-Side Rendering) - HTML generated on every request
- SSG (Static Site Generation) - HTML pre-built at build time
- CSR (Client-Side Rendering) - SPA, no server HTML
- Hybrid - Mix of above per route

**Usage:**
```typescript
const { 
  mode,          // 'ssr' | 'ssg' | 'csr' | 'hybrid'
  isServer,      // Running on Node.js?
  isClient,      // Running in browser?
  isHydrating,   // Vue taking control?
  isHydrated     // Page interactive?
} = useRendering()
```

**Primary use cases:**
- Avoiding hydration mismatches
- Conditional rendering (server vs client)
- Debugging
- Wait for hydration before interactions

**Important:** This **detects** the mode used, it does NOT choose the mode. Nuxt chooses mode per-route via `routeRules` in `nuxt.config.ts`.

### 6. Loading System

**Purpose:** Display a loading screen during **initial app load only**. Page transitions use Nuxt's built-in `useLoadingIndicator()`.

**Architecture:**
- No Pinia dependency (uses simple Vue refs)
- Simulated progress (0→90% auto, waits at 90, then jumps to 100 on completion)
- Shared state across all component instances (singleton pattern)
- Can be disabled via app.config
- Component can be replaced by projects

**Basic usage:**
```typescript
const {
  isLoading,      // Ref<boolean> - Current loading state
  progress,       // Ref<number> - Progress percentage (0-100)
  startLoading,   // () => void - Start simulated progress
  stopLoading,    // () => void - Jump to 100% and finish
  updateProgress, // (value: number) => void - Manual progress update
  withLoading     // (fn: () => Promise<void>) => Promise<void> - Wrapper
} = useLoading()

// Manual control
startLoading()
await fetchData()
stopLoading()
```

**Async wrapper:**
```typescript
const { withLoading } = useLoading()

await withLoading(async () => {
  // Your async operation
  await fetchData()
  await processData()
})
```

**Configuration via app.config:**
```typescript
export default defineAppConfig({
  coreLayer: {
    loading: {
      enabled: true,           // Master toggle
      minDuration: 500,        // Min time to show (prevents flash)
      maxDuration: 3000,       // Max simulated progress time
      background: '#0a0a0a',   // Background color
      textColor: '#ffffff',    // Progress text color
      zIndex: 10000,           // Stack order
    }
  }
})
```

**Disabling:**
```typescript
// In your project's app.config.ts
export default defineAppConfig({
  coreLayer: {
    loading: {
      enabled: false  // Completely disable loading screen
    }
  }
})
```

**Custom loading screen:**
Projects can replace the component entirely by creating their own `app/components/LoadingScreen.vue`:

```vue
<script setup>
const { progress } = useLoading()
const config = useAppConfig()
</script>

<template>
  <div class="custom-loader">
    <img :src="config.myApp.logo" alt="Loading" />
    <div class="progress-bar" :style="{ width: `${progress}%` }" />
  </div>
</template>
```

**Important notes:**
- Loading screen is for **initial app load only**
- For page transitions, use Nuxt's `useLoadingIndicator()`
- The composable works without the UI component (headless)
- Progress is simulated, not based on real resource loading
- Component automatically hides after reaching 100% + minDuration

### 7. Environment Management

**Type-safe runtime config access:**
```typescript
const env = useEnv()

// All typed and validated
const apiUrl = env.public.apiUrl
const secretKey = env.secretKey
```

**Validation with Zod:**
```typescript
// utils/validate-env.ts
import { z } from 'zod'

const envSchema = z.object({
  public: z.object({
    apiUrl: z.string().url(),
    appName: z.string(),
  }),
  secretKey: z.string().min(32),
})

export function validateEnv(config: any) {
  return envSchema.parse(config)
}
```

---

## Usage Patterns

### Adaptive Content Loading

```vue
<script setup>
const { isMobile } = useDevice()
const { isSlow, saveData } = useNetworkInfo()
const { shouldLoadHeavy } = useAdaptiveLoading()

const imageQuality = computed(() => {
  if (isMobile || isSlow || saveData) return 60
  return 90
})
</script>

<template>
  <!-- High-quality for desktop/fast connections -->
  <NuxtImg
    v-if="shouldLoadHeavy"
    src="/hero-4k.jpg"
    :quality="90"
  />
  
  <!-- Optimized for mobile/slow connections -->
  <NuxtImg
    v-else
    src="/hero-mobile.jpg"
    :quality="imageQuality"
  />
</template>
```

### Progressive Enhancement

```vue
<script setup>
const { subgrid, containerQueries } = useFeatures()
</script>

<template>
  <!-- Use modern layout if supported -->
  <div v-if="subgrid" class="grid-modern">
    <div class="subgrid-child">...</div>
  </div>
  
  <!-- Fallback for older browsers -->
  <div v-else class="grid-fallback">
    <div class="flex-child">...</div>
  </div>
</template>
```

### Error Boundaries

```vue
<template>
  <ErrorBoundary>
    <template #default>
      <RiskyComponent />
    </template>
    
    <template #error="{ error, retry }">
      <div class="error-state">
        <p>Something went wrong: {{ error.message }}</p>
        <button @click="retry">Try Again</button>
      </div>
    </template>
  </ErrorBoundary>
</template>
```

### Loading States

**Note:** The `LoadingScreen` component is automatically shown during initial app load. You can also use `useLoading()` for custom loading states.

```vue
<script setup>
const { isLoading, withLoading } = useLoading()

async function handleSubmit() {
  await withLoading(async () => {
    await submitForm()
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <button :disabled="isLoading">
      {{ isLoading ? 'Submitting...' : 'Submit' }}
    </button>
  </form>
</template>
```

**Alternative with manual control:**
```vue
<script setup>
const { isLoading, startLoading, stopLoading } = useLoading()

async function handleSubmit() {
  startLoading()
  try {
    await submitForm()
  } finally {
    stopLoading()
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <button :disabled="isLoading">
      {{ isLoading ? 'Submitting...' : 'Submit' }}
    </button>
  </form>
</template>
```

### PWA Install & Update

```vue
<script setup>
const { 
  canInstall, 
  install, 
  needRefresh, 
  updateServiceWorker 
} = usePWAInfo()
</script>

<template>
  <!-- Install prompt -->
  <button v-if="canInstall" @click="install">
    Install App
  </button>
  
  <!-- Update banner -->
  <div v-if="needRefresh" class="update-banner">
    <p>New version available!</p>
    <button @click="updateServiceWorker()">
      Update Now
    </button>
  </div>
</template>
```

### Hydration-Safe Rendering

```vue
<script setup>
const { isHydrated, isClient, isServer } = useRendering()
</script>

<template>
  <!-- Server-only (never sent to client) -->
  <div v-if="isServer">
    Pre-rendered at {{ new Date().toISOString() }}
  </div>
  
  <!-- Client-only (avoid hydration mismatch) -->
  <ClientOnly>
    <div>Current time: {{ Date.now() }}</div>
  </ClientOnly>
  
  <!-- Wait for hydration before interactive elements -->
  <button :disabled="!isHydrated">
    {{ isHydrated ? 'Click me' : 'Loading...' }}
  </button>
</template>
```

---

## Configuration

### Nuxt Config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],
  
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'App Name',
      short_name: 'App',
      theme_color: '#ffffff',
      icons: [/* ... */],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
  },
  
  runtimeConfig: {
    // Server-only
    secretKey: process.env.SECRET_KEY,
    
    // Exposed to client
    public: {
      apiUrl: process.env.API_URL || 'https://api.example.com',
      appName: 'My App',
    }
  },
})
```

### App Config

```typescript
// app.config.ts
export default defineAppConfig({
  coreLayer: {
    // Loading screen (initial app load only)
    loading: {
      enabled: true,
      minDuration: 500,        // Min time to show (prevents flash)
      maxDuration: 3000,       // Max simulated progress time
      background: '#0a0a0a',   // Background color
      textColor: '#ffffff',    // Progress text color
      zIndex: 10000,           // Stack order
    },

    // Error handling
    errors: {
      logToConsole: true,
      logToExternal: false,
      externalUrl: '',
      externalToken: '',
    },
  }
})
```

---

## Dependencies

### Required
- `@nuxt/ui` - UI framework
- `@vueuse/core` - Utility composables
- `@vueuse/nuxt` - Nuxt integration
- `@vite-pwa/nuxt` - PWA support
- `zod` - Runtime validation

### Peer Dependencies
- `nuxt` >= 3.10.0
- `vue` >= 3.4.0

---

## Environment Variables

```bash
# .env.example

# API Configuration
API_URL=https://api.example.com

# Server-only secrets
SECRET_KEY=your-secret-key-min-32-chars

# Optional: Error logging
ERROR_LOG_URL=
ERROR_LOG_TOKEN=
```

---

## Testing Strategy

### Feature Detection
```typescript
// In tests, mock window.CSS.supports
vi.mock('window', () => ({
  CSS: {
    supports: vi.fn((prop, value) => {
      if (prop === 'display' && value === 'grid') return true
      if (prop === 'grid-template-columns' && value === 'subgrid') return false
      return false
    })
  }
}))
```

### Error Boundaries
```typescript
// Test that errors are caught
const { wrapper } = mount(ErrorBoundary, {
  slots: {
    default: ThrowingComponent
  }
})

expect(wrapper.find('.error-state').exists()).toBe(true)
```

---

## Best Practices

### ✅ Do
- Use VueUse composables instead of custom implementations
- Store detection results in sessionStorage (fresh each session)
- Add feature classes to `<html>` for CSS progressive enhancement
- Use `<ClientOnly>` for client-specific content
- Wait for `isHydrated` before interactive elements
- Leverage adaptive loading based on device/network
- Provide fallbacks for unsupported features

### ❌ Don't
- Don't use localStorage for detection (can get stale)
- Don't assume all features are supported
- Don't render different content on server vs client (hydration mismatch)
- Don't include polyfills in core (let consuming projects decide)
- Don't make core opinionated (keep it minimal)
- Don't detect features that VueUse already provides

---

## Extending Layer-Core

Other layers should extend core:

```typescript
// layer-ui/nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    'github:kieranmansfield/layer-core'
  ]
})
```

Projects extend the full stack:

```typescript
// project/nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    'github:kieranmansfield/layer-core',
    'github:kieranmansfield/layer-ui',
    // ... other layers
  ]
})
```

---

## Troubleshooting

### Service Worker Not Updating
- Check service worker is registered in DevTools
- Force update: DevTools → Application → Service Workers → Update
- Clear cache and hard reload

### Feature Detection Returning Wrong Results
- Check sessionStorage is enabled
- Verify `CSS.supports()` is available
- Test in incognito to rule out cached results

### Hydration Mismatches
- Use `<ClientOnly>` for client-specific content
- Wait for `isHydrated` before rendering dynamic data
- Avoid `Date.now()`, `Math.random()` in SSR templates

### Loading Screen Not Showing
- Check `coreLayer.loading.enabled` in app.config (must be `true` or omitted)
- Verify the loading plugin is running (check browser console for errors)
- Ensure LoadingScreen component is in `app.vue`
- Check that `app:mounted` hook is firing (browser DevTools)
- Try disabling browser extensions that might block fixed positioning

---

## Contributing

When adding new features to core:

1. **Keep it minimal** - Does it belong in core or another layer?
2. **Use VueUse first** - Don't reinvent the wheel
3. **Type everything** - Full TypeScript support
4. **Session storage** - For detection results
5. **Document thoroughly** - Update this CLAUDE.md

---

## Version History

- **v1.0.0** - Initial release
  - App initialization
  - Error handling
  - Feature detection
  - Device/browser/network detection
  - PWA support
  - Loading system
  - Rendering mode detection
  - Environment validation

---

## Related Documentation

- [Nuxt Layers](https://nuxt.com/docs/guide/going-further/layers)
- [VueUse Documentation](https://vueuse.org/)
- [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt.html)
- [Nuxt UI](https://ui.nuxt.com/)
