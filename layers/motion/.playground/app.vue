<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showContent = ref(false)
const items = ref(Array.from({ length: 5 }, (_, i) => i))

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 500)
})

// Simple animation function for demo
const animateElement = (element: HTMLElement, className: string) => {
  element.classList.add(className)
  setTimeout(() => {
    element.classList.remove(className)
  }, 300)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-8">
    <div
      class="motion-transition transition-fade"
      :class="{ 'is-visible': showContent }"
    >
      <h1 class="text-4xl font-bold text-gray-800 mb-8">Motion Layer Playground</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Transition Demo</h2>
          <div class="space-y-4">
            <div
              v-for="item in items"
              :key="item"
              class="motion-transition transition-slide bg-blue-100 p-4 rounded-lg"
              :class="{ 'is-visible': showContent }"
              :style="{ transitionDelay: `${item * 100}ms` }"
            >
              Item {{ item + 1 }}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Animation Demo</h2>
          <div class="space-y-4">
            <button
              @click="animateElement($event.target as HTMLElement, 'animate-fade-in')"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Fade Animation
            </button>

            <button
              @click="animateElement($event.target as HTMLElement, 'animate-slide-in-up')"
              class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Slide Animation
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.motion-transition {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
}

.motion-transition.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>