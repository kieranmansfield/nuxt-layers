# Error Handling Examples

## Overview

The core layer provides comprehensive error handling through:
- **`useErrorLog()`** - Composable for logging errors
- **`<ErrorBoundary>`** - Component for catching errors in child components
- **`error.vue`** - Global error page (500 errors)
- **`pages/[...slug].vue`** - 404 catch-all page
- **`plugins/error-handler.ts`** - Global error handler

---

## Using `useErrorLog()`

### Basic Usage

```vue
<script setup>
const { logError, logWarning, logInfo } = useErrorLog()

async function loadData() {
  try {
    const data = await $fetch('/api/data')
    logInfo('Data loaded successfully', { items: data.length })
  } catch (error) {
    logError(error, {
      context: 'loadData',
      userId: user.value?.id,
    })
  }
}
</script>
```

### Configuration

```typescript
// app.config.ts
export default defineAppConfig({
  coreLayer: {
    errors: {
      // Console logging (dev only by default)
      logToConsole: true,

      // External service logging (production)
      logToExternal: true,
      externalUrl: 'https://api.sentry.io/...',
      externalToken: process.env.SENTRY_TOKEN,
    }
  }
})
```

### Integration with External Services

```typescript
// For Sentry, LogRocket, Rollbar, etc.
// The composable sends errors to externalUrl with this structure:
{
  error: {
    name: 'Error',
    message: 'Something went wrong',
    stack: '...'
  },
  context: {
    route: '/dashboard',
    timestamp: '2026-01-23T...',
    userAgent: 'Mozilla/5.0...',
    userId: '123',
    component: 'DashboardWidget',
    // ... your custom context
  }
}
```

---

## Using `<ErrorBoundary>`

### Basic Usage

```vue
<template>
  <div>
    <h1>My Dashboard</h1>

    <!-- Wrap risky components -->
    <ErrorBoundary component-name="UserWidget">
      <UserWidget />
    </ErrorBoundary>

    <!-- Another protected section -->
    <ErrorBoundary component-name="StatsChart">
      <StatsChart />
    </ErrorBoundary>
  </div>
</template>
```

**Result:** If `<UserWidget>` crashes, only that section shows an error. The rest of the page stays functional.

---

### Custom Error UI

```vue
<template>
  <ErrorBoundary component-name="PaymentForm">
    <PaymentForm />

    <!-- Custom error display -->
    <template #error="{ error, clearError }">
      <div class="payment-error">
        <h3>Payment Error</h3>
        <p>{{ error.message }}</p>
        <button @click="clearError">Try Again</button>
        <button @click="contactSupport">Contact Support</button>
      </div>
    </template>
  </ErrorBoundary>
</template>
```

---

### Hide Error Details in Production

```vue
<template>
  <!-- Show detailed stack trace in dev, hide in production -->
  <ErrorBoundary
    component-name="DataTable"
    :show-details="false"
  >
    <DataTable />
  </ErrorBoundary>
</template>
```

---

### Nested Error Boundaries

```vue
<template>
  <ErrorBoundary component-name="Dashboard">
    <div class="dashboard">
      <!-- If anything crashes here, show dashboard-level error -->

      <ErrorBoundary component-name="Sidebar">
        <Sidebar />
        <!-- Sidebar-specific error handling -->
      </ErrorBoundary>

      <ErrorBoundary component-name="MainContent">
        <MainContent />
        <!-- Main content-specific error handling -->
      </ErrorBoundary>
    </div>
  </ErrorBoundary>
</template>
```

**Benefit:** Errors are caught at the most specific level, minimizing the impact.

---

## Global Error Handler

The `plugins/error-handler.ts` automatically catches:
- Vue component errors
- Nuxt lifecycle errors
- App initialization errors

All errors are automatically logged via `useErrorLog()` with context:

```typescript
// Automatically logged by the plugin:
{
  component: 'MyComponent',
  info: 'Error info',
  type: 'vue-error' | 'nuxt-error' | 'app-error',
  route: '/current/path',
  timestamp: '...',
  userAgent: '...',
}
```

