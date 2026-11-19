<script setup lang="ts">
  const year = useState('footer-year', () => new Date().getFullYear())
</script>

<template>
  <UFooter>
    <template #bottom>
      <div class="pt-10">
        <p class="text-muted text-center text-sm">Copyright © {{ year }}</p>
      </div>
    </template>
  </UFooter>
</template>
