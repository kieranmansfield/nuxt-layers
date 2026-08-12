# useCssVar

Manipulate CSS variables

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useTemplateRef } from 'vue'
import { useCssVar } from '@vueuse/core'

const el = useTemplateRef('el')
const color1 = useCssVar('--color', el)

const elv = useTemplateRef('elv')
const key = ref('--color')
const colorVal = useCssVar(key, elv)

const someEl = useTemplateRef('someEl')
const color2 = useCssVar('--color', someEl, { initialValue: '#eee' })
```

## Options

| Option  | Type      | Default | Description                                      |
| ------- | --------- | ------- | ------------------------------------------------ |
| observe | `boolean` | false   | Use MutationObserver to monitor variable changes |

## Reference

[VueUse Docs](https://vueuse.org/core/useCssVar/)
