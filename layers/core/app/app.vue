<template>
  <!-- UApp already renders UOverlayProvider; a second one rendered every overlay twice. -->
  <UApp>
    <LoadingScreen />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
