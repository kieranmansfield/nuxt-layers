import { gsap } from 'gsap'

// Dynamic imports so only the pages that use a plugin pay for it. useGsap() keeps the core set.
const loaders = {
  Draggable: () => import('gsap/Draggable').then((m) => m.Draggable),
  InertiaPlugin: () => import('gsap/InertiaPlugin').then((m) => m.InertiaPlugin),
  DrawSVGPlugin: () => import('gsap/DrawSVGPlugin').then((m) => m.DrawSVGPlugin),
  MorphSVGPlugin: () => import('gsap/MorphSVGPlugin').then((m) => m.MorphSVGPlugin),
  MotionPathPlugin: () => import('gsap/MotionPathPlugin').then((m) => m.MotionPathPlugin),
  ScrambleTextPlugin: () => import('gsap/ScrambleTextPlugin').then((m) => m.ScrambleTextPlugin),
  TextPlugin: () => import('gsap/TextPlugin').then((m) => m.TextPlugin),
  Physics2DPlugin: () => import('gsap/Physics2DPlugin').then((m) => m.Physics2DPlugin),
}

export type GsapPluginName = keyof typeof loaders

/**
 * Loads and registers free GSAP plugins on demand. Registering twice is harmless. Call it on the
 * client, for example in `onMounted`.
 *
 * @example
 * const [Draggable] = await loadGsapPlugins('Draggable', 'InertiaPlugin')
 * Draggable.create(el, { type: 'x', inertia: true })
 */
export async function loadGsapPlugins<const Names extends GsapPluginName[]>(...names: Names) {
  const plugins = await Promise.all(names.map((name) => loaders[name]()))
  gsap.registerPlugin(...plugins)
  return plugins as {
    [I in keyof Names]: Awaited<ReturnType<(typeof loaders)[Names[I]]>>
  }
}
