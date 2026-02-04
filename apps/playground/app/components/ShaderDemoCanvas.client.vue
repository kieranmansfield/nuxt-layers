<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
import { Clock, Color, DoubleSide, ShaderMaterial } from 'three'

const props = withDefaults(
  defineProps<{
    activeDemo: 'noise' | 'gradient' | 'fresnel' | 'mesh' | 'stripe' | 'aurora' | 'radial' | 'image'
    /** Enable mouse interaction */
    mouseInteraction?: boolean
    /** Mouse X position (0-1) */
    mouseX?: number
    /** Mouse Y position (0-1) */
    mouseY?: number
    /** Disable zoom controls */
    disableZoom?: boolean
    /** Mouse interaction strength (0-2) */
    mouseStrength?: number
    /** Animation speed multiplier */
    speed?: number
    /** Noise/pattern scale */
    scale?: number
  }>(),
  {
    mouseInteraction: true,
    mouseX: 0.5,
    mouseY: 0.5,
    disableZoom: false,
    mouseStrength: 0.5,
    speed: 1.0,
    scale: 1.0,
  }
)

// ============================================
// STRIPE GRADIENT (animated flowing gradient)
// ============================================
const stripeVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const stripeFragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform float uMouseX;
uniform float uMouseY;
uniform float uMouseStrength;
varying vec2 vUv;

// Simplex noise function
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
  float time = uTime * 0.15;

  // Add mouse interaction offset
  vec2 mouseOffset = vec2(uMouseX - 0.5, uMouseY - 0.5) * uMouseStrength;
  uv += mouseOffset;

  // Create flowing noise patterns
  float n1 = snoise(uv * 1.5 + vec2(time, time * 0.5)) * 0.5 + 0.5;
  float n2 = snoise(uv * 2.0 + vec2(-time * 0.7, time * 0.3)) * 0.5 + 0.5;
  float n3 = snoise(uv * 1.2 + vec2(time * 0.4, -time * 0.6)) * 0.5 + 0.5;

  // Blend multiple colors based on noise
  vec3 color = uColor1;
  color = mix(color, uColor2, smoothstep(0.0, 0.5, n1));
  color = mix(color, uColor3, smoothstep(0.3, 0.7, n2));
  color = mix(color, uColor4, smoothstep(0.4, 0.8, n3));
  color = mix(color, uColor5, smoothstep(0.6, 1.0, n1 * n2));

  // Add subtle brightness variation
  float brightness = 0.9 + 0.1 * snoise(uv * 3.0 + time);
  color *= brightness;

  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// MESH GRADIENT (organic blob shapes)
// ============================================
const meshVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const meshFragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uMouseX;
uniform float uMouseY;
uniform float uMouseStrength;
varying vec2 vUv;

// Smooth blob function
float blob(vec2 uv, vec2 center, float radius, float softness) {
  float d = distance(uv, center);
  return smoothstep(radius + softness, radius - softness, d);
}

