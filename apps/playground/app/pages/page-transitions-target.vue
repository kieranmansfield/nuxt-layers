<script setup lang="ts">
  definePageMeta({ layout: false })
</script>

<template>
  <LayoutPage title="Page Transitions Target">
    <div class="bg-default flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div
        data-flip-id="demo-box"
        class="from-primary flex h-64 w-64 items-center justify-center rounded-3xl bg-linear-to-br to-purple-600"
      >
        <UIcon name="i-lucide-arrow-right-left" class="text-highlighted text-6xl" />
      </div>
      <p class="text-muted">Same <code>data-flip-id</code>, new size and position.</p>
      <NuxtLink data-transition="curved" to="/page-transitions">
        <UButton variant="outline">Back</UButton>
      </NuxtLink>
    </div>
  </LayoutPage>
</template>
