<script setup lang="ts">
  definePageMeta({ layout: false })

  const { setPageAccent } = useAccentColor()
  setPageAccent('red')
  onUnmounted(() => setPageAccent(null))

  useSeoMeta({
    title: 'Security Layer',
    description: 'nuxt-security wrapper: nonce CSP, security headers, tuned for the other layers.',
  })

  const HEADERS = [
    'content-security-policy',
    'strict-transport-security',
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy',
    'access-control-allow-origin',
  ]

  // Read this page's own response headers — same-origin, so all are visible to fetch().
  const headers = ref<{ name: string; value: string | null }[]>([])
  async function loadHeaders() {
    const res = await fetch(location.pathname, { method: 'HEAD', cache: 'no-store' })
    headers.value = HEADERS.map((name) => ({ name, value: res.headers.get(name) }))
  }
  onMounted(loadHeaders)

  // Each probe is a real XSS technique fed a fixed string (no user input), here to prove the CSP
  // blocks it. The window flag flips only if the browser executed it.
  interface Probe {
    id: string
    label: string
    vector: string
    run: () => void
    expect: 'ran' | 'blocked'
    note: string
    status: 'idle' | 'ran' | 'blocked'
    directive?: string
  }

  const w = () => window as unknown as Record<string, boolean>

  const probes = ref<Probe[]>([
    {
      id: 'attr',
      label: 'Inline event handler',
      vector: '<img src=x onerror="…">',
      run: () => {
        const box = document.createElement('div')
        box.hidden = true
        box.innerHTML = '<img src="/__probe_missing.png" onerror="window.__probe_attr = true">'
        document.body.append(box)
      },
      expect: 'blocked',
      note: "script-src-attr 'none' kills every on*= handler — the classic innerHTML XSS payload.",
      status: 'idle',
    },
    {
      id: 'eval',
      label: 'eval()',
      vector: "eval('window.__probe_eval = true')",
      run: () => {
        try {
          eval('window.__probe_eval = true')
        } catch {
          // CSP refusal throws EvalError — the flag staying false is the result.
        }
      },
      expect: 'blocked',
      note: "No 'unsafe-eval' in script-src, so eval / new Function / string setTimeout throw.",
      status: 'idle',
    },
    {
      id: 'inline',
      label: 'Script created by trusted code',
      vector: "createElement('script') + textContent, appended to body",
      run: () => {
        const s = document.createElement('script')
        s.textContent = 'window.__probe_inline = true'
        document.body.append(s)
      },
      expect: 'ran',
      note: "'strict-dynamic' trusts scripts that already-trusted (nonced) code creates — the same rule that lets @nuxt/scripts load GTM or YouTube. Only parser-inserted markup is blocked.",
      status: 'idle',
    },
  ])

  let lastViolation = ''
  function onViolation(e: SecurityPolicyViolationEvent) {
    lastViolation = e.effectiveDirective
  }
  onMounted(() => document.addEventListener('securitypolicyviolation', onViolation))
  onUnmounted(() => document.removeEventListener('securitypolicyviolation', onViolation))

  async function runProbe(probe: Probe) {
    w()[`__probe_${probe.id}`] = false
    lastViolation = ''
    probe.run()
    // Violation events and onerror both fire async.
    await new Promise((r) => setTimeout(r, 300))
    probe.status = w()[`__probe_${probe.id}`] ? 'ran' : 'blocked'
    probe.directive = lastViolation || undefined
  }

  function probeBadge(probe: Probe) {
    return {
      color: probe.status === probe.expect ? ('success' as const) : ('error' as const),
      label: probe.status === 'blocked' ? 'Blocked' : 'Executed',
    }
  }

  const usage = [
    {
      title: "Add sources (arrays concatenate with the layer's)",
      code: `security: {
  headers: {
    contentSecurityPolicy: {
      'connect-src': ["'self'", 'https://plausible.io'],
    },
  },
}`,
    },
    {
      title: "Replace a directive (string or false wins over the layer's array)",
      code: `contentSecurityPolicy: { 'img-src': "'self' data: https://cdn.example.com" }`,
    },
    {
      title: 'Rate-limit one route',
      code: `routeRules: {
  '/api/contact': {
    security: {
      rateLimiter: { tokensPerInterval: 5, interval: 60_000, ipHeader: 'x-nf-client-connection-ip' },
    },
  },
}`,
    },
  ]

  const overrides = [
    {
      option: 'crossOriginEmbedderPolicy',
      value: 'false',
      why: '`credentialless` blocks YouTube / caniuse iframes; nothing needs SharedArrayBuffer',
    },
    {
      option: 'referrerPolicy',
      value: "'strict-origin-when-cross-origin'",
      why: '`no-referrer` breaks YouTube embeds (error 153)',
    },
    {
      option: "CSP 'img-src'",
      value: '+ blob: https:',
      why: 'metadata covers, content images, YouTube thumbnails are remote',
    },
    {
      option: "CSP 'script-src'",
      value: "+ 'wasm-unsafe-eval'",
      why: '@nuxt/content runs SQLite as WASM on client-side navigation',
    },
    {
      option: 'permissionsPolicy.fullscreen',
      value: 'false',
      why: '`()` blocks fullscreen inside YouTube embeds',
    },
    {
      option: 'rateLimiter',
      value: 'false',
      why: 'one site-wide 150 req / 5 min bucket per (spoofable) IP — 429s whole pages',
    },
    {
      option: 'xssValidator',
      value: 'false',
      why: 'rejects plain text like "x < y"; never runs on Netlify anyway',
    },
    {
      option: 'corsHandler',
      value: 'false',
      why: 'default origin is unset at build → `Access-Control-Allow-Origin: *` on every route',
    },
    {
      option: 'removeLoggers',
      value: 'false',
      why: 'default strips console.* from every consumer build',
    },
  ]