void main() {
  vec2 uv = vUv;
  float time = uTime * 0.3;

  // Animated blob centers with mouse influence
  vec2 mouseInfluence = vec2(uMouseX - 0.5, uMouseY - 0.5) * uMouseStrength;
  vec2 c1 = vec2(0.3 + sin(time) * 0.15, 0.3 + cos(time * 0.8) * 0.15) + mouseInfluence * 0.3;
  vec2 c2 = vec2(0.7 + cos(time * 0.7) * 0.15, 0.4 + sin(time * 0.9) * 0.15) - mouseInfluence * 0.2;
  vec2 c3 = vec2(0.5 + sin(time * 0.6) * 0.15, 0.7 + cos(time * 1.1) * 0.15) + mouseInfluence * 0.4;
  vec2 c4 = vec2(0.2 + cos(time * 0.5) * 0.1, 0.6 + sin(time * 0.7) * 0.1) - mouseInfluence * 0.25;

  // Create blobs with different sizes
  float b1 = blob(uv, c1, 0.35, 0.25);
  float b2 = blob(uv, c2, 0.3, 0.2);
  float b3 = blob(uv, c3, 0.28, 0.22);
  float b4 = blob(uv, c4, 0.25, 0.18);

  // Mix colors based on blob influence
  vec3 color = uColor1;
  color = mix(color, uColor2, b1);
  color = mix(color, uColor3, b2 * 0.8);
  color = mix(color, uColor4, b3 * 0.7);
  color = mix(color, uColor2, b4 * 0.5);

  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// AURORA GRADIENT (northern lights)
// ============================================
const auroraVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const auroraFragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uMouseX;
uniform float uMouseY;
uniform float uMouseStrength;
varying vec2 vUv;

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
  float time = uTime * 0.2;

  // Mouse influence on aurora movement
  float mouseXInfluence = (uMouseX - 0.5) * uMouseStrength;

  // Vertical curtain effect
  float curtain1 = snoise(vec2(uv.x * 3.0 + time + mouseXInfluence, uv.y * 0.5 + time * 0.3));
  float curtain2 = snoise(vec2(uv.x * 4.0 - time * 0.7 - mouseXInfluence, uv.y * 0.3 + time * 0.2));
  float curtain3 = snoise(vec2(uv.x * 2.5 + time * 0.5 + mouseXInfluence * 0.5, uv.y * 0.4 - time * 0.1));

  // Combine curtains with vertical fade
  float fade = pow(1.0 - uv.y, 1.5);
  float aurora = (curtain1 * 0.5 + curtain2 * 0.3 + curtain3 * 0.2) * fade;
  aurora = smoothstep(-0.2, 0.8, aurora);

  // Color mixing
  vec3 color = mix(uColor1, uColor2, aurora);
  color = mix(color, uColor3, curtain2 * fade * 0.5);

  // Add glow
  color += vec3(0.05, 0.1, 0.05) * aurora;

  // Dark sky background
  vec3 sky = vec3(0.02, 0.02, 0.05);
  color = mix(sky, color, aurora + 0.1);

  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// RADIAL GRADIENT
// ============================================
const radialVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const radialFragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uMouseX;
uniform float uMouseY;
uniform float uMouseStrength;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  float time = uTime * 0.3;

  // Mouse-influenced center offset
  vec2 mouseOffset = vec2(uMouseX - 0.5, uMouseY - 0.5) * uMouseStrength;
  vec2 offset = vec2(sin(time) * 0.1, cos(time * 0.7) * 0.1) + mouseOffset;
  float d = length(uv - offset);

  // Pulsing radius
  float pulse = 0.3 + sin(time * 2.0) * 0.05;

  // Multi-ring gradient
  float ring1 = smoothstep(pulse, pulse + 0.3, d);
  float ring2 = smoothstep(pulse + 0.15, pulse + 0.45, d);

  vec3 color = uColor1;
  color = mix(color, uColor2, ring1);
  color = mix(color, uColor3, ring2);

  // Add subtle glow at center
  float glow = exp(-d * 3.0) * 0.3;
  color += uColor1 * glow;

  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// NOISE GRADIENT (FBM)
// ============================================
const noiseVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const noiseFragmentShader = `
uniform float uTime;
uniform vec3 uBaseColor;
uniform vec3 uPeakColor;
uniform float uMouseX;
uniform float uMouseY;
uniform float uMouseStrength;
varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
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

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}

void main() {
  vec2 mouseOffset = vec2(uMouseX - 0.5, uMouseY - 0.5) * uMouseStrength;
  vec2 uv = vUv * 4.0 + uTime * 0.3 + mouseOffset;
  float noise = fbm(uv) * 0.5 + 0.5;
  vec3 color = mix(uBaseColor, uPeakColor, noise);
  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// LINEAR GRADIENT
// ============================================
const gradientVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const gradientFragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uMouseX;
uniform float uMouseY;
uniform float uMouseStrength;
varying vec2 vUv;

void main() {
  float mouseInfluence = (uMouseX - 0.5) * uMouseStrength;
  float t = vUv.y + sin(uTime * 0.5) * 0.1 + mouseInfluence;
  vec3 color;
  if (t < 0.5) {
    color = mix(uColor1, uColor2, t * 2.0);
  } else {
    color = mix(uColor2, uColor3, (t - 0.5) * 2.0);
  }
  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// FRESNEL (rim lighting)
// ============================================
const fresnelVertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`

const fresnelFragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uFresnelColor;
uniform float uPower;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uPower);
  vec3 color = mix(uBaseColor, uFresnelColor, fresnel);
  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// CREATE MATERIALS
// ============================================

// Stripe gradient (like stripe.com)
const stripeMaterial = new ShaderMaterial({
  vertexShader: stripeVertexShader,
  fragmentShader: stripeFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new Color('#0a2540') },
    uColor2: { value: new Color('#635bff') },
    uColor3: { value: new Color('#00d4ff') },
    uColor4: { value: new Color('#7a73ff') },
    uColor5: { value: new Color('#80e9ff') },
    uMouseX: { value: 0.5 },
    uMouseY: { value: 0.5 },
    uMouseStrength: { value: 0.3 },
  },
  side: DoubleSide,
})

// Mesh gradient (organic blobs)
const meshMaterial = new ShaderMaterial({
  vertexShader: meshVertexShader,
  fragmentShader: meshFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new Color('#1a1a2e') },
    uColor2: { value: new Color('#e94560') },
    uColor3: { value: new Color('#0f3460') },
    uColor4: { value: new Color('#16213e') },
    uMouseX: { value: 0.5 },
    uMouseY: { value: 0.5 },
    uMouseStrength: { value: 0.5 },
  },
  side: DoubleSide,
})

// Aurora gradient
const auroraMaterial = new ShaderMaterial({
  vertexShader: auroraVertexShader,
  fragmentShader: auroraFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new Color('#00ff87') },
    uColor2: { value: new Color('#60efff') },
    uColor3: { value: new Color('#ff00ea') },
    uMouseX: { value: 0.5 },
    uMouseY: { value: 0.5 },
    uMouseStrength: { value: 0.5 },
  },
  side: DoubleSide,
})

