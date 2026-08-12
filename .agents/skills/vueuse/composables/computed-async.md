# computedAsync

Computed for async functions.

**Package:** `@vueuse/core`
**Category:** Reactivity

## Usage

```ts
import { shallowRef } from 'vue'
import { computedAsync } from '@vueuse/core'

const name = shallowRef('jack')

const userInfo = computedAsync(
  async () => {
    return await mockLookUp(name.value)
  },
  null // initial state
)
```

## Reference

[VueUse Docs](https://vueuse.org/core/computedAsync/)
