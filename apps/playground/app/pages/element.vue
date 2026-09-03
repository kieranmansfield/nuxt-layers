<template>
  <Element block p="xl">
    <h2>Grid container (container axis only)</h2>
    <Element grid :cols="12" gap="lg" p="lg" bg="var(--ui-bg-elevated)" radius="0.5rem">
      <Element bg="var(--color-green-400)" color="white" p="md" radius="0.25rem">
        Item placement isn't part of Element — use LayoutGridItem inside a grid for that, or CSS
        `grid-column`/`grid-row` directly via `:style`.
      </Element>
    </Element>
  </Element>

  <Element block p="xl">
    <h2>Flex + sizing + interaction</h2>
    <Element flex gap="md" p="lg" bg="var(--ui-bg-elevated)" radius="0.5rem">
      <Element
        w="80px"
        h="80px"
        bg="var(--color-green-400)"
        radius="9999px"
        cursor="pointer"
        select="none"
      />
      <Element
        w="160px"
        h="80px"
        bg="var(--color-green-500)"
        color="white"
        p="sm"
        radius="0.5rem"
        shadow="0 4px 12px rgb(0 0 0 / 0.15)"
      >
        card
      </Element>
      <Element
        min-w="120px"
        max-w="240px"
        h="80px"
        bg="var(--color-green-600)"
        color="white"
        p="sm"
        radius="0.5rem"
      >
        min/max width
      </Element>
    </Element>
  </Element>

  <Element block p="xl">
    <h2>Layout modes</h2>
    <Element flex gap="sm">
      <Element block bg="var(--color-green-400)" p="sm" radius="0.25rem" color="white">
        block
      </Element>
      <Element flex bg="var(--color-green-500)" p="sm" radius="0.25rem" color="white">
        flex
      </Element>
      <Element hidden bg="var(--color-green-600)" p="sm" radius="0.25rem" color="white">
        hidden (not rendered visibly)
      </Element>
    </Element>
  </Element>

  <Element block p="xl">
    <h2>Margin</h2>
    <Element bg="var(--ui-bg-elevated)" p="md">
      <Element bg="var(--color-green-500)" color="white" p="sm" m="lg" radius="0.25rem">
        m="lg" pushes this box away from its siblings
      </Element>
    </Element>
  </Element>
</template>
