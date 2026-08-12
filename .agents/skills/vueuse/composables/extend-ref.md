# extendRef

Add extra attributes to Ref.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { shallowRef } from 'vue'
import { extendRef } from '@vueuse/core'

const myRef = shallowRef('content')

const extended = extendRef(myRef, { foo: 'extra data' })

extended.value === 'content'
extended.foo === 'extra data'
```

## Options

| Option     | Type      | Default | Description                          |
| ---------- | --------- | ------- | ------------------------------------ |
| enumerable | `boolean` | false   | Is the extends properties enumerable |
| unwrap     | `Unwrap`  | true    | Unwrap for Ref properties            |

## Reference

[VueUse Docs](https://vueuse.org/core/extendRef/)
