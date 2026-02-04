// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Modular TSL Lighting Utilities
 * Provides common lighting models for shader effects
 */
import { dot, float, max, mix, normalize, pow, reflect, vec3 } from 'three/tsl'
import type { TSLNode } from '../types'

// ============================================
// Fresnel Effect
// ============================================

/**
 * Fresnel effect (rim lighting)
 * Returns higher values at grazing angles
 * @param viewDir - View direction vector (normalized)
 * @param normal - Surface normal vector (normalized)
 * @param exponent - Fresnel exponent (higher = sharper falloff)
 */
export function fresnel(
  viewDir: TSLNode,
  normal: TSLNode,
  exponent: TSLNode | number = 2
): TSLNode {
  const p = typeof exponent === 'number' ? float(exponent) : exponent
  return float(1)
    .sub(max(0, dot(viewDir, normal)))
    .pow(p)
}

// ============================================
// Hemispheric Lighting
// ============================================

/**
 * Hemispheric ambient lighting
 * Blends between ground and sky colors based on surface normal
 * @param normal - Surface normal vector
 * @param groundColor - Color from below (ground)
 * @param skyColor - Color from above (sky)
 */
export function hemi(normal: TSLNode, groundColor: TSLNode, skyColor: TSLNode): TSLNode {
  const hemiMix = normal.y.mul(0.5).add(0.5)
  return mix(groundColor, skyColor, hemiMix)
}

// ============================================
// Diffuse Lighting
// ============================================

/**
 * Lambertian diffuse lighting
 * @param lightDir - Light direction vector (normalized, pointing toward light)
 * @param normal - Surface normal vector (normalized)
 * @param lightColor - Light color
 */
export function diffuse(lightDir: TSLNode, normal: TSLNode, lightColor: TSLNode): TSLNode {
  const dp = max(0, dot(lightDir, normal))
  return dp.mul(lightColor)
}

// ============================================
// Phong Specular
// ============================================

/**
 * Phong specular highlights
 * @param viewDir - View direction vector (normalized)
 * @param normal - Surface normal vector (normalized)
 * @param lightDir - Light direction vector (normalized, pointing toward light)
 * @param shininess - Phong exponent (higher = smaller, sharper highlights)
 */
export function phongSpecular(
  viewDir: TSLNode,
  normal: TSLNode,
  lightDir: TSLNode,
  shininess: TSLNode | number = 32
): TSLNode {
  const p = typeof shininess === 'number' ? float(shininess) : shininess
  const reflectDir = normalize(reflect(lightDir.negate(), normal))
  const phongValue = max(0, dot(viewDir, reflectDir)).pow(p)
  return vec3(phongValue)
}

// ============================================
// Blinn-Phong Specular
// ============================================

/**
 * Blinn-Phong specular highlights
 * More physically accurate than standard Phong
 * @param viewDir - View direction vector (normalized)
 * @param normal - Surface normal vector (normalized)
 * @param lightDir - Light direction vector (normalized, pointing toward light)
 * @param shininess - Shininess exponent
 */
export function blinnPhongSpecular(
  viewDir: TSLNode,
  normal: TSLNode,
  lightDir: TSLNode,
  shininess: TSLNode | number = 32
): TSLNode {
  const p = typeof shininess === 'number' ? float(shininess) : shininess
  const halfDir = normalize(lightDir.add(viewDir))
  const specAngle = max(0, dot(halfDir, normal))
  return vec3(pow(specAngle, p))
}

// ============================================
// Combined Lighting
// ============================================

export interface LightingOptions {
  ambient?: TSLNode | number
  diffuseStrength?: TSLNode | number
  specularStrength?: TSLNode | number
  shininess?: TSLNode | number
}

/**
 * Combined Phong lighting model
 * @param viewDir - View direction vector
 * @param normal - Surface normal vector
 * @param lightDir - Light direction vector
 * @param lightColor - Light color
 * @param options - Lighting parameters
 */
export function phongLighting(
  viewDir: TSLNode,
  normal: TSLNode,
  lightDir: TSLNode,
  lightColor: TSLNode,
  options: LightingOptions = {}
): TSLNode {
  const { ambient = 0.1, diffuseStrength = 1.0, specularStrength = 0.5, shininess = 32 } = options

  const ambientVal = typeof ambient === 'number' ? float(ambient) : ambient
  const diffStr = typeof diffuseStrength === 'number' ? float(diffuseStrength) : diffuseStrength
  const specStr = typeof specularStrength === 'number' ? float(specularStrength) : specularStrength

  const ambientLight = lightColor.mul(ambientVal)
  const diffuseLight = diffuse(lightDir, normal, lightColor).mul(diffStr)
  const specularLight = phongSpecular(viewDir, normal, lightDir, shininess).mul(specStr)

  return ambientLight.add(diffuseLight).add(specularLight)
}
