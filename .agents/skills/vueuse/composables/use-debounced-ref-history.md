# useDebouncedRefHistory

Shorthand for with debounced filter.

**Package:** `@vueuse/core`
**Category:** State

## Usage

```ts
import { shallowRef } from 'vue'
import { useDebouncedRefHistory } from '@vueuse/core'

const counter = shallowRef(0)
const { history, undo, redo } = useDebouncedRefHistory(counter, { deep: true, debounce: 1000 })
```

## Reference

[VueUse Docs](https://vueuse.org/core/useDebouncedRefHistory/)
