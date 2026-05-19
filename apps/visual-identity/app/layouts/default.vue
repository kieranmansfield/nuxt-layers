<template>
  <div class="flex h-screen overflow-hidden bg-(--ui-bg)">
    <BrandNav />
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
