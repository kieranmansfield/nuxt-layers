<script setup lang="ts">
import { resolveComponent } from 'vue'

const mastHeader = resolveComponent('MastHeader')
const mastFooter = resolveComponent('MastFooter')

const hasMastHeader = typeof mastHeader !== 'string'
const hasMastFooter = typeof mastFooter !== 'string'
</script>

<template>
  <component :is="mastHeader" v-if="hasMastHeader" />
  <MastMain>
    <slot />
  </MastMain>
  <component :is="mastFooter" v-if="hasMastFooter" />
  <UOverlayProvider />
</template>
