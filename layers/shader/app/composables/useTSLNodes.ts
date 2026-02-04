import * as TSL from 'three/tsl'
import * as animation from '../utils/tsl/animation'
import * as color from '../utils/tsl/color'
import * as math from '../utils/tsl/math'
import * as noise from '../utils/tsl/noise'
import * as patterns from '../utils/tsl/patterns'
import * as uv from '../utils/tsl/uv'

/**
 * Single access point for all TSL utilities
 */
export function useTSLNodes() {
  return {
    // Core TSL exports
    tsl: TSL,

    // Custom utility modules
    noise,
    math,
    color,
    uv,
    animation,
    patterns,

    // Commonly used TSL functions (convenience re-exports)
    float: TSL.float,
    vec2: TSL.vec2,
    vec3: TSL.vec3,
    vec4: TSL.vec4,
    color3: TSL.color,
    mat3: TSL.mat3,
    mat4: TSL.mat4,
    uniform: TSL.uniform,
    attribute: TSL.attribute,
    varying: TSL.varying,
    Fn: TSL.Fn,

    // Math
    add: TSL.add,
    sub: TSL.sub,
    mul: TSL.mul,
    div: TSL.div,
    mod: TSL.mod,
    abs: TSL.abs,
    sign: TSL.sign,
    floor: TSL.floor,
    ceil: TSL.ceil,
    fract: TSL.fract,
    round: TSL.round,
    min: TSL.min,
    max: TSL.max,
    clamp: TSL.clamp,
    mix: TSL.mix,
    smoothstep: TSL.smoothstep,
    pow: TSL.pow,
    sqrt: TSL.sqrt,
    exp: TSL.exp,
    log: TSL.log,

    // Trigonometry
    sin: TSL.sin,
    cos: TSL.cos,
    tan: TSL.tan,
    asin: TSL.asin,
    acos: TSL.acos,
    atan: TSL.atan,
    atan2: TSL.atan2,

    // Vector operations
    dot: TSL.dot,
    cross: TSL.cross,
    normalize: TSL.normalize,
    length: TSL.length,
    distance: TSL.distance,
    reflect: TSL.reflect,
    refract: TSL.refract,

    // Matrix operations
    transpose: TSL.transpose,
    inverse: TSL.inverse,

    // Texture
    texture: TSL.texture,
    sampler: TSL.sampler,

    // Built-in inputs
    uvCoord: TSL.uv,
    position: TSL.positionLocal,
    positionWorld: TSL.positionWorld,
    positionView: TSL.positionView,
    normal: TSL.normalLocal,
    normalWorld: TSL.normalWorld,
    normalView: TSL.normalView,
    viewDirection: TSL.positionViewDirection,
    cameraPosition: TSL.cameraPosition,
    time: TSL.time,
  }
}

/**
 * Get just the custom utility modules
 */
export function useTSLUtilities() {
  return {
    noise,
    math,
    color,
    uv,
    animation,
    patterns,
  }
}
