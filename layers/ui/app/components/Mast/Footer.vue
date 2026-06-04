<script setup lang="ts">
const year = useState('footer-year', () => new Date().getFullYear())
</script>

<template>
  <UFooter>
    <template #bottom>
      <div class="pt-10">
        <p class="text-center text-sm text-neutral-300">
          Copyright © {{ year }}
        </p>
      </div>
    </template>
  </UFooter>
</template>
