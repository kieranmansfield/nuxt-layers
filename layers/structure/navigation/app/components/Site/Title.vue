<script setup lang="ts">
  const site = useSite()
</script>

<template>
  <span v-for="(word, index) in site.titleWords" :key="index" class="site-word">
    {{ word }}
  </span>
</template>
