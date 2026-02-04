<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { Clock, Color, DoubleSide, ShaderMaterial, Vector2 } from 'three'

type PresetType =
  | 'aurora'
  | 'nebula'
  | 'ocean'
  | 'lavaLamp'
  | 'gradientMesh'
  | 'cosmicDust'
  | 'organicFlow'
  | 'etherealMist'

const props = withDefaults(
  defineProps<{
    preset?: PresetType
    speed?: number
    intensity?: number
    color1?: string
    color2?: string
    color3?: string
    color4?: string
    mouseInteraction?: boolean
    mouseX?: number
    mouseY?: number
  }>(),
  {
    preset: 'aurora',
    speed: 1.0,
    intensity: 1.0,
    color1: '',
    color2: '',
    color3: '',
    color4: '',
    mouseInteraction: true,
    mouseX: 0.5,
    mouseY: 0.5,
  }
)

// Shared vertex shader
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// ============================================
// NOISE FUNCTIONS (shared across all shaders)
// ============================================
const noiseLib = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }

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

float snoise3D(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}

float fbm3D(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise3D(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}

float ridgedFbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    float n = 1.0 - abs(snoise(p * frequency));
    n = n * n;
    value += amplitude * n;
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}

vec2 curlNoise(vec2 p) {
  float eps = 0.01;
  float n1 = snoise(p + vec2(eps, 0.0));
  float n2 = snoise(p - vec2(eps, 0.0));
  float n3 = snoise(p + vec2(0.0, eps));
  float n4 = snoise(p - vec2(0.0, eps));
  float x = (n3 - n4) / (2.0 * eps);
  float y = -(n1 - n2) / (2.0 * eps);
  return vec2(x, y);
}

// Voronoi
vec2 voronoi(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float md = 8.0;
  vec2 m = vec2(0.0);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = vec2(snoise(n + g) * 0.5 + 0.5, snoise(n + g + vec2(17.0)) * 0.5 + 0.5);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < md) {
        md = d;
        m = n + g + o;
      }
    }
  }
  return vec2(sqrt(md), snoise(m) * 0.5 + 0.5);
}

// Cosine palette (IQ's technique)
vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}
`

// ============================================
// AURORA - Northern Lights
// ============================================
const auroraFragment = `
uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

${noiseLib}

