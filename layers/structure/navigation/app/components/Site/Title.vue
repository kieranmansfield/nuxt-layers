<template>
  <span v-for="(word, index) in useSite().titleWords" :key="index" class="site-word">
    {{ word }}
  </span>
</template>
