<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('lime')
  onUnmounted(() => setPageAccent(null))

  const { back } = useBackNavigation('/')

  const appConfig = useAppConfig()
  const { hasConsent, consentRequired, grantConsent, revokeConsent } = useScriptsConsent()

  const scriptsConfig = computed(() => appConfig.scriptsLayer)

  const { thumbnailUrl, embedUrl, load, proxy: ytProxy } = useYoutubeEmbed('dQw4w9WgXcQ')
  const ytLoaded = ref(false)
  function loadVideo() {
    load()
    ytLoaded.value = true
  }

  const consentRows = computed(() => [
    { label: 'Consent required', value: consentRequired.value ? 'Yes' : 'No' },
    { label: 'Has consent', value: hasConsent.value ? 'Granted' : 'Not granted' },
    { label: 'Storage key', value: scriptsConfig.value?.consent?.storageKey ?? '—' },
  ])

  const integrations = [
    {
      name: 'useScriptLoader',
      icon: 'i-lucide-cloud-download',
      description: 'Load any third-party <script> with a strategy: onNuxtReady, idle, or manual',
      snippet: "useScriptLoader({ src: 'https://...', strategy: 'idle' })",
    },
    {
      name: 'useYoutubeEmbed',
      icon: 'i-lucide-youtube',
      description: 'Facade-pattern YouTube embed — loads the IFrame API only on interaction',
      snippet: 'useYoutubeEmbed(videoId)',
    },
    {
      name: 'useGtm',
      icon: 'i-lucide-bar-chart-3',
      description: 'Google Tag Manager wrapper around @nuxt/scripts',
      snippet: 'useGtm()',
    },
    {
      name: 'useAnalytics',
      icon: 'i-lucide-line-chart',
      description: 'Provider-agnostic analytics proxy (GA4 / Plausible / Fathom)',
      snippet: 'useAnalytics()',
    },
    {
      name: 'useScriptsConsent',
      icon: 'i-lucide-shield-check',
      description: 'Consent-gated script loading with localStorage persistence',
      snippet: 'useScriptsConsent()',
    },
  ]
</script>

<template>
  <LayoutPage
    title="Scripts Layer Demo"
    description="@nuxt/scripts wrapper — consent-aware analytics, GTM, and third-party embeds"
  >
    <div class="scripts-page">
      <!-- Hero -->
      <section
        class="bg-default relative flex min-h-[70vh] items-center justify-center overflow-hidden"
      >
        <div
          class="from-primary/10 absolute inset-0 bg-linear-to-b via-transparent to-transparent"
        />
        <div class="z-10 px-4 text-center">
          <h1 class="text-highlighted mb-8 text-5xl font-black sm:text-7xl md:text-8xl">
            <span class="text-primary">SCRIPTS</span> LAYER
          </h1>
          <p class="text-muted mx-auto mb-12 max-w-2xl text-xl">
            Consent-aware third-party script loading — analytics, GTM, and facade-pattern embeds
            built on <code class="text-primary">@nuxt/scripts</code>.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <UButton size="lg" @click="() => $router.push('#consent')">Consent Demo</UButton>
            <UButton size="lg" variant="outline" @click="() => $router.push('#embed')">
              YouTube Embed
            </UButton>
            <UButton size="lg" variant="ghost" @click="back">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Back
            </UButton>
          </div>
        </div>
      </section>

      <!-- Composables grid -->
      <section class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">Composables</h2>
            <p class="text-muted text-lg">The public surface of the scripts layer</p>
          </div>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="item in integrations"
              :key="item.name"
              class="bg-accented border-accented hover:border-primary/50 rounded-2xl border p-6 transition-colors"
            >
              <div class="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <UIcon :name="item.icon" class="text-primary text-2xl" />
              </div>
              <h3 class="text-highlighted mb-2 text-lg font-bold">{{ item.name }}</h3>
              <p class="text-muted mb-3 text-sm">{{ item.description }}</p>
              <code class="text-muted bg-muted block overflow-x-auto rounded px-2 py-1 text-xs">
                {{ item.snippet }}
              </code>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Consent -->
      <section id="consent" class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">Consent Management</h2>
            <p class="text-muted text-lg">
              <code class="text-primary">useScriptsConsent()</code> — gate script loading on user
              consent
            </p>
          </div>
          <div class="bg-default border-default mx-auto max-w-2xl rounded-2xl border p-8">
            <div class="mb-8 grid gap-4 sm:grid-cols-3">
              <div
                v-for="row in consentRows"
                :key="row.label"
                class="bg-accented rounded-xl p-4 text-center"
              >
                <p class="text-muted mb-1 text-xs tracking-widest uppercase">{{ row.label }}</p>
                <p class="text-highlighted text-lg font-bold">{{ row.value }}</p>
              </div>
            </div>
            <div class="flex flex-wrap justify-center gap-4">
              <UButton :disabled="hasConsent" @click="grantConsent">
                <UIcon name="i-lucide-check" class="mr-2" />
                Grant Consent
              </UButton>
              <UButton variant="outline" :disabled="!hasConsent" @click="revokeConsent">
                <UIcon name="i-lucide-x" class="mr-2" />
                Revoke Consent
              </UButton>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- YouTube Embed -->
      <section id="embed" class="bg-default py-24">
        <UContainer>
          <div class="mb-16 text-center">
            <h2 class="text-highlighted mb-4 text-4xl font-bold md:text-5xl">YouTube Facade</h2>
            <p class="text-muted text-lg">
              <code class="text-primary">useYoutubeEmbed()</code> — shows a thumbnail until the
              viewer opts in to load the IFrame API
            </p>
          </div>
          <div class="mx-auto max-w-2xl">
            <div
              class="bg-default border-default group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-2xl border"
              @click="loadVideo"
            >
              <template v-if="!ytLoaded">
                <img
                  :src="thumbnailUrl"
                  alt="Video thumbnail"
                  class="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
                />
                <div
                  class="bg-primary/90 relative z-10 flex h-16 w-16 items-center justify-center rounded-full"
                >
                  <UIcon name="i-lucide-play" class="text-highlighted text-2xl" />
                </div>
              </template>
              <iframe
                v-else
                :src="embedUrl"
                class="h-full w-full"
                title="YouTube embed"
                allow="autoplay; encrypted-media"
                allowfullscreen
              />
            </div>
            <p class="text-muted mt-4 text-center text-sm">
              proxy status: <code class="text-primary">{{ ytProxy ? 'ready' : 'idle' }}</code> ·
              click the thumbnail to load the iframe on demand
            </p>
          </div>
        </UContainer>
      </section>

      <!-- Footer Nav -->
      <section class="bg-default py-16">
        <UContainer>
          <div class="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h2 class="text-highlighted mb-2 text-2xl font-bold">Scripts Layer</h2>
              <p class="text-muted">Consent-aware analytics, GTM, and third-party embeds</p>
            </div>
            <div class="flex flex-wrap gap-4">
              <UButton variant="outline" @click="back">Back</UButton>
              <UButton to="/">Home</UButton>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPage>
</template>