**You don't need to do anything** - it works automatically!

---

## Error Page (`error.vue`)

Handles fatal errors that crash the app:

```vue
<!-- Automatically rendered when fatal error occurs -->
```

**Features:**
- Shows 404 for missing pages (with friendly message)
- Shows 500 for crashes (with "Try Again" button)
- Stack trace in development mode
- "Clear Error" button redirects to home
- Fully styled with Nuxt UI

**You can override it:**
```vue
<!-- Your project's error.vue -->
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <!-- Your custom error page -->
</template>
```

---

## 404 Page (`pages/[...slug].vue`)

Catches all non-existent routes:

```vue
<!-- Automatically rendered for /non-existent-page -->
```

**Configure it:**
```typescript
// app.config.ts
export default defineAppConfig({
  coreLayer: {
    notFound: {
      title: 'Oops!',
      description: 'Page not found',
      suggestions: {
        enabled: true,
        links: [
          { label: 'Home', to: '/', icon: 'i-lucide-home' },
          { label: 'Support', to: '/support', icon: 'i-lucide-help-circle' },
        ]
      }
    }
  }
})
```

---

## Complete Example: E-commerce Product Page

```vue
<script setup>
const { logError } = useErrorLog()
const route = useRoute()

// Fetch product data
const { data: product, error } = await useFetch(`/api/products/${route.params.id}`)

// If product not found, show 404
if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    message: 'Product not found'
  })
}

// Log error if fetch failed
if (error.value) {
  logError(error.value, {
    productId: route.params.id,
    context: 'product-page'
  })
}

async function addToCart() {
  try {
    await $fetch('/api/cart', {
      method: 'POST',
      body: { productId: product.value.id }
    })
  } catch (error) {
    logError(error, { action: 'add-to-cart' })
  }
}
</script>

<template>
  <div>
    <!-- Main product info - crash here = full page error -->
    <ProductHero :product="product" />

    <!-- Reviews section - crash here = just this section errors -->
    <ErrorBoundary component-name="ProductReviews">
      <ProductReviews :product-id="product.id" />
    </ErrorBoundary>

    <!-- Recommendations - crash here = just this section errors -->
    <ErrorBoundary component-name="RelatedProducts">
      <RelatedProducts :category="product.category" />
    </ErrorBoundary>
  </div>
</template>
```

---

## Testing Error Handling

### Trigger a Component Error

```vue
<template>
  <ErrorBoundary>
    <button @click="triggerError">Crash This Component</button>
  </ErrorBoundary>
</template>

<script setup>
function triggerError() {
  throw new Error('Test error!')
}
</script>
```

### Trigger a Fatal Error

```vue
<script setup>
// This will crash the entire app and show error.vue
throw createError({
  statusCode: 500,
  message: 'Database connection failed'
})
</script>
```

### Trigger a 404

```vue
<script setup>
// This will show the 404 page
throw createError({
  statusCode: 404,
  message: 'Resource not found'
})
</script>
```

---

## Best Practices

### ✅ Do

- **Use `<ErrorBoundary>`** around risky components (API calls, third-party widgets)
- **Log errors** with context (user ID, action, route)
- **Test error states** in development
- **Configure external logging** for production
- **Keep error messages user-friendly** (avoid technical jargon)

### ❌ Don't

- **Don't wrap every component** - only risky ones
- **Don't log sensitive data** (passwords, tokens, PII)
- **Don't use `console.error`** - use `useErrorLog()` instead
- **Don't ignore errors** - always handle or log them
- **Don't show stack traces in production** - use `showDetails: false`

---

## Summary

| Feature | Purpose | When to Use |
|---------|---------|-------------|
| `useErrorLog()` | Log errors with context | Everywhere (try/catch blocks) |
| `<ErrorBoundary>` | Catch component errors | Around risky components |
| `error.vue` | Global error page | Automatic (500 errors) |
| `[...slug].vue` | 404 page | Automatic (missing routes) |
| `error-handler.ts` | Global error tracking | Automatic (all errors) |

