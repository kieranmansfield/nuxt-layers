<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
import { Clock, DoubleSide, ShaderMaterial, TextureLoader } from 'three'
import type { Texture } from 'three'

const props = withDefaults(
  defineProps<{
    distortion?: number
    mouseRipple?: boolean
    grayscale?: number
    rgbShift?: number
    vignette?: boolean
    mouseX?: number
    mouseY?: number
    disableZoom?: boolean
  }>(),
  {
    distortion: 0.02,
    mouseRipple: true,
    grayscale: 0,
    rgbShift: 0,
    vignette: true,
    mouseX: 0.5,
    mouseY: 0.5,
    disableZoom: false,
  }
)

const loadedTexture = ref<Texture | null>(null)

// Load a sample image
onMounted(async () => {
  const loader = new TextureLoader()
  // Using a placeholder image - in production you'd use an actual image
  loadedTexture.value = await loader.loadAsync('https://picsum.photos/1024/1024')
})

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
uniform float uDistortion;
uniform float uDistortionSpeed;
uniform float uMouseX;
uniform float uMouseY;
uniform float uRippleStrength;
uniform float uGrayscale;
uniform float uRgbShift;
uniform float uVignetteIntensity;
uniform bool uMouseRipple;
uniform bool uVignette;
uniform float uZoom;
varying vec2 vUv;

// Simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;

  // Apply zoom (centered)
  float zoomFactor = 1.0 / uZoom;
  float zoomOffset = (1.0 - zoomFactor) / 2.0;
  uv = uv * zoomFactor + zoomOffset;

  // Apply distortion
  if (uDistortion > 0.0) {
    vec2 animatedUV = uv + uTime * uDistortionSpeed;
    float noise = snoise(animatedUV * 3.0);
    uv += noise * uDistortion * 0.1;
  }

  // Apply mouse ripple effect
  if (uMouseRipple) {
    vec2 mousePos = vec2(uMouseX, uMouseY);
    vec2 diff = uv - mousePos;
    float dist = length(diff);
    float ripple = sin(dist * 30.0 - uTime * 3.0) * uRippleStrength;
    float falloff = smoothstep(0.5, 0.0, dist);
    uv += normalize(diff) * ripple * falloff;
  }

  // Sample with RGB shift for chromatic aberration
  float shift = uRgbShift * 0.01;
  float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;
  float a = texture2D(uTexture, uv).a;
  vec4 color = vec4(r, g, b, a);

  // Apply grayscale
  if (uGrayscale > 0.0) {
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    color.rgb = mix(color.rgb, vec3(gray), uGrayscale);
  }

  // Apply vignette
  if (uVignette) {
    vec2 center = vec2(0.5, 0.5);
    float dist = length(vUv - center);
    float vignetteAmount = smoothstep(0.2, 0.8, dist) * uVignetteIntensity;
    color.rgb *= 1.0 - vignetteAmount;
  }

  gl_FragColor = color;
}
`

const material = computed(() => {
  if (!loadedTexture.value) return null

  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTexture: { value: loadedTexture.value },
      uTime: { value: 0 },
      uDistortion: { value: props.distortion },
      uDistortionSpeed: { value: 1 },
      uMouseX: { value: props.mouseX },
      uMouseY: { value: props.mouseY },
      uRippleStrength: { value: 0.02 },
      uGrayscale: { value: props.grayscale },
      uRgbShift: { value: props.rgbShift },
      uVignetteIntensity: { value: 0.5 },
      uMouseRipple: { value: props.mouseRipple },
      uVignette: { value: props.vignette },
      uZoom: { value: 1 },
    },
    side: DoubleSide,
  })
})

// Animation
const clock = new Clock()
let animationId: number

const animate = () => {
  if (material.value?.uniforms) {
    const { uniforms } = material.value
    const elapsed = clock.getElapsedTime()
    if (uniforms.uTime) uniforms.uTime.value = elapsed
    if (uniforms.uDistortion) uniforms.uDistortion.value = props.distortion
    if (uniforms.uMouseX) uniforms.uMouseX.value = props.mouseX
    if (uniforms.uMouseY) uniforms.uMouseY.value = props.mouseY
    if (uniforms.uGrayscale) uniforms.uGrayscale.value = props.grayscale
    if (uniforms.uRgbShift) uniforms.uRgbShift.value = props.rgbShift
    if (uniforms.uMouseRipple) uniforms.uMouseRipple.value = props.mouseRipple
    if (uniforms.uVignette) uniforms.uVignette.value = props.vignette
  }
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <TresCanvas clear-color="#0a0a0a">
    <TresPerspectiveCamera :position="[0, 0, 2]" />
    <OrbitControls :enable-zoom="!disableZoom" />

    <TresMesh v-if="material">
      <TresPlaneGeometry :args="[3, 3, 1, 1]" />
      <primitive :object="material" attach="material" />
    </TresMesh>

    <!-- Loading placeholder -->
    <TresMesh v-else>
      <TresPlaneGeometry :args="[3, 3, 1, 1]" />
      <TresMeshBasicMaterial color="#1a1a2e" />
    </TresMesh>
  </TresCanvas>
</template>
