<script setup lang="ts">
  definePageMeta({ layout: false })

  const repoInput = ref('nuxt/nuxt')
  const pluginInput = ref('dataview')
  // Only refetch when the user commits a value, not on every keystroke
  const repo = ref(repoInput.value)
  const plugin = ref(pluginInput.value)
</script>

<template>
  <UContainer class="space-y-10 py-12">
    <div class="space-y-2">
      <UButton to="/" icon="i-lucide-arrow-left" variant="ghost" color="neutral" size="sm">
        Back
      </UButton>
      <h1 class="text-highlighted text-3xl font-bold">Project stats</h1>
      <p class="text-muted max-w-2xl">
        GitHub repo and Obsidian plugin cards from the <code>project-stats</code> layer. Add
        <code>github:</code> or <code>obsidian:</code> to portfolio frontmatter to show them on an
        item page, or drop the components in anywhere.
      </p>
    </div>

    <section class="space-y-4">
      <form class="flex max-w-md gap-2" @submit.prevent="repo = repoInput">
        <UInput v-model="repoInput" placeholder="owner/name or GitHub URL" class="flex-1" />
        <UButton type="submit" icon="i-lucide-github">Load</UButton>
      </form>
      <ProjectStatsGithubCard :key="repo" :repo class="max-w-2xl" />
    </section>

    <section class="space-y-4">
      <form class="flex max-w-md gap-2" @submit.prevent="plugin = pluginInput">
        <UInput v-model="pluginInput" placeholder="Plugin id, e.g. obsidian-git" class="flex-1" />
        <UButton type="submit" icon="i-lucide-gem">Load</UButton>
      </form>
      <ProjectStatsObsidianCard :key="plugin" :plugin class="max-w-2xl" />
    </section>

    <UButton to="/portfolio/project-three" variant="outline" trailing-icon="i-lucide-arrow-right">
      See them on a portfolio item
    </UButton>
  </UContainer>
</template>
