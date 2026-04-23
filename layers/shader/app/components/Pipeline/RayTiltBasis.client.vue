<script setup lang="ts">
// @ts-nocheck
import { uniform, cos, sin, vec3 } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Yaw offset in radians (horizontal look) */
  yaw?: number
  /** Pitch offset in radians (vertical tilt) */
  pitch?: number
  /** Roll offset in radians */
  roll?: number
  order?: number
}>(), { yaw: 0, pitch: 0, roll: 0, order: 0 })

const yawNode = uniform(props.yaw)
const pitchNode = uniform(props.pitch)
const rollNode = uniform(props.roll)
watch(() => props.yaw, v => { yawNode.value = v })
watch(() => props.pitch, v => { pitchNode.value = v })
watch(() => props.roll, v => { rollNode.value = v })

useShaderStage(
  (ray) => {
    // Yaw (Y)
    const cy = cos(yawNode); const sy = sin(yawNode)
    const r1 = vec3(ray.x.mul(cy).add(ray.z.mul(sy)), ray.y, ray.z.mul(cy).sub(ray.x.mul(sy)))

    // Pitch (X)
    const cp = cos(pitchNode); const sp = sin(pitchNode)
    const r2 = vec3(r1.x, r1.y.mul(cp).sub(r1.z.mul(sp)), r1.y.mul(sp).add(r1.z.mul(cp)))

    // Roll (Z)
    const cr = cos(rollNode); const sr = sin(rollNode)
    return vec3(r2.x.mul(cr).sub(r2.y.mul(sr)), r2.x.mul(sr).add(r2.y.mul(cr)), r2.z)
  },
  props.order,
  'ray',
)
</script>

<template><!-- --></template>