**Result:** Comprehensive error handling at every level! 🎉

---

# Loading Screen Examples

## Overview

The core layer provides a loading screen system for **initial app load only**:
- **`useLoading()`** - Composable for loading state management
- **`LoadingScreen.vue`** - Visual loading screen component
- **`loading.client.ts`** - Plugin that initializes loading on app mount

**Important:** The loading screen is for initial app load. For page transitions, use Nuxt's `useLoadingIndicator()`.

---

## Basic Configuration

### Default Configuration

```typescript
// app.config.ts (already configured in core layer)
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

### Customize Appearance

```typescript
// Your project's app.config.ts
export default defineAppConfig({
  coreLayer: {
    loading: {
      background: '#1a1a1a',   // Dark gray
      textColor: '#00ff00',    // Green text
      minDuration: 1000,       // Show for at least 1 second
    }
  }
})
```

### Disable Loading Screen

```typescript
// Your project's app.config.ts
export default defineAppConfig({
  coreLayer: {
    loading: {
      enabled: false  // Completely disable
    }
  }
})
```

---

## Using `useLoading()` Composable

### Automatic (Default Behavior)

The loading screen automatically shows on app initialization - **you don't need to do anything!**

```vue
<!-- app.vue -->
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- LoadingScreen shows automatically on initial load -->
    <LoadingScreen v-if="loadingEnabled" />
  </div>
</template>
```

---

### Manual Control for Async Operations

```vue
<script setup>
const { isLoading, withLoading } = useLoading()

async function loadDashboardData() {
  await withLoading(async () => {
    await fetchUserData()
    await fetchAnalytics()
    await fetchNotifications()
  })
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <p v-if="isLoading">Loading your data...</p>
  </div>
</template>
```

---

### Manual Start/Stop

```vue
<script setup>
const { isLoading, startLoading, stopLoading } = useLoading()

async function refreshData() {
  startLoading()
  try {
    await $fetch('/api/refresh')
  } finally {
    stopLoading()
  }
}
</script>

<template>
  <button @click="refreshData" :disabled="isLoading">
    {{ isLoading ? 'Refreshing...' : 'Refresh Data' }}
  </button>
</template>
```

---

### Monitor Progress

```vue
<script setup>
const { isLoading, progress } = useLoading()
</script>

<template>
  <div v-if="isLoading" class="custom-loader">
    <div class="progress-bar" :style="{ width: `${progress}%` }" />
    <p>{{ Math.round(progress) }}% loaded</p>
  </div>
</template>
```

---

## Custom Loading Screen

### Replace Default Component

Create your own `LoadingScreen.vue` in your project:

```vue
<!-- app/components/LoadingScreen.vue in your project -->
<script setup>
const { progress } = useLoading()
const config = useAppConfig()

const displayProgress = computed(() => Math.round(progress.value))
</script>

<template>
  <div class="custom-loading-screen">
    <!-- Your custom branding -->
    <img src="/logo.svg" alt="Loading" class="logo" />

    <!-- Progress bar -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: `${displayProgress}%` }" />
    </div>

    <!-- Percentage -->
    <p class="progress-text">{{ displayProgress }}%</p>
  </div>
</template>

<style scoped>
.custom-loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 10000;
}

.logo {
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
  animation: pulse 2s ease-in-out infinite;
}

.progress-container {
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: white;
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 1rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}
</style>
```

---

### Spinner-Style Loader

```vue
<!-- app/components/LoadingScreen.vue -->
<script setup>
const { isLoading, progress } = useLoading()
const config = useAppConfig()
const visible = ref(true)

const minDuration = computed(() => config.coreLayer?.loading?.minDuration || 500)