void main() {
  vec2 uv = vUv;
  float time = uTime * uSpeed * 0.2;

  // Mouse influence
  vec2 mouseOffset = (uMouse - 0.5) * uMouseStrength;

  // Multiple curtain layers
  float curtain1 = snoise(vec2(uv.x * 3.0 + time + mouseOffset.x, uv.y * 0.5 + time * 0.3));
  float curtain2 = snoise(vec2(uv.x * 4.0 - time * 0.7 - mouseOffset.x * 0.5, uv.y * 0.3 + time * 0.2));
  float curtain3 = snoise(vec2(uv.x * 2.5 + time * 0.5, uv.y * 0.4 - time * 0.1));
  float curtain4 = fbm(vec2(uv.x * 2.0 + time * 0.3, uv.y * 0.6) + mouseOffset, 4);

  // Vertical fade with soft gradient
  float fade = pow(1.0 - uv.y, 1.2) * smoothstep(0.0, 0.3, uv.y);

  // Combine curtains
  float aurora = (curtain1 * 0.4 + curtain2 * 0.3 + curtain3 * 0.2 + curtain4 * 0.3) * fade;
  aurora = smoothstep(-0.3, 0.8, aurora) * uIntensity;

  // Color mixing with cosine palette
  vec3 palette = cosinePalette(aurora + time * 0.1,
    vec3(0.2, 0.5, 0.4),
    vec3(0.2, 0.4, 0.2),
    vec3(1.0, 1.0, 0.5),
    vec3(0.0, 0.2, 0.5)
  );

  vec3 color = mix(uColor1, uColor2, aurora);
  color = mix(color, uColor3, curtain2 * fade * 0.5);
  color = mix(color, palette, aurora * 0.5);

  // Add shimmer
  float shimmer = snoise(vec2(uv.x * 20.0 + time * 2.0, uv.y * 5.0)) * 0.1 * aurora;
  color += shimmer;

  // Dark sky base
  vec3 sky = vec3(0.02, 0.02, 0.06);
  color = mix(sky, color, aurora + 0.05);

  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// NEBULA - Space clouds
// ============================================
const nebulaFragment = `
uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

${noiseLib}

void main() {
  vec2 uv = vUv - 0.5;
  float time = uTime * uSpeed * 0.15;

  // Mouse influence
  vec2 mouseOffset = (uMouse - 0.5) * uMouseStrength * 0.3;
  uv += mouseOffset;

  // Create depth with multiple noise layers
  float n1 = fbm3D(vec3(uv * 2.0, time * 0.5), 5) * 0.5 + 0.5;
  float n2 = fbm3D(vec3(uv * 3.0 + 10.0, time * 0.3), 4) * 0.5 + 0.5;
  float n3 = ridgedFbm(uv * 4.0 + time * 0.2, 4) * 0.5 + 0.5;

  // Voronoi for stars/clusters
  vec2 vor = voronoi(uv * 8.0 + time * 0.1);
  float stars = smoothstep(0.1, 0.0, vor.x) * vor.y;

  // Color layers
  vec3 layer1 = mix(uColor1, uColor2, n1);
  vec3 layer2 = mix(uColor3, uColor4, n2);
  vec3 layer3 = cosinePalette(n3,
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(1.0, 0.7, 0.4),
    vec3(0.0, 0.15, 0.2)
  );

  // Combine layers
  vec3 color = mix(layer1, layer2, n2 * 0.7);
  color = mix(color, layer3, n3 * 0.4);

  // Add glow
  float glow = exp(-length(uv) * 2.0) * 0.5;
  color += uColor2 * glow;

  // Add stars
  color += vec3(1.0, 0.95, 0.9) * stars * 2.0;

  // Subtle dust particles
  float dust = snoise(uv * 50.0 + time) * 0.03;
  color += dust * uIntensity;

  // Vignette
  float vig = 1.0 - length(uv) * 0.8;
  color *= vig;

  gl_FragColor = vec4(color * uIntensity, 1.0);
}
`

// ============================================
// OCEAN - Deep water waves
// ============================================
const oceanFragment = `
uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

${noiseLib}

void main() {
  vec2 uv = vUv;
  float time = uTime * uSpeed * 0.3;

  // Mouse creates ripples
  vec2 mousePos = uMouse;
  float mouseDist = length(uv - mousePos);
  float ripple = sin(mouseDist * 30.0 - time * 5.0) * exp(-mouseDist * 5.0) * uMouseStrength;

  // Wave layers
  float wave1 = sin(uv.x * 8.0 + time + ripple * 2.0) * 0.5 + 0.5;
  float wave2 = sin(uv.x * 12.0 - time * 0.7 + uv.y * 3.0) * 0.5 + 0.5;
  float wave3 = snoise(vec2(uv.x * 4.0 + time * 0.5, uv.y * 2.0 + time * 0.3));

  // Caustics-like pattern
  float caustic1 = snoise(uv * 10.0 + time * 0.5) * 0.5 + 0.5;
  float caustic2 = snoise(uv * 15.0 - time * 0.3 + 5.0) * 0.5 + 0.5;
  float caustics = pow(caustic1 * caustic2, 2.0);

  // Foam on wave peaks
  float foam = smoothstep(0.7, 0.9, wave1 * wave2);

  // Depth gradient
  float depth = uv.y * 0.5 + 0.3;

  // Color mixing
  vec3 deepColor = uColor1;
  vec3 midColor = uColor2;
  vec3 surfaceColor = uColor3;

  vec3 color = mix(deepColor, midColor, depth + wave3 * 0.2);
  color = mix(color, surfaceColor, caustics * 0.3 * uIntensity);
  color += vec3(1.0, 1.0, 1.0) * foam * 0.3;

  // Add shimmer
  float shimmer = snoise(uv * 30.0 + time * 2.0) * 0.05 * uIntensity;
  color += shimmer;

  // Subtle vignette
  float vig = 1.0 - length(uv - 0.5) * 0.5;
  color *= vig;

  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// LAVA LAMP - Organic blobs
// ============================================
const lavaLampFragment = `
uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

${noiseLib}

float metaball(vec2 uv, vec2 center, float radius) {
  float d = length(uv - center);
  return radius / (d * d + 0.001);
}

void main() {
  vec2 uv = vUv;
  float time = uTime * uSpeed * 0.4;

  // Mouse influence
  vec2 mouseInfluence = (uMouse - 0.5) * uMouseStrength * 0.3;

  // Animated blob centers
  vec2 c1 = vec2(0.3 + sin(time) * 0.2, 0.3 + cos(time * 0.8) * 0.25) + mouseInfluence;
  vec2 c2 = vec2(0.7 + cos(time * 0.7) * 0.2, 0.4 + sin(time * 0.9) * 0.2) - mouseInfluence * 0.5;
  vec2 c3 = vec2(0.5 + sin(time * 0.6) * 0.25, 0.7 + cos(time * 1.1) * 0.2) + mouseInfluence * 0.7;
  vec2 c4 = vec2(0.2 + cos(time * 0.5) * 0.15, 0.6 + sin(time * 0.7) * 0.25);
  vec2 c5 = vec2(0.8 + sin(time * 0.9) * 0.1, 0.8 + cos(time * 0.6) * 0.15) - mouseInfluence * 0.3;

  // Metaball field
  float field = 0.0;
  field += metaball(uv, c1, 0.03 + sin(time * 2.0) * 0.01);
  field += metaball(uv, c2, 0.025 + cos(time * 1.8) * 0.008);
  field += metaball(uv, c3, 0.02 + sin(time * 2.2) * 0.007);
  field += metaball(uv, c4, 0.018 + cos(time * 1.5) * 0.005);
  field += metaball(uv, c5, 0.015 + sin(time * 1.7) * 0.004);

  // Threshold and smooth
  float blob = smoothstep(0.8, 1.2, field);

  // Add some noise texture inside blobs
  float innerNoise = fbm(uv * 5.0 + time * 0.5, 3) * 0.5 + 0.5;

  // Color based on position and field strength
  vec3 color = mix(uColor1, uColor2, blob);
  color = mix(color, uColor3, smoothstep(1.0, 1.5, field) * innerNoise);
  color = mix(color, uColor4, smoothstep(1.3, 2.0, field));

  // Glow effect
  float glow = smoothstep(0.5, 0.8, field) * (1.0 - blob) * 0.5;
  color += uColor2 * glow * uIntensity;

  // Background gradient
  vec3 bg = mix(uColor1 * 0.3, uColor1 * 0.5, uv.y);
  color = mix(bg, color, smoothstep(0.3, 0.8, field));

  gl_FragColor = vec4(color * uIntensity, 1.0);
}
`

// ============================================
// GRADIENT MESH - Smooth flowing colors
// ============================================
const gradientMeshFragment = `
uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

${noiseLib}

void main() {
  vec2 uv = vUv;
  float time = uTime * uSpeed * 0.2;

  // Mouse influence
  vec2 mouseOffset = (uMouse - 0.5) * uMouseStrength;
  uv += mouseOffset * 0.1;

  // Create smooth flowing noise
  float n1 = snoise(uv * 1.5 + vec2(time, time * 0.5)) * 0.5 + 0.5;
  float n2 = snoise(uv * 2.0 + vec2(-time * 0.7, time * 0.3)) * 0.5 + 0.5;
  float n3 = snoise(uv * 1.2 + vec2(time * 0.4, -time * 0.6)) * 0.5 + 0.5;
  float n4 = fbm(uv * 0.8 + time * 0.2, 3) * 0.5 + 0.5;

  // Smooth gradient positions
  vec2 p1 = vec2(0.2 + sin(time * 0.5) * 0.2, 0.3 + cos(time * 0.4) * 0.2);
  vec2 p2 = vec2(0.8 + cos(time * 0.6) * 0.15, 0.2 + sin(time * 0.5) * 0.15);
  vec2 p3 = vec2(0.3 + sin(time * 0.7) * 0.2, 0.8 + cos(time * 0.3) * 0.15);
  vec2 p4 = vec2(0.7 + cos(time * 0.4) * 0.2, 0.7 + sin(time * 0.6) * 0.2);

  // Distance-based blending
  float d1 = 1.0 - smoothstep(0.0, 0.8, length(uv - p1));
  float d2 = 1.0 - smoothstep(0.0, 0.8, length(uv - p2));
  float d3 = 1.0 - smoothstep(0.0, 0.8, length(uv - p3));
  float d4 = 1.0 - smoothstep(0.0, 0.8, length(uv - p4));

  // Color mixing
  vec3 color = uColor1 * d1;
  color = mix(color, uColor2, d2 * n1);
  color = mix(color, uColor3, d3 * n2);
  color = mix(color, uColor4, d4 * n3);

  // Add subtle brightness variation
  float brightness = 0.9 + 0.1 * n4;
  color *= brightness * uIntensity;

  // Soft vignette
  float vig = 1.0 - length(uv - 0.5) * 0.3;
  color *= vig;

  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// COSMIC DUST - Particle field
// ============================================
const cosmicDustFragment = `
uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

${noiseLib}

void main() {
  vec2 uv = vUv - 0.5;
  float time = uTime * uSpeed * 0.1;

  // Parallax layers
  vec2 mouseOffset = (uMouse - 0.5) * uMouseStrength;

  // Multiple dust layers at different depths
  float dust1 = 0.0;
  float dust2 = 0.0;
  float dust3 = 0.0;

  // Layer 1 - distant, slow
  vec2 uv1 = uv * 3.0 + time * 0.1 + mouseOffset * 0.1;
  vec2 vor1 = voronoi(uv1 * 5.0);
  dust1 = smoothstep(0.15, 0.0, vor1.x) * vor1.y;

  // Layer 2 - mid distance
  vec2 uv2 = uv * 2.0 + time * 0.2 + mouseOffset * 0.2;
  vec2 vor2 = voronoi(uv2 * 8.0 + 10.0);
  dust2 = smoothstep(0.12, 0.0, vor2.x) * vor2.y;

  // Layer 3 - close, fast
  vec2 uv3 = uv * 1.5 + time * 0.3 + mouseOffset * 0.4;
  vec2 vor3 = voronoi(uv3 * 12.0 + 20.0);
  dust3 = smoothstep(0.08, 0.0, vor3.x) * vor3.y;

  // Nebula background
  float nebula = fbm3D(vec3(uv * 2.0, time * 0.05), 4) * 0.5 + 0.5;

  // Combine colors
  vec3 bgColor = mix(uColor1 * 0.2, uColor2 * 0.3, nebula);

  // Add dust with different colors
  vec3 color = bgColor;
  color += uColor1 * dust1 * 0.5;
  color += uColor2 * dust2 * 0.7;
  color += uColor3 * dust3 * 1.0;

  // Add glow around particles
  float glow = (dust1 * 0.3 + dust2 * 0.5 + dust3 * 0.7);
  color += uColor2 * glow * 0.3;

  // Central glow
  float centralGlow = exp(-length(uv) * 3.0) * 0.3;
  color += uColor2 * centralGlow;

  // Vignette
  float vig = 1.0 - length(uv) * 0.6;
  color *= vig * uIntensity;

  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// ORGANIC FLOW - Warped noise
// ============================================
const organicFlowFragment = `
uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

${noiseLib}

void main() {
  vec2 uv = vUv;
  float time = uTime * uSpeed * 0.15;

  // Mouse influence
  vec2 mouseOffset = (uMouse - 0.5) * uMouseStrength * 0.5;

  // Domain warping - warp UV coordinates using noise
  vec2 warp1 = curlNoise(uv * 2.0 + time * 0.3) * 0.3;
  vec2 warp2 = curlNoise(uv * 3.0 + warp1 + time * 0.2) * 0.2;
  vec2 warp3 = curlNoise(uv * 4.0 + warp2 - time * 0.1) * 0.15;

  vec2 warpedUV = uv + warp1 + warp2 + warp3 + mouseOffset;

  // Layered noise on warped coordinates
  float n1 = fbm(warpedUV * 2.0, 4) * 0.5 + 0.5;
  float n2 = fbm(warpedUV * 3.0 + 5.0, 3) * 0.5 + 0.5;
  float n3 = ridgedFbm(warpedUV * 1.5, 4) * 0.5 + 0.5;

  // Color palette based on noise
  vec3 color = mix(uColor1, uColor2, n1);
  color = mix(color, uColor3, n2 * 0.6);
  color = mix(color, uColor4, n3 * 0.4);

  // Add iridescent effect
  vec3 iridescence = cosinePalette(n1 + time * 0.1,
    vec3(0.5),
    vec3(0.5),
    vec3(1.0, 1.0, 0.5),
    vec3(0.8, 0.9, 0.3)
  );
  color = mix(color, iridescence, 0.2);

  // Brightness variation
  float brightness = 0.8 + 0.2 * sin(n1 * 6.28 + time);
  color *= brightness * uIntensity;

  // Soft vignette
  float vig = 1.0 - length(uv - 0.5) * 0.4;
  color *= vig;

  gl_FragColor = vec4(color, 1.0);
}
`

// ============================================
// ETHEREAL MIST - Soft fog layers
// ============================================
const etherealMistFragment = `
uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

${noiseLib}

void main() {
  vec2 uv = vUv;
  float time = uTime * uSpeed * 0.1;

  // Mouse gently moves the mist
  vec2 mouseOffset = (uMouse - 0.5) * uMouseStrength * 0.2;

  // Multiple mist layers moving at different speeds
  float mist1 = fbm(vec2(uv.x * 2.0 + time * 0.3 + mouseOffset.x, uv.y * 1.5 + time * 0.1), 5);
  float mist2 = fbm(vec2(uv.x * 3.0 - time * 0.2 + mouseOffset.x * 0.5, uv.y * 2.0 + time * 0.15), 4);
  float mist3 = fbm(vec2(uv.x * 1.5 + time * 0.1 - mouseOffset.x * 0.3, uv.y * 1.0 - time * 0.05), 6);

  // Normalize and combine
  mist1 = mist1 * 0.5 + 0.5;
  mist2 = mist2 * 0.5 + 0.5;
  mist3 = mist3 * 0.5 + 0.5;

  // Layered fog effect
  float combined = mist1 * 0.4 + mist2 * 0.35 + mist3 * 0.25;

  // Soft color transitions
  vec3 color = mix(uColor1, uColor2, combined);
  color = mix(color, uColor3, mist2 * 0.5);

  // Add subtle light rays
  float rays = sin(uv.x * 10.0 + time * 0.5) * sin(uv.y * 8.0 - time * 0.3) * 0.1;
  rays = max(0.0, rays) * mist1;
  color += uColor2 * rays;

  // Volumetric-like brightness variation
  float volume = pow(combined, 1.5) * 0.3;
  color += uColor3 * volume;

  // Very soft vignette
  float vig = 1.0 - length(uv - 0.5) * 0.2;
  color *= vig * uIntensity;

  gl_FragColor = vec4(color, 1.0);
}
`

// Preset color configurations
const presetColors: Record<PresetType, { c1: string; c2: string; c3: string; c4: string }> = {
  aurora: { c1: '#0a0a20', c2: '#00ff87', c3: '#60efff', c4: '#ff00ea' },
  nebula: { c1: '#1a0a2e', c2: '#ff6b6b', c3: '#4ecdc4', c4: '#ffe66d' },
  ocean: { c1: '#0a1628', c2: '#1e3a5f', c3: '#3d7ea6', c4: '#7ec8e3' },
  lavaLamp: { c1: '#1a0a0a', c2: '#ff4757', c3: '#ff7f50', c4: '#ffa502' },
  gradientMesh: { c1: '#667eea', c2: '#764ba2', c3: '#f093fb', c4: '#f5576c' },
  cosmicDust: { c1: '#0f0c29', c2: '#302b63', c3: '#24243e', c4: '#eaafc8' },
  organicFlow: { c1: '#134e5e', c2: '#71b280', c3: '#e8d5b7', c4: '#fc5c7d' },
  etherealMist: { c1: '#e0e5ec', c2: '#a8c0ff', c3: '#d4fc79', c4: '#96e6a1' },
}

// Fragment shader map
const fragmentShaders: Record<PresetType, string> = {
  aurora: auroraFragment,
  nebula: nebulaFragment,
  ocean: oceanFragment,
  lavaLamp: lavaLampFragment,
  gradientMesh: gradientMeshFragment,
  cosmicDust: cosmicDustFragment,
  organicFlow: organicFlowFragment,
  etherealMist: etherealMistFragment,
}

// Create material based on preset
const material = computed(() => {
  const colors = presetColors[props.preset]

  return new ShaderMaterial({
    vertexShader,
    fragmentShader: fragmentShaders[props.preset],
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: props.speed },
      uIntensity: { value: props.intensity },
      uColor1: { value: new Color(props.color1 || colors.c1) },
      uColor2: { value: new Color(props.color2 || colors.c2) },
      uColor3: { value: new Color(props.color3 || colors.c3) },
      uColor4: { value: new Color(props.color4 || colors.c4) },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uMouseStrength: { value: props.mouseInteraction ? 0.5 : 0 },
    },
    side: DoubleSide,
  })
})

// Animation
const clock = new Clock()
let animationId: number

const animate = () => {
  const uniforms = material.value?.uniforms
  if (
    uniforms?.uTime &&
    uniforms?.uSpeed &&
    uniforms?.uIntensity &&
    uniforms?.uMouse &&
    uniforms?.uMouseStrength
  ) {
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uSpeed.value = props.speed
    uniforms.uIntensity.value = props.intensity
    uniforms.uMouse.value.set(props.mouseX, props.mouseY)
    uniforms.uMouseStrength.value = props.mouseInteraction ? 0.5 : 0
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
  <TresCanvas clear-color="#000000">
    <TresPerspectiveCamera :position="[0, 0, 1]" />

    <TresMesh>
      <TresPlaneGeometry :args="[2, 2, 1, 1]" />
      <primitive :object="material" attach="material" />
    </TresMesh>
  </TresCanvas>
</template>
