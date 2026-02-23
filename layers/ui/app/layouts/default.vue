<script setup lang="ts">
import { resolveComponent } from 'vue'

const mastHeader = resolveComponent('MastHeader')
const mastFooter = resolveComponent('MastFooter')

const hasMastHeader = typeof mastHeader !== 'string'
const hasMastFooter = typeof mastFooter !== 'string'
</script>

<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <MastScroller>
    <component :is="mastHeader" v-if="hasMastHeader" />
    <MastMain>
      <slot />
    </MastMain>
    <component :is="mastFooter" v-if="hasMastFooter" />
    <LayoutGridDebug />
  </MastScroller>
</template>