// Radial gradient
const radialMaterial = new ShaderMaterial({
  vertexShader: radialVertexShader,
  fragmentShader: radialFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new Color('#ff6b6b') },
    uColor2: { value: new Color('#4ecdc4') },
    uColor3: { value: new Color('#1a1a2e') },
    uMouseX: { value: 0.5 },
    uMouseY: { value: 0.5 },
    uMouseStrength: { value: 0.5 },
  },
  side: DoubleSide,
})

// Noise material
const noiseMaterial = new ShaderMaterial({
  vertexShader: noiseVertexShader,
  fragmentShader: noiseFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uBaseColor: { value: new Color('#0f172a') },
    uPeakColor: { value: new Color('#8b5cf6') },
    uMouseX: { value: 0.5 },
    uMouseY: { value: 0.5 },
    uMouseStrength: { value: 1.0 },
  },
  side: DoubleSide,
})

// Linear gradient material
const gradientMaterial = new ShaderMaterial({
  vertexShader: gradientVertexShader,
  fragmentShader: gradientFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new Color('#3b82f6') },
    uColor2: { value: new Color('#8b5cf6') },
    uColor3: { value: new Color('#ec4899') },
    uMouseX: { value: 0.5 },
    uMouseY: { value: 0.5 },
    uMouseStrength: { value: 0.3 },
  },
  side: DoubleSide,
})

// Fresnel material
const fresnelMaterial = new ShaderMaterial({
  vertexShader: fresnelVertexShader,
  fragmentShader: fresnelFragmentShader,
  uniforms: {
    uBaseColor: { value: new Color('#1e1b4b') },
    uFresnelColor: { value: new Color('#22d3ee') },
    uPower: { value: 3.0 },
  },
  side: DoubleSide,
})

// All materials with mouse uniforms
const materialsWithMouse = [
  stripeMaterial,
  meshMaterial,
  auroraMaterial,
  radialMaterial,
  noiseMaterial,
  gradientMaterial,
]

// ============================================
// ANIMATION
// ============================================
const clock = new Clock()

let animationId: number
const animate = () => {
  const elapsed = clock.getElapsedTime() * props.speed

  // Update all time-based uniforms
  if (stripeMaterial.uniforms.uTime) stripeMaterial.uniforms.uTime.value = elapsed
  if (meshMaterial.uniforms.uTime) meshMaterial.uniforms.uTime.value = elapsed
  if (auroraMaterial.uniforms.uTime) auroraMaterial.uniforms.uTime.value = elapsed
  if (radialMaterial.uniforms.uTime) radialMaterial.uniforms.uTime.value = elapsed
  if (noiseMaterial.uniforms.uTime) noiseMaterial.uniforms.uTime.value = elapsed
  if (gradientMaterial.uniforms.uTime) gradientMaterial.uniforms.uTime.value = elapsed

  // Update mouse uniforms
  materialsWithMouse.forEach((mat) => {
    if (mat.uniforms.uMouseX) mat.uniforms.uMouseX.value = props.mouseX
    if (mat.uniforms.uMouseY) mat.uniforms.uMouseY.value = props.mouseY
    if (mat.uniforms.uMouseStrength) {
      mat.uniforms.uMouseStrength.value = props.mouseInteraction ? props.mouseStrength : 0
    }
  })

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
    <TresPerspectiveCamera :position="[0, 0, 3]" />
    <OrbitControls :enable-zoom="!disableZoom" />

    <!-- Stripe Gradient Demo -->
    <TresMesh v-if="activeDemo === 'stripe'">
      <TresPlaneGeometry :args="[4, 4, 1, 1]" />
      <primitive :object="stripeMaterial" attach="material" />
    </TresMesh>

    <!-- Mesh Gradient Demo -->
    <TresMesh v-if="activeDemo === 'mesh'">
      <TresPlaneGeometry :args="[4, 4, 1, 1]" />
      <primitive :object="meshMaterial" attach="material" />
    </TresMesh>

    <!-- Aurora Demo -->
    <TresMesh v-if="activeDemo === 'aurora'">
      <TresPlaneGeometry :args="[4, 4, 1, 1]" />
      <primitive :object="auroraMaterial" attach="material" />
    </TresMesh>

    <!-- Radial Gradient Demo -->
    <TresMesh v-if="activeDemo === 'radial'">
      <TresPlaneGeometry :args="[4, 4, 1, 1]" />
      <primitive :object="radialMaterial" attach="material" />
    </TresMesh>

    <!-- Noise Demo -->
    <TresMesh v-if="activeDemo === 'noise'">
      <TresPlaneGeometry :args="[4, 4, 32, 32]" />
      <primitive :object="noiseMaterial" attach="material" />
    </TresMesh>

    <!-- Linear Gradient Demo -->
    <TresMesh v-if="activeDemo === 'gradient'">
      <TresPlaneGeometry :args="[4, 4]" />
      <primitive :object="gradientMaterial" attach="material" />
    </TresMesh>

    <!-- Fresnel Demo -->
    <TresMesh v-if="activeDemo === 'fresnel'">
      <TresSphereGeometry :args="[1, 64, 64]" />
      <primitive :object="fresnelMaterial" attach="material" />
    </TresMesh>
  </TresCanvas>
</template>
