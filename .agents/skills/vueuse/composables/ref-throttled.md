# refThrottled

Throttle changing of a ref value.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { shallowRef } from 'vue'
import { refThrottled } from '@vueuse/core'

const input = shallowRef('')
const throttled = refThrottled(input, 1000)
```

## Reference

[VueUse Docs](https://vueuse.org/core/refThrottled/)
