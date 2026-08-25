# watchTriggerable

Watch that can be triggered manually

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { nextTick, shallowRef } from 'vue'
import { watchTriggerable } from '@vueuse/core'

const source = shallowRef(0)

const { trigger, ignoreUpdates } = watchTriggerable(source, (v) => console.log(`Changed to ${v}!`))

source.value = 'bar'
await nextTick() // logs: Changed to bar!

// Execution of WatchCallback via `trigger` does not require waiting
trigger() // logs: Changed to bar!
```

## Returns

| Name    | Type  |
| ------- | ----- |
| trigger | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/watchTriggerable/)
