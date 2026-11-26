import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { computed, h, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import Background from './Background.client.vue'

// A renderer that records what the component asks of it; WebGPU itself can't run in happy-dom.
const gpu = vi.hoisted(() => {
  class FakeRenderer {
    renders = 0
    disposed = false
    size: [number, number] = [0, 0]
    pixelRatio = 0
    toneMapping = 0
    outputColorSpace = ''
    constructor() {
      gpu.renderers.push(this)
    }
    init() {
      return gpu.initError ? Promise.reject(gpu.initError) : gpu.initGate
    }
    setPixelRatio(ratio: number) {
      this.pixelRatio = ratio
    }
    setSize(width: number, height: number) {
      this.size = [width, height]
    }
    setClearColor() {}
    compileAsync() {
      return Promise.resolve()
    }
    render() {
      this.renders++
    }
    dispose() {
      this.disposed = true
    }
  }
  return {
    FakeRenderer,
    renderers: [] as FakeRenderer[],
    initError: null as unknown,
    initGate: Promise.resolve() as Promise<void>,
  }
})

vi.mock('three/webgpu', () => ({
  WebGPURenderer: gpu.FakeRenderer,
  MeshBasicNodeMaterial: class {},
}))

type SizeRef = { value: number }
const env = vi.hoisted(() => ({
  refs: {} as Record<
    'windowWidth' | 'windowHeight' | 'elementWidth' | 'elementHeight' | 'pixelRatio',
    SizeRef
  > & { visible: { value: boolean } },
}))

vi.mock('@vueuse/core', async () => {
  const { ref: vueRef } = await import('vue')
  const refs = {
    windowWidth: vueRef(0),
    windowHeight: vueRef(0),
    elementWidth: vueRef(0),
    elementHeight: vueRef(0),
    pixelRatio: vueRef(1),
    visible: vueRef(true),
  }
  env.refs = refs
  return {
    useWindowSize: () => ({ width: refs.windowWidth, height: refs.windowHeight }),
    useElementSize: () => ({ width: refs.elementWidth, height: refs.elementHeight }),
    useDevicePixelRatio: () => ({ pixelRatio: refs.pixelRatio }),
    useElementVisibility: () => refs.visible,
  }
})
const refs = () => env.refs

// Manual frame queue: each flush() runs the frames pending at that moment, once.
const frames = new Map<number, FrameRequestCallback>()
// Mutable per-test state the stubs below read and write.
const page = {
  nextFrame: 0,
  styleSync: () => {},
  maxPixelRatio: undefined as number | undefined,
}
function flush() {
  const pending = [...frames.values()]
  frames.clear()
  for (const cb of pending) cb(0)
}

const reducedMotion = ref(false)

// Nuxt auto-imports these; the plain Vue test environment doesn't.
vi.stubGlobal('computed', computed)
vi.stubGlobal('ref', ref)
vi.stubGlobal('watch', watch)
vi.stubGlobal('useTemplateRef', useTemplateRef)
vi.stubGlobal('onMounted', onMounted)
vi.stubGlobal('onUnmounted', onUnmounted)
vi.stubGlobal('useThemeMotion', () => ({ effectiveReducedMotion: reducedMotion }))
vi.stubGlobal('useRootStyleObserver', (sync: () => void) => {
  page.styleSync = sync
})

vi.stubGlobal('useAppConfig', () => ({ shader: { maxPixelRatio: page.maxPixelRatio } }))

// Mounted components share the mocked refs above; one left mounted would react to the next test.
enableAutoUnmount(afterEach)

beforeEach(() => {
  frames.clear()
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    frames.set(++page.nextFrame, cb)
    return page.nextFrame
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  gpu.renderers.length = 0
  gpu.initError = null
  gpu.initGate = Promise.resolve()
  reducedMotion.value = false
  page.maxPixelRatio = undefined
  refs().windowWidth.value = 1280
  refs().windowHeight.value = 800
  refs().elementWidth.value = 400
  refs().elementHeight.value = 300
  refs().pixelRatio.value = 1
  refs().visible.value = true
})

async function mountReady(props: Record<string, unknown> = {}) {
  const wrapper = mount(Background, {
    props,
    slots: { fallback: () => h('p', { class: 'fallback' }, 'No GPU') },
  })
  await flushPromises()
  const [renderer] = gpu.renderers
  if (!renderer) throw new Error('ShaderBackground created no renderer')
  return { wrapper, renderer }
}

describe('ShaderBackground', () => {
  it('keeps one frame pending while visible and motion is allowed', async () => {
    const { renderer } = await mountReady()

    for (let i = 0; i < 3; i++) flush()

    expect(renderer.renders).toBe(4)
    expect(frames.size).toBe(1)
  })

  it('parks the loop under reduced motion, then draws one frame per kick', async () => {
    reducedMotion.value = true
    const { wrapper, renderer } = await mountReady()
    flush()
    expect(frames.size).toBe(0)
    const parked = renderer.renders

    // Two kicks before the next frame still draw once: a new frame replaces the pending one.
    const { kick } = wrapper.vm as unknown as { kick: () => void }
    kick()
    kick()
    expect(frames.size).toBe(1)
    flush()

    expect(renderer.renders).toBe(parked + 1)
    expect(frames.size).toBe(0)
  })

  it('draws one frame on a theme change while parked', async () => {
    reducedMotion.value = true
    const { renderer } = await mountReady()
    flush()
    const parked = renderer.renders

    page.styleSync()
    flush()

    expect(renderer.renders).toBe(parked + 1)
    expect(frames.size).toBe(0)
  })

  it('parks offscreen and resumes when visible again', async () => {
    const { renderer } = await mountReady()
    refs().visible.value = false
    await flushPromises()
    flush()
    flush()
    expect(frames.size).toBe(0)

    refs().visible.value = true
    await flushPromises()
    const before = renderer.renders
    flush()
    flush()

    expect(renderer.renders).toBe(before + 2)
    expect(frames.size).toBe(1)
  })

  it('sizes the drawing buffer to the container when not fixed', async () => {
    page.maxPixelRatio = 1.5
    refs().pixelRatio.value = 3
    const { renderer } = await mountReady({ fixed: false })

    expect(renderer.size).toEqual([400, 300])
    expect(renderer.pixelRatio).toBe(1.5)

    refs().elementWidth.value = 640
    await flushPromises()
    expect(renderer.size).toEqual([640, 300])

    // A collapsed container keeps the last good size instead of a 0×0 buffer.
    refs().elementHeight.value = 0
    await flushPromises()
    expect(renderer.size).toEqual([640, 300])
  })

  it('sizes the drawing buffer to the window when fixed', async () => {
    const { renderer } = await mountReady()

    expect(renderer.size).toEqual([1280, 800])
  })

  it('shows the fallback slot and emits error when the renderer cannot start', async () => {
    const failure = new Error('no adapter')
    gpu.initError = failure
    const { wrapper, renderer } = await mountReady()

    expect(wrapper.emitted('error')).toEqual([[failure]])
    expect(wrapper.emitted('ready')).toBeUndefined()
    expect(wrapper.find('.fallback').exists()).toBe(true)
    expect(wrapper.find('canvas').element.style.display).toBe('none')
    expect(renderer.disposed).toBe(true)
    expect(frames.size).toBe(0)
  })

  it('starts no loop when unmounted while the renderer is still starting', async () => {
    let release = () => {}
    gpu.initGate = new Promise<void>((resolve) => {
      release = resolve
    })
    const { wrapper, renderer } = await mountReady()

    wrapper.unmount()
    release()
    await flushPromises()

    expect(renderer.disposed).toBe(true)
    expect(renderer.renders).toBe(0)
    expect(frames.size).toBe(0)
  })
})
