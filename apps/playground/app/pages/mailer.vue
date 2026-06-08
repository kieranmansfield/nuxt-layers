<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('sky')
  onUnmounted(() => setPageAccent(null))

  const { back } = useBackNavigation('/forms')

  const { data: status, refresh: refreshStatus } = await useFetch('/api/forms/status')

  const sending = ref(false)
  const result = ref<'idle' | 'success' | 'error'>('idle')

  async function sendTestMessage() {
    sending.value = true
    result.value = 'idle'
    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: {
          name: 'Playground Tester',
          email: 'tester@example.com',
          message: 'Hello from the mailer layer demo page — this is a live end-to-end test.',
        },
      })
      result.value = 'success'
    } catch {
      result.value = 'error'
    } finally {
      sending.value = false
      await refreshStatus()
    }
  }

  const pipeline = [
    {
      step: '1',
      label: 'contact:submitted',
      description: 'Hook fires once the request body passes Zod validation',
      icon: 'i-lucide-clipboard-check',
    },
    {
      step: '2',
      label: 'sendContactEmail()',
      description: 'Server util builds the message and calls the Resend API',
      icon: 'i-lucide-send',
    },
    {
      step: '3',
      label: 'contact:sent / contact:failed',
      description: 'Hook fires with the Resend message ID, or the captured error',
      icon: 'i-lucide-check-check',
    },
  ]

  const surface = [
    {
      name: 'useMailerConfig()',
      kind: 'server util',
      description: 'Reads resendApiKey, emailFrom, emailTo from runtime config',
      icon: 'i-lucide-settings-2',
    },
    {
      name: 'sendContactEmail()',
      kind: 'server util',
      description: 'Sends a templated contact email via the Resend SDK',
      icon: 'i-lucide-mail',
    },
    {
      name: 'mailerLayerHooks',
      kind: 'hookable instance',
      description: 'Typed hooks: contact:submitted, contact:sent, contact:failed',
      icon: 'i-lucide-webhook',
    },
  ]
</script>

<template>
  <LayoutPage
    title="Mailer Layer Demo"
    description="Resend-backed transactional email sending, runtime config, and lifecycle hooks"
  >
    <div class="mailer-page">
      <!-- Hero -->
      <section
        class="min-h-[70vh] flex items-center justify-center relative overflow-hidden bg-gray-950"
      >
        <div
          class="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent"
        />
        <div class="text-center z-10 px-4">
          <h1 class="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-8">
            <span class="text-primary">MAILER</span> LAYER
          </h1>
          <p class="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Server-side transactional email via Resend — runtime config, a typed hook lifecycle, and
            the pipeline that powers the Forms layer's contact form.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <UButton size="lg" @click="$router.push('#pipeline')">View Pipeline</UButton>
            <UButton size="lg" variant="outline" to="/forms">
              <UIcon name="i-lucide-file-input" class="mr-2" />
              Forms Layer
            </UButton>
            <UButton size="lg" variant="ghost" @click="back()">
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Back
            </UButton>
          </div>
        </div>
      </section>

      <!-- Status -->
      <section class="py-24 bg-gray-900">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Runtime Configuration</h2>
            <p class="text-gray-400 text-lg">
              <code class="text-primary">useMailerConfig()</code> — read live via
              <code class="text-primary">/api/forms/status</code>
            </p>
          </div>
          <div class="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div class="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">Configured</p>
              <UBadge
                :color="status?.configured ? 'success' : 'warning'"
                variant="subtle"
                size="lg"
              >
                {{ status?.configured ? 'Resend API key set' : 'No API key' }}
              </UBadge>
            </div>
            <div class="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">From</p>
              <p class="text-white font-mono text-sm break-all">{{ status?.emailFrom ?? '—' }}</p>
            </div>
            <div class="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">To</p>
              <p class="text-white font-mono text-sm break-all">{{ status?.emailTo ?? '—' }}</p>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Pipeline -->
      <section id="pipeline" class="py-24 bg-gray-950">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Send Pipeline</h2>
            <p class="text-gray-400 text-lg">What happens between submit and inbox</p>
          </div>
          <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div
              v-for="item in pipeline"
              :key="item.step"
              class="bg-gray-900 rounded-2xl p-6 border border-gray-800 relative"
            >
              <div
                class="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm"
              >
                {{ item.step }}
              </div>
              <UIcon :name="item.icon" class="text-3xl text-primary mb-3" />
              <code class="text-white font-mono text-sm block mb-2">{{ item.label }}</code>
              <p class="text-gray-400 text-sm">{{ item.description }}</p>
            </div>
          </div>

          <div class="max-w-md mx-auto text-center">
            <UButton size="lg" :loading="sending" @click="sendTestMessage">
              <UIcon name="i-lucide-send" class="mr-2" />
              Run pipeline (send test message)
            </UButton>
            <p v-if="result === 'success'" class="text-green-400 text-sm mt-4">
              <UIcon name="i-lucide-circle-check" class="mr-1" />
              contact:sent fired — message accepted by Resend
            </p>
            <p v-else-if="result === 'error'" class="text-red-400 text-sm mt-4">
              <UIcon name="i-lucide-circle-x" class="mr-1" />
              contact:failed fired — see server logs (likely missing API key in this environment)
            </p>
          </div>
        </UContainer>
      </section>

      <!-- Surface -->
      <section class="py-24 bg-gray-900">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Server Surface</h2>
            <p class="text-gray-400 text-lg">
              Mailer is server-only — no client components or composables
            </p>
          </div>
          <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div
              v-for="item in surface"
              :key="item.name"
              class="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <UIcon :name="item.icon" class="text-2xl text-primary mb-3" />
              <code class="text-white font-mono text-sm block mb-1">{{ item.name }}</code>
              <UBadge variant="subtle" color="neutral" size="xs" class="mb-3">{{
                item.kind
              }}</UBadge>
              <p class="text-gray-400 text-sm">{{ item.description }}</p>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Footer Nav -->
      <section class="py-16 bg-gray-950">
        <UContainer>
          <div class="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white mb-2">Mailer Layer</h2>
              <p class="text-gray-400">Resend transactional email + lifecycle hooks</p>
            </div>
            <div class="flex flex-wrap gap-4">
              <UButton variant="ghost" to="/forms">
                <UIcon name="i-lucide-file-input" class="mr-2" />
                Forms Layer
              </UButton>
              <UButton variant="outline" @click="back()">Back</UButton>
              <UButton to="/">Home</UButton>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </LayoutPage>
</template>
