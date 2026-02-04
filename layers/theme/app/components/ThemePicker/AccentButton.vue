<!-- eslint-disable no-console -->
<script lang="ts" setup>
// import { useTheme } from '../composables/themestore'

defineProps<{
  theme: string
}>()

// const themeStore = useTheme()

// function handleSetTheme(themes: string) {
//   themeStore.setTheme(themes)
//   console.log(themeStore.currentTheme)
// }
</script>

<template>
  <div>
    <UButton :label="theme" />
    <!-- <button
      class="bg-linear-to-tr duration-800 hover:bg-linear-to-bl h-10 w-10 rounded-full shadow-lg ring-1 transition ease-in-out hover:shadow-xl"
      :class="[
        theme ? `btn-${theme.toLowerCase()} hover:btn-${theme.toLowerCase()}` : '',
        themeStore.currentTheme === theme
          ? 'shadow-2xl ring-2 ring-offset-2 ring-offset-gray-800/40'
          : '',
      ]"
      @click="handleSetTheme(theme)"
    /> -->
  </div>
</template>

<!-- 
'shadow-2xl ring-2 ring-white ring-offset-2 ring-offset-gray-800 ring-inset'
      class="h-10 w-10 rounded-full border-2 shadow-lg transition duration-800 ease-in-out hover:shadow-xl"
-->

<!-- <style lang="css" scoped>
@reference "~/assets/css/main.css";

.btn-red {
  /* @apply bg-red-400 hover:bg-red-300; */

  @apply from-red-400 to-red-600 shadow-red-500/40 ring-red-800 hover:from-red-300 hover:to-red-400 hover:shadow-red-400/60;
  @apply dark:from-red-300 dark:to-red-500 dark:shadow-red-300/30 dark:ring-red-500 dark:hover:from-red-100 dark:hover:to-red-300 hover:dark:shadow-red-200/40;
}

.btn-orange {
  /* @apply bg-orange-400 hover:bg-orange-300; */

  @apply from-orange-400 to-orange-600 shadow-orange-500/40 ring-orange-800 hover:from-orange-300 hover:to-orange-400 hover:shadow-orange-400/60;
  @apply dark:from-orange-300 dark:to-orange-500 dark:shadow-orange-300/30 dark:ring-orange-500 dark:hover:from-orange-100 dark:hover:to-orange-300 hover:dark:shadow-orange-200/40;
}

.btn-blue {
  /* @apply bg-blue-400 hover:bg-blue-300; */
  @apply from-blue-400 to-blue-600 shadow-blue-500/40 ring-blue-800 hover:from-blue-300 hover:to-blue-400 hover:shadow-blue-400/60;
  @apply dark:from-blue-300 dark:to-blue-500 dark:shadow-blue-300/40 dark:ring-blue-500 dark:hover:from-blue-100 dark:hover:to-blue-300 hover:dark:shadow-blue-200/40;
}

.btn-purple {
  /* @apply bg-purple-400 hover:bg-purple-300; */
  @apply from-purple-400 to-purple-600 shadow-purple-500/40 ring-purple-800 hover:from-purple-300 hover:to-purple-400 hover:shadow-purple-400/60;
  @apply dark:from-purple-300 dark:to-purple-500 dark:shadow-purple-300/40 dark:ring-purple-500 dark:hover:from-purple-100 dark:hover:to-purple-300 hover:dark:shadow-purple-200/40;
}

.btn-violet {
  /* @apply bg-violet-400 hover:bg-violet-300; */

  @apply from-violet-400 to-violet-600 shadow-violet-500/40 ring-violet-800 hover:from-violet-300 hover:to-violet-400 hover:shadow-violet-400/60;
  @apply dark:from-violet-300 dark:to-violet-500 dark:shadow-violet-300/40 dark:ring-violet-500 dark:hover:from-violet-100 dark:hover:to-violet-300 hover:dark:shadow-violet-200/40;
}

.btn-green {
  /* @apply bg-green-400 hover:bg-green-300; */
  @apply from-green-400 to-green-600 shadow-green-500/40 ring-green-800 hover:from-green-300 hover:to-green-400 hover:shadow-green-400/60;
  @apply dark:from-green-300 dark:to-green-500 dark:shadow-green-300/40 dark:ring-green-500 dark:hover:from-green-100 dark:hover:to-green-300 hover:dark:shadow-green-200/40;
}

.btn-pink {
  /* @apply bg-pink-400 hover:bg-pink-300; */

  @apply from-pink-400 to-pink-600 shadow-pink-500/40 ring-pink-800 hover:from-pink-300 hover:to-pink-400 hover:shadow-pink-400/60;
  @apply dark:from-pink-300 dark:to-pink-500 dark:shadow-pink-300/40 dark:ring-pink-500 dark:hover:from-pink-100 dark:hover:to-pink-300 hover:dark:shadow-pink-200/40;
}

.btn-gray {
  /* @apply bg-gray-400 hover:bg-gray-300; */

  @apply from-gray-400 to-gray-600 shadow-gray-500/40 ring-gray-800 hover:from-gray-300 hover:to-gray-400 hover:shadow-gray-400/60;
  @apply dark:from-gray-300 dark:to-gray-500 dark:shadow-gray-300/40 dark:ring-gray-500 dark:hover:from-gray-100 dark:hover:to-gray-300 hover:dark:shadow-gray-200/40;
}

.btn-cyan {
  /* @apply bg-cyan-400 hover:bg-cyan-300; */

  @apply from-cyan-400 to-cyan-600 shadow-cyan-500/40 ring-cyan-800 hover:from-cyan-300 hover:to-cyan-400 hover:shadow-cyan-400/60;
  @apply dark:from-cyan-300 dark:to-cyan-500 dark:shadow-cyan-300/40 dark:ring-cyan-500 dark:hover:from-cyan-100 dark:hover:to-cyan-300 hover:dark:shadow-cyan-200/40;
}
</style> -->
