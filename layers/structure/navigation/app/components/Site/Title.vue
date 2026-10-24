<script setup lang="ts">
  /**
   * @deprecated Use `<SiteLogo :stacked="false">` (or `useSite().titleWords`). Remove in the
   * next major.
   */
  if (import.meta.dev)
    // eslint-disable-next-line no-console -- one-time deprecation notice, dev only
    console.warn('[navigation] <SiteTitle> is deprecated — use <SiteLogo>.')

  const site = useSite()
</script>

<template>
  <span v-for="(word, index) in site.titleWords" :key="index" class="site-word">
    {{ word }}
  </span>
</template>
