<script lang="ts" setup>
import { splitSpaces } from '#layers/ui/app/utils/regex'

defineProps<{
  siteTitle: string
  tag: string
  titleVariant: string
}>()
</script>

<template>
  <component :is="tag" :v-bind="$attrs">
    {{ titleVariant == 'split' ? splitSpaces(siteTitle) : siteTitle }}
  </component>
</template>
