# Use these composables from `@vueuse/core`

- `usePreferredColorScheme()`
- `usePreferredContrast()`
- `usePreferredReducedMotion()`
- `usePreferredReducedTransparency()`

## components

```vue
<template>
  <UsePreferredColorScheme v-slot="{ colorScheme }">
    Preferred Color Scheme: {{ colorScheme }}
  </UsePreferredColorScheme>
</template>
```

```vue
<template>
  <UsePreferredContrast v-slot="{ contrast }">
    Preferred Contrast: {{ contrast }}
  </UsePreferredContrast>
</template>
```
