<script setup lang="ts">
  import { DoubleSide, type Texture } from 'three'
  import {
    float,
    mix,
    sin,
    smoothstep,
    texture,
    time as tslTime,
    uniform,
    uv,
    vec2,
    vec3,
    vec4,
  } from 'three/tsl'
  import { MeshBasicNodeMaterial, TextureLoader } from 'three/webgpu'

  import type { TSLNode } from '../../types'
  import { simplexNoise2D } from '../../utils/tsl/noise'

  const {
    src,
    distortion = 0,
    distortionSpeed = 1,
    mouseRipple = false,
    rippleStrength = 0.02,
    zoom = 1,
    grayscale = 0,
    rgbShift = 0,
    vignette = false,
    vignetteIntensity = 0.5,
    transparent = false,
    mouseX = 0.5,
    mouseY = 0.5,
  } = defineProps<{
    /** Image source URL or path */
    src: string
    /** Distortion effect strength (0 = none) */
    distortion?: number
    /** Distortion speed */
    distortionSpeed?: number
    /** Enable mouse-reactive ripple effect */
    mouseRipple?: boolean
    /** Ripple strength */
    rippleStrength?: number
    /** Zoom level (1 = normal) */
    zoom?: number
    /** Grayscale amount (0-1) */
    grayscale?: number
    /** RGB shift/chromatic aberration amount */
    rgbShift?: number
    /** Enable vignette effect */
    vignette?: boolean
    /** Vignette intensity */
    vignetteIntensity?: number
    /** Transparent background */
    transparent?: boolean
    /** Mouse X position (0-1) for external control */
    mouseX?: number
    /** Mouse Y position (0-1) for external control */
    mouseY?: number
  }>()

  const loadedTexture = ref<Texture | null>(null)
  const isLoading = ref(true)
  const error = ref<Error | null>(null)

  // Reactive uniforms
  const mouseXUniform = uniform(mouseX)
  const mouseYUniform = uniform(mouseY)
  const distortionUniform = uniform(distortion)
  const distortionSpeedUniform = uniform(distortionSpeed)
  const rippleStrengthUniform = uniform(rippleStrength)
  const zoomUniform = uniform(zoom)
  const grayscaleUniform = uniform(grayscale)
  const rgbShiftUniform = uniform(rgbShift)
  const vignetteIntensityUniform = uniform(vignetteIntensity)

  // Watch all prop changes for reactivity
  watch(
    () => mouseX,
    (val) => {
      mouseXUniform.value = val
    }
  )
  watch(
    () => mouseY,
    (val) => {
      mouseYUniform.value = val
    }
  )
  watch(
    () => distortion,
    (val) => {
      distortionUniform.value = val
    }
  )
  watch(
    () => distortionSpeed,
    (val) => {
      distortionSpeedUniform.value = val
    }
  )
  watch(
    () => rippleStrength,
    (val) => {
      rippleStrengthUniform.value = val
    }
  )
  watch(
    () => zoom,
    (val) => {
      zoomUniform.value = val
    }
  )
  watch(
    () => grayscale,
    (val) => {
      grayscaleUniform.value = val
    }
  )
  watch(
    () => rgbShift,
    (val) => {
      rgbShiftUniform.value = val
    }
  )
  watch(
    () => vignetteIntensity,
    (val) => {
      vignetteIntensityUniform.value = val
    }
  )

  // Load texture
  watch(
    () => src,
    async (src) => {
      if (!src) return

      isLoading.value = true
      error.value = null

      try {
        const loader = new TextureLoader()
        loadedTexture.value = await loader.loadAsync(src)
      } catch (e) {
        error.value = e as Error
        console.error('Failed to load texture:', e)
      } finally {
        isLoading.value = false
      }
    },
    { immediate: true }
  )

  const material = computed(() => {
    if (!loadedTexture.value) return null

    const mat = new MeshBasicNodeMaterial()
    const tex = loadedTexture.value

    // Start with base UV
    let uvCoord: TSLNode = uv()

    // Apply zoom (centered) - using uniform for reactivity
    const zoomFactor = float(1).div(zoomUniform)
    const zoomOffset = float(1).sub(float(1).div(zoomUniform)).mul(0.5)
    uvCoord = uvCoord.mul(zoomFactor).add(zoomOffset)

    // Apply distortion using uniforms
    const animatedUV = uvCoord.add(tslTime.mul(distortionSpeedUniform))
    const noiseVal = simplexNoise2D(animatedUV.mul(3))
    const distortedUV = uvCoord.add(noiseVal.mul(distortionUniform).mul(0.1))
    // Use step to conditionally apply distortion
    const hasDistortion = distortionUniform.greaterThan(0.001)
    uvCoord = hasDistortion.select(distortedUV, uvCoord)

    // Apply mouse ripple effect
    if (mouseRipple) {
      const mousePos = vec2(mouseXUniform, mouseYUniform)
      const diff = uvCoord.sub(mousePos)
      const dist = diff.length()
      const ripple = sin(dist.mul(30).sub(tslTime.mul(3))).mul(rippleStrengthUniform)
      const falloff = smoothstep(0.5, 0, dist)
      uvCoord = uvCoord.add(diff.normalize().mul(ripple).mul(falloff))
    }

    // Sample the texture with RGB shift for chromatic aberration
    const shift = rgbShiftUniform.mul(0.01)
    const rChannel = texture(tex, uvCoord.add(vec2(shift, 0))).r
    const gChannel = texture(tex, uvCoord).g
    const bChannel = texture(tex, uvCoord.sub(vec2(shift, 0))).b
    const aChannel = texture(tex, uvCoord).a

    let colorNode: TSLNode = vec4(rChannel, gChannel, bChannel, aChannel)

    // Apply grayscale using uniform
    const rgb = vec3(colorNode.x, colorNode.y, colorNode.z)
    const gray = rgb.dot(vec3(0.299, 0.587, 0.114))
    const grayColor = vec3(gray, gray, gray)
    const blendedRgb = mix(rgb, grayColor, grayscaleUniform)
    colorNode = vec4(blendedRgb.x, blendedRgb.y, blendedRgb.z, colorNode.w)

    // Apply vignette
    if (vignette) {
      const center = vec2(0.5, 0.5)
      const dist = uv().sub(center).length()
      const vignetteAmount = smoothstep(0.2, 0.8, dist).mul(vignetteIntensityUniform)
      colorNode = colorNode.mul(float(1).sub(vignetteAmount))
    }

    mat.colorNode = colorNode
    mat.transparent = transparent
    mat.side = DoubleSide

    return mat
  })

  defineExpose({
    material,
    isLoading,
    error,
    loadedTexture,
  })
</script>

<template>
  <primitive v-if="material" :object="material" attach="material" />
</template>
