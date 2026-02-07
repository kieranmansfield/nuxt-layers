<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>

  <ClientOnly>
    <div class="fixed top-4 right-4 z-50">
      <ThemePickerMenu />
    </div>
  </ClientOnly>
</template>
