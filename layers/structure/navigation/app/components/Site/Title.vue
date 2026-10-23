<script setup lang="ts">
  /**
   * @deprecated Render `useSite().titleWords` directly. Unused in this repo and KMCOMv5;
   * remove in the next major.
   */
  if (import.meta.dev)
    // eslint-disable-next-line no-console -- one-time deprecation notice, dev only
    console.warn('[navigation] <SiteTitle> is deprecated — render useSite().titleWords directly.')

  const site = useSite()
</script>

<template>
  <span v-for="(word, index) in site.titleWords" :key="index" class="site-word">
    {{ word }}
  </span>
</template>
