<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <MastScroller>
    <MastHeader />
    <MastMain>
      <slot />
    </MastMain>
    <LazyMastFooter />
    <LayoutGridDebug />
  </MastScroller>
</template>
