# Modular TSL Shader Setup

This folder structure implements a fully modular TSL-based shader system, combining Plane/Default vertices, 2D/3D noise, shapes, blending, palettes, grain, and various shader layers inspired by the Paper Shaders, ShaderGradient, and Fragments Supply techniques.

---

## Folder Structure

```
/shaders
  /common
    vertexPlane.tsl         # Generic plane vertex shader
    vertexDefault.tsl       # Generic vertex for non-plane meshes
    vertexUV.tsl            # Only passes vUv
    noise3D.tsl             # 3D noise, hash, fbm
    noise2D.tsl             # 2D noise, random, fbm
    shapes.tsl              # blob, ring, radial helpers
    blend.tsl               # color mixing helpers
    palette.tsl             # palette functions
    grain.tsl               # grain / subtle random overlay
  /layers
    stripe.tsl              # Stripe gradient layer
    meshGradient.tsl        # Organic mesh gradient layer
    aurora.tsl              # Aurora gradient layer
    radial.tsl              # Radial gradient layer
    noise.ts                # FBM noise gradient layer
    linearGradient.tsl      # Simple animated linear gradient layer
    fresnel.tsl             # Rim lighting / fresnel shader layer
    paperShading.tsl        # Paper Shader-inspired modular layer
    shaderGradient.tsl      # ShaderGradient-inspired layer
    fragmentsTech.tsl       # Fragments Supply techniques layer
  /materials
    createMaterial.ts       # Factory to create TresJS ShaderMaterial with uniforms
```

---

## /shaders/common/vertexPlane.tsl

```
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

## /shaders/common/vertexDefault.tsl

```
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vPosition = position;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

## /shaders/common/vertexUV.tsl

```
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

## /shaders/common/noise3D.tsl

```
vec3 hash(vec3 p) {
  p = vec3(dot(p, vec3(127.1,311.7,74.7)), dot(p, vec3(269.5,183.3,246.1)), dot(p, vec3(113.5,271.9,124.6)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(dot(hash(i+vec3(0.0,0.0,0.0)), f-vec3(0.0,0.0,0.0)),
                      dot(hash(i+vec3(1.0,0.0,0.0)), f-vec3(1.0,0.0,0.0)), u.x),
                 mix(dot(hash(i+vec3(0.0,1.0,0.0)), f-vec3(0.0,1.0,0.0)),
                     dot(hash(i+vec3(1.0,1.0,0.0)), f-vec3(1.0,1.0,0.0)), u.x), u.y),
             mix(mix(dot(hash(i+vec3(0.0,0.0,1.0)), f-vec3(0.0,0.0,1.0)),
                     dot(hash(i+vec3(1.0,0.0,1.0)), f-vec3(1.0,0.0,1.0)), u.x),
                 mix(dot(hash(i+vec3(0.0,1.0,1.0)), f-vec3(0.0,1.0,1.0)),
                     dot(hash(i+vec3(1.0,1.0,1.0)), f-vec3(1.0,1.0,1.0)), u.x), u.y), u.z);
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for(int i=0; i<5; i++) {
    value += amplitude * noise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}
```

## /shaders/common/noise2D.tsl

```
float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
float noise(vec2 st){
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a=random(i),b=random(i+vec2(1.0,0.0)),c=random(i+vec2(0.0,1.0)),d=random(i+vec2(1.0,1.0));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 st){
  float value=0.0,amp=0.5, freq=1.0;
  for(int i=0;i<5;i++){value+=amp*noise(st*freq); amp*=0.5; freq*=2.0;}
  return value;
}
```

## /shaders/common/shapes.tsl

```
float blob(vec2 uv, vec2 center, float radius, float softness){
  float d=distance(uv,center);
  return smoothstep(radius+softness,radius-softness,d);
}
float ring(vec2 uv, vec2 center, float inner, float outer){
  float d=distance(uv,center);
  return smoothstep(inner,outer,d)-smoothstep(inner*0.9,outer*0.9,d);
}
float radial(vec2 uv, vec2 center){
  return 1.0 - length(uv-center);
}
```

## /shaders/common/blend.tsl

```
vec3 blendColors(vec3 a, vec3 b, float t){ return mix(a,b,t); }
```

## /shaders/common/palette.tsl

```
vec3 palette(float t, vec3 c1, vec3 c2, vec3 c3, vec3 c4){
  if(t<0.4) return mix(c1,c2,t/0.4);
  else if(t<0.7) return mix(c2,c3,(t-0.4)/0.3);
  else return mix(c3,c4,(t-0.7)/0.3);
}
```

## /shaders/common/grain.tsl

```
float grain(vec2 uv, float intensity){
  return (fract(sin(dot(uv.xy,vec2(12.9898,78.233)))*43758.5453)-0.5)*intensity;
}
```

---

### Layers And Materials

All layers like stripe.tsl, meshGradient.tsl, aurora.tsl etc. import the relevant common shaders above and implement their own uniforms and main() logic. The createMaterial.ts file in /materials handles TresJS ShaderMaterial creation with shared uniforms like uTime.

Example createMaterial.ts:

```
import { ShaderMaterial, Color, DoubleSide } from 'three';

export const createMaterial = ({ vertexShader, fragmentShader, uniforms }) => {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    side: DoubleSide,
  });
};
```

---

This setup allows you to:

- Compose new shader layers by importing common utilities.
- Easily add new layers inspired by Paper Shaders, ShaderGradient, or Fragments Supply.
- Centralize noise, shapes, palettes, blending, and grain for reusable effects.

You can now copy this structure into a project folder and start filling each layer's main() logic with your TSL converted GLSL.
