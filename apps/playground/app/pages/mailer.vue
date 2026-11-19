<script setup lang="ts">
  definePageMeta({ layout: false })
  const { setPageAccent } = useAccentColor()
  setPageAccent('teal')
  onUnmounted(() => setPageAccent(null))

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
    <div class="bg-default min-h-screen">
      <DemoPageHero
        name="MAILER LAYER"
        description="Server-side transactional email via Resend — runtime config, a typed hook lifecycle, and the pipeline that powers the Forms layer's contact form."
      >
        <div class="flex flex-wrap justify-center gap-4">
          <UButton size="lg" @click="() => $router.push('#pipeline')">View Pipeline</UButton>
          <UButton size="lg" variant="outline" to="/forms">
            <UIcon name="i-lucide-file-input" class="mr-2" />
            Forms Layer
          </UButton>
        </div>
      </DemoPageHero>

      <!-- Status -->
      <DemoSection title="Runtime Configuration">
        <template #description>
          <code class="text-primary">useMailerConfig()</code> — read live via
          <code class="text-primary">/api/forms/status</code>
        </template>

        <div class="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          <div class="bg-accented border-accented rounded-2xl border p-6 text-center">
            <p class="text-muted mb-2 text-xs tracking-widest uppercase">Configured</p>
            <UBadge :color="status?.configured ? 'success' : 'warning'" variant="subtle" size="lg">
              {{ status?.configured ? 'Resend API key set' : 'No API key' }}
            </UBadge>
          </div>
          <div class="bg-accented border-accented rounded-2xl border p-6 text-center">
            <p class="text-muted mb-2 text-xs tracking-widest uppercase">From</p>
            <p class="text-highlighted font-mono text-sm break-all">
              {{ status?.emailFrom ?? '—' }}
            </p>
          </div>
          <div class="bg-accented border-accented rounded-2xl border p-6 text-center">
            <p class="text-muted mb-2 text-xs tracking-widest uppercase">To</p>
            <p class="text-highlighted font-mono text-sm break-all">
              {{ status?.emailTo ?? '—' }}
            </p>
          </div>
        </div>
      </DemoSection>

      <!-- Pipeline -->
      <DemoSection
        id="pipeline"
        title="Send Pipeline"
        description="What happens between submit and inbox"
      >
        <div class="mx-auto mb-16 grid max-w-4xl gap-6 md:grid-cols-3">
          <div
            v-for="item in pipeline"
            :key="item.step"
            class="bg-muted border-default relative rounded-2xl border p-6"
          >
            <div
              class="bg-primary text-highlighted absolute -top-4 -left-4 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
            >
              {{ item.step }}
            </div>
            <UIcon :name="item.icon" class="text-primary mb-3 text-3xl" />
            <code class="text-highlighted mb-2 block font-mono text-sm">{{ item.label }}</code>
            <p class="text-muted text-sm">{{ item.description }}</p>
          </div>
        </div>

        <div class="mx-auto max-w-md text-center">
          <UButton size="lg" :loading="sending" @click="sendTestMessage">
            <UIcon name="i-lucide-send" class="mr-2" />
            Run pipeline (send test message)
          </UButton>
          <p v-if="result === 'success'" class="mt-4 text-sm text-green-400">
            <UIcon name="i-lucide-circle-check" class="mr-1" />
            contact:sent fired — message accepted by Resend
          </p>
          <p v-else-if="result === 'error'" class="mt-4 text-sm text-red-400">
            <UIcon name="i-lucide-circle-x" class="mr-1" />
            contact:failed fired — see server logs (likely missing API key in this environment)
          </p>
        </div>
      </DemoSection>

      <!-- Surface -->
      <DemoSection
        title="Server Surface"
        description="Mailer is server-only — no client components or composables"
      >
        <div class="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          <div
            v-for="item in surface"
            :key="item.name"
            class="bg-accented border-accented rounded-2xl border p-6"
          >
            <UIcon :name="item.icon" class="text-primary mb-3 text-2xl" />
            <code class="text-highlighted mb-1 block font-mono text-sm">{{ item.name }}</code>
            <UBadge variant="subtle" color="neutral" size="xs" class="mb-3">{{ item.kind }}</UBadge>
            <p class="text-muted text-sm">{{ item.description }}</p>
          </div>
        </div>
      </DemoSection>

      <DemoPageFooter
        name="Mailer Layer"
        description="Resend transactional email + lifecycle hooks"
        :links="[{ label: 'Forms Layer', to: '/forms', icon: 'i-lucide-file-input' }]"
      />
    </div>
  </LayoutPage>
</template>
