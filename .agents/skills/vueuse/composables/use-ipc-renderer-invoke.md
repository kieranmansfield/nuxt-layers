# useIpcRendererInvoke

Reactive ipcRenderer.invoke API result. Make asynchronous operations look synchronous.

**Package:** `@vueuse/electron`
**Category:** '@Electron'

## Usage

```ts
import { computed } from 'vue'
import { useIpcRendererInvoke } from '@vueuse/electron'

// enable nodeIntegration if you don't provide ipcRenderer explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// Ref result will return
const result = useIpcRendererInvoke<string>('custom-channel', 'some data')
const msg = computed(() => result.value?.msg)
```

## Reference

[VueUse Docs](https://vueuse.org/core/useIpcRendererInvoke/)
