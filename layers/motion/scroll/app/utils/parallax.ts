type ParallaxMotion = {
  speed: number
  direction: 'vertical' | 'horizontal'
  rotate: number
  scale: number
}

/** MotionParallax tween vars — only the properties that actually move, so GSAP leaves the rest. */
export function parallaxMotionVars({ speed, direction, rotate, scale }: ParallaxMotion) {
  const vars: { x?: number; y?: number; rotation?: number; scale?: number } = {}
  const travel = direction === 'vertical' ? speed * -200 : speed * 200
  if (travel !== 0) vars[direction === 'vertical' ? 'y' : 'x'] = travel
  if (rotate !== 0) vars.rotation = rotate
  if (scale !== 0) vars.scale = 1 + scale
  return vars
}
