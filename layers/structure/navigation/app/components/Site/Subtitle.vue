<script setup lang="ts">
  /**
   * @deprecated Render `useSite().subtitleWords` directly. Unused in this repo and KMCOMv5;
   * remove in the next major.
   */
  if (import.meta.dev)
    // eslint-disable-next-line no-console -- one-time deprecation notice, dev only
    console.warn(
      '[navigation] <SiteSubtitle> is deprecated — render useSite().subtitleWords directly.'
    )

  const site = useSite()
</script>

<template>
  <span v-for="(word, index) in site.subtitleWords" :key="index" class="site-word">
    {{ word }}
  </span>
</template>
