# Tasks

- [ ] Use `useMouse` from VueUse to track mouse position: https://vueuse.org/core/useMouse/

```ts
const { x, y } = useMouse({ touch: false })
```

```vue
<template>
  <UseMouse v-slot="{ x, y }">
    x: {{ x }}
    y: {{ y }}
  </UseMouse>
</template>
```
