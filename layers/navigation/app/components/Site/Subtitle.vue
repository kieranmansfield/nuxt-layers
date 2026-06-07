<template>
  <span v-for="(word, index) in useSite().subtitleWords" :key="index" class="site-word">
    {{ word }}
  </span>
</template>