watch([isLoading, progress], ([loading, prog]) => {
  if (!loading && prog === 100) {
    setTimeout(() => {
      visible.value = false
    }, minDuration.value)
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="spinner-loader">
      <!-- Animated spinner -->
      <div class="spinner" />

      <!-- Optional progress text -->
      <p class="loading-text">Loading...</p>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.spinner-loader {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  z-index: 10000;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  color: white;
  font-size: 1.25rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

---

## Page Transitions (Separate Concern)

**Don't use `LoadingScreen` for page transitions.** Use Nuxt's built-in loading indicator:

```vue
<script setup>
// For page transitions, use Nuxt's loading indicator
const { start, finish, isLoading } = useLoadingIndicator()

// Automatically handled by Nuxt, but you can customize:
const router = useRouter()

router.beforeEach(() => {
  start()
})

router.afterEach(() => {
  finish()
})
</script>
```

Configure in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  }
})
```

---

## Complete Example: Dashboard with Loading

```vue
<script setup>
const { isLoading, withLoading } = useLoading()
const { logError } = useErrorLog()

const dashboardData = ref(null)

async function loadDashboard() {
  await withLoading(async () => {
    try {
      const [user, stats, notifications] = await Promise.all([
        $fetch('/api/user'),
        $fetch('/api/stats'),
        $fetch('/api/notifications'),
      ])

      dashboardData.value = { user, stats, notifications }
    } catch (error) {
      logError(error, { context: 'loadDashboard' })
    }
  })
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <div class="dashboard">
    <!-- Initial loading handled by LoadingScreen component -->

    <!-- Show skeleton while loading dashboard data -->
    <div v-if="isLoading && !dashboardData" class="skeleton">
      <div class="skeleton-card" />
      <div class="skeleton-card" />
      <div class="skeleton-card" />
    </div>

    <!-- Dashboard content -->
    <div v-else-if="dashboardData">
      <UserProfile :user="dashboardData.user" />
      <Stats :data="dashboardData.stats" />
      <Notifications :items="dashboardData.notifications" />
    </div>

    <!-- Error state -->
    <div v-else class="error-state">
      <p>Failed to load dashboard</p>
      <button @click="loadDashboard">Try Again</button>
    </div>
  </div>
</template>
```

---

## Best Practices

### ✅ Do

- **Let the plugin handle initial load** - It's automatic!
- **Use `withLoading()`** for async operations
- **Customize appearance** via app.config
- **Replace component** for custom branding
- **Use Nuxt's loading indicator** for page transitions
- **Set reasonable `minDuration`** to prevent flashing

### ❌ Don't

- **Don't use for page transitions** - Use `useLoadingIndicator()`
- **Don't set `minDuration` too high** - 500-1000ms is ideal
- **Don't track real resources** - Simulated progress is fine
- **Don't show for fast operations** - < 200ms doesn't need loading
- **Don't forget to call `stopLoading()`** in finally blocks

---

## Troubleshooting

### Loading Screen Not Showing

1. **Check configuration:**
   ```typescript
   // Make sure enabled is true or omitted
   coreLayer: { loading: { enabled: true } }
   ```

2. **Check app.vue:**
   ```vue
   <LoadingScreen v-if="loadingEnabled" />
   ```

3. **Check browser console** for errors

### Loading Screen Flashes Too Quickly

```typescript
// Increase minDuration
coreLayer: {
  loading: {
    minDuration: 1000  // Show for at least 1 second
  }
}
```

### Custom Component Not Working

Make sure your custom `LoadingScreen.vue` is in:
- `app/components/LoadingScreen.vue` (your project)
- NOT in the layer directory

Nuxt will automatically use your project's version.

---

## Summary

| Feature | Purpose | When to Use |
|---------|---------|-------------|
| `useLoading()` | Loading state management | Async operations, manual control |
| `LoadingScreen.vue` | Visual loading overlay | Initial app load (automatic) |
| `loading.client.ts` | Plugin initialization | Automatic (don't touch) |
| `app.config.ts` | Configuration | Customize appearance/behavior |
| `useLoadingIndicator()` | Page transition loading | Route changes |

**Result:** Smooth loading experience with minimal configuration! 🎉
