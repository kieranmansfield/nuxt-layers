# createRef

Returns a or depending on the param.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { isShallow, ref } from 'vue'
import { createRef } from '@vueuse/core'

const initialData = 1

const shallowData = createRef(initialData)
const deepData = createRef(initialData, true)

isShallow(shallowData) // true
isShallow(deepData) // false
```

## Reference

[VueUse Docs](https://vueuse.org/core/createRef/)
