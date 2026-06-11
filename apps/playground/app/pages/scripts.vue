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

<!-- eslint-disable vue/max-lines-per-block -->
<!-- eslint-disable vue/max-template-depth -->
<!-- eslint-disable vue/v-on-handler-style -->
<template>
  <LayoutPage
    title="Scripts Layer Demo"
    description="@nuxt/scripts wrapper — consent-aware analytics, GTM, and third-party embeds"
  >
    <div class="scripts-page">
      <!-- Hero -->
      <section
        class="min-h-[70vh] flex items-center justify-center relative overflow-hidden bg-gray-950"
      >
        <div
          class="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent"
        />
        <div class="text-center z-10 px-4">
          <h1 class="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-8">
            <span class="text-primary">SCRIPTS</span> LAYER
          </h1>
          <p class="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Consent-aware third-party script loading — analytics, GTM, and facade-pattern embeds
            built on <code class="text-primary">@nuxt/scripts</code>.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <UButton size="lg" @click="$router.push('#consent')">Consent Demo</UButton>
            <UButton size="lg" variant="outline" @click="$router.push('#embed')">
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
      <section class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Composables</h2>
            <p class="text-gray-400 text-lg">The public surface of the scripts layer</p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in integrations"
              :key="item.name"
              class="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-primary/50 transition-colors"
            >
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <UIcon :name="item.icon" class="text-2xl text-primary" />
              </div>
              <h3 class="text-lg font-bold text-white mb-2">{{ item.name }}</h3>
              <p class="text-gray-400 text-sm mb-3">{{ item.description }}</p>
              <code
                class="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded block overflow-x-auto"
              >
                {{ item.snippet }}
              </code>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Consent -->
      <section id="consent" class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Consent Management</h2>
            <p class="text-gray-400 text-lg">
              <code class="text-primary">useScriptsConsent()</code> — gate script loading on user
              consent
            </p>
          </div>
          <div class="max-w-2xl mx-auto bg-gray-950 rounded-2xl p-8 border border-gray-800">
            <div class="grid sm:grid-cols-3 gap-4 mb-8">
              <div
                v-for="row in consentRows"
                :key="row.label"
                class="bg-gray-800 rounded-xl p-4 text-center"
              >
                <p class="text-xs uppercase tracking-widest text-gray-500 mb-1">{{ row.label }}</p>
                <p class="text-lg font-bold text-white">{{ row.value }}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-4 justify-center">
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
      <section id="embed" class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">YouTube Facade</h2>
            <p class="text-gray-400 text-lg">
              <code class="text-primary">useYoutubeEmbed()</code> — shows a thumbnail until the
              viewer opts in to load the IFrame API
            </p>
          </div>
          <div class="max-w-2xl mx-auto">
            <div
              class="relative aspect-video rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 flex items-center justify-center cursor-pointer group"
              @click="loadVideo"
            >
              <template v-if="!ytLoaded">
                <img
                  :src="thumbnailUrl"
                  alt="Video thumbnail"
                  class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div
                  class="relative z-10 w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center"
                >
                  <UIcon name="i-lucide-play" class="text-2xl text-white" />
                </div>
              </template>
              <iframe
                v-else
                :src="embedUrl"
                class="w-full h-full"
                title="YouTube embed"
                allow="autoplay; encrypted-media"
                allowfullscreen
              />
            </div>
            <p class="text-gray-500 text-sm mt-4 text-center">
              proxy status: <code class="text-primary">{{ ytProxy ? 'ready' : 'idle' }}</code> ·
              click the thumbnail to load the iframe on demand
            </p>
          </div>
        </UContainer>
      </section>

      <!-- Footer Nav -->
      <section class="py-16 bg-gray-950">
        <UContainer>
          <div class="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white mb-2">Scripts Layer</h2>
              <p class="text-gray-400">Consent-aware analytics, GTM, and third-party embeds</p>
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
