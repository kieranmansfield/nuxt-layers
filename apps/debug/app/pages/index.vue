<script setup lang="ts">
  const cards = [
    { title: 'Card One', description: 'Testing CSS on initial load.' },
    { title: 'Card Two', description: 'Should be fully styled without interaction.' },
    { title: 'Card Three', description: 'No layout shift expected.' },
  ]

  const modalOpen = ref(false)

  function openModal() {
    modalOpen.value = true
  }

  function closeModal() {
    modalOpen.value = false
  }
</script>

<template>
  <div class="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">CSS Debug</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard v-for="card in cards" :key="card.title">
        <template #header>
          <h2 class="text-lg font-semibold">{{ card.title }}</h2>
        </template>
        <p class="text-gray-600 dark:text-gray-400">{{ card.description }}</p>
      </UCard>
    </div>

    <div class="flex gap-4">
      <UButton color="primary">Primary</UButton>
      <UButton color="neutral" variant="outline">Neutral</UButton>

      <UPopover>
        <UButton color="neutral" variant="ghost" trailing-icon="i-lucide-chevron-down">
          Popover
        </UButton>
        <template #content>
          <div class="p-4 space-y-2">
            <p class="font-semibold text-sm">Popover content</p>
            <p class="text-sm text-gray-500">Does opening this fix the cards above?</p>
          </div>
        </template>
      </UPopover>

      <UButton color="neutral" variant="ghost" @click="openModal">Open Modal</UButton>
    </div>

    <UModal v-model:open="modalOpen" title="Modal">
      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Does opening this modal fix the card styles above?
        </p>
      </template>
      <template #footer>
        <UButton color="neutral" variant="outline" @click="closeModal">Close</UButton>
      </template>
    </UModal>
  </div>
</template>
