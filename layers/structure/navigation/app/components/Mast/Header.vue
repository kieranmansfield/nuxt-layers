<script lang="ts" setup>
  import type { SiteConfig } from '#layers/core/app/types/site'

  const appConfig = useAppConfig()
  const site = appConfig.site as SiteConfig | undefined
  const title = site?.title ?? 'Site Title'
</script>

<template>
  <UHeader :title />
</template>
