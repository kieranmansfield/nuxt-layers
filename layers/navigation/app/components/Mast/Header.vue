<script lang="ts" setup>
const appConfig = useAppConfig()
const title = appConfig.site?.title ?? 'Site Title'
</script>

<template>
  <UHeader :title />
</template>

<!-- <template #toggle>
  <MastNav />
</template> -->

<!-- :ui="{
  root: 'bg-default static border-0',
  container: 'w-full max-w-full',
  title: 'text-primary flex-col text-pretty text-6xl leading-8 antialiased',
}" -->
