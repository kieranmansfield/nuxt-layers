<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <MastScroller>
    <MastHeader />
    <MastMain>
      <slot />
    </MastMain>
    <MastFooter />
    <LayoutGridDebug />
  </MastScroller>
</template>