</script>

<template>
  <LayoutPage
    title="Security Layer Demo"
    description="nuxt-security wrapper: nonce CSP and security headers"
  >
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="Security"
        description="Opt-in nuxt-security wrapper — per-request nonce CSP and hardened headers, with the defaults that break other layers switched off."
      >
        <div class="flex flex-wrap justify-center gap-4">
          <UButton size="lg" icon="i-lucide-refresh-cw" @click="loadHeaders">
            Re-read headers
          </UButton>
        </div>
      </DemoPageHero>

      <section class="bg-default pb-24">
        <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div class="space-y-8 py-8">
            <!-- Live headers -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-shield-check" class="text-primary" />
                  <h2 class="text-xl font-semibold">Response headers on this page</h2>
                </div>
                <p class="text-muted mt-1 text-sm">
                  Read live with <code>fetch(location.pathname, &#123; method: 'HEAD' &#125;)</code>
                </p>
              </template>

              <div class="space-y-2">
                <div
                  v-for="h in headers"
                  :key="h.name"
                  class="border-default flex flex-col gap-1 border-b py-2 last:border-0 sm:flex-row sm:gap-4"
                >
                  <span class="text-muted shrink-0 font-mono text-sm sm:w-64">{{ h.name }}</span>
                  <span
                    class="font-mono text-xs break-all"
                    :class="h.value ? 'text-highlighted' : 'text-dimmed'"
                  >
                    {{ h.value ?? 'not set' }}
                  </span>
                </div>
              </div>
            </UCard>

            <!-- CSP probes -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-bug" class="text-primary" />
                  <h2 class="text-xl font-semibold">CSP probes</h2>
                </div>
                <p class="text-muted mt-1 text-sm">
                  Real techniques, run in your browser against this page's CSP. Green = matches the
                  expected result with the layer loaded; drop <code>security</code> from
                  <code>PLAYGROUND_LAYERS</code> and the blocked ones run.
                </p>
              </template>

              <div class="space-y-3">
                <div
                  v-for="probe in probes"
                  :key="probe.id"
                  class="bg-elevated border-default flex flex-wrap items-center gap-3 rounded-lg border p-4"
                >
                  <div class="min-w-0 flex-1">
                    <p class="text-highlighted text-sm font-medium">{{ probe.label }}</p>
                    <code class="text-muted text-xs">{{ probe.vector }}</code>
                    <p class="text-muted mt-1 text-xs">
                      Expected: {{ probe.expect }} — {{ probe.note }}
                    </p>
                  </div>
                  <UBadge
                    v-if="probe.status !== 'idle'"
                    :color="probeBadge(probe).color"
                    variant="subtle"
                  >
                    {{ probeBadge(probe).label }}
                    <template v-if="probe.directive">· {{ probe.directive }}</template>
                  </UBadge>
                  <UButton size="sm" variant="outline" @click="runProbe(probe)">Run</UButton>
                </div>
              </div>
            </UCard>

            <!-- What the layer changes -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-sliders-horizontal" class="text-primary" />
                  <h2 class="text-xl font-semibold">Changed from nuxt-security defaults</h2>
                </div>
                <p class="text-muted mt-1 text-sm">
                  Everything else (nonce + <code>'strict-dynamic'</code>, HSTS, frame-ancestors,
                  SRI, SSG hashes) is the module default
                </p>
              </template>

              <div class="space-y-3">
                <div
                  v-for="row in overrides"
                  :key="row.option"
                  class="border-default border-b pb-3 last:border-0"
                >
                  <div class="flex flex-wrap items-baseline gap-2">
                    <code class="text-highlighted font-mono text-sm">{{ row.option }}</code>
                    <code class="text-primary font-mono text-xs">{{ row.value }}</code>
                  </div>
                  <p class="text-muted mt-1 text-sm">{{ row.why }}</p>
                </div>
              </div>
            </UCard>

            <!-- Usage -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-code-2" class="text-primary" />
                  <h2 class="text-xl font-semibold">Usage</h2>
                </div>
              </template>

              <dl class="space-y-4">
                <div v-for="snippet in usage" :key="snippet.title">
                  <dt class="text-highlighted mb-2 text-sm font-semibold">{{ snippet.title }}</dt>
                  <dd>
                    <pre
                      class="bg-muted text-muted overflow-x-auto rounded-lg p-4 text-xs leading-relaxed"
                    ><code>{{ snippet.code }}</code></pre>
                  </dd>
                </div>
              </dl>
            </UCard>
          </div>
        </div>
      </section>

      <DemoPageFooter
        name="Security Layer"
        description="nuxt-security — nonce CSP and hardened headers"
        :links="[
          { label: 'SEO', to: '/seo', icon: 'i-lucide-search' },
          { label: 'Scripts', to: '/scripts', icon: 'i-lucide-cloud-download' },
        ]"
      />
    </div>
  </LayoutPage>
</template>
