<script setup lang="ts">
  import { hsl, parse } from 'culori'

  const { baseHex, harmonyHexes } = defineProps<{
    baseHex: string
    harmonyHexes: string[]
  }>()

  // SVG viewBox is 0-100; center at (50, 50).
  // Radii are in SVG units where 50 = half the element width.
  // CSS mask uses closest-side, so CSS% = (SVG_radius / 50) * 100.
  const OUTER_R = 45 // → 90% in CSS mask
  const INNER_R = 27 // → 54% in CSS mask
  const WHEEL_MID = (OUTER_R + INNER_R) / 2 // 36 — dot placement radius
  const DOT_R = 4

  const OUTER_CSS = Math.round((OUTER_R / 50) * 100) // 90
  const INNER_CSS = Math.round((INNER_R / 50) * 100) // 54

  // HSL hue aligns with the HSL conic gradient on the wheel
  function hexToHue(hex: string): number {
    const parsed = parse(hex)
    if (!parsed) return 0
    return hsl(parsed)?.h ?? 0
  }

  // 360 discrete stops for a smooth conic gradient
  const conicStops = Array.from({ length: 360 }, (_, i) => `hsl(${i},72%,58%) ${i}deg`).join(',')

  // 0° = top (12 o'clock), clockwise — matches CSS conic-gradient default
  function angleToXY(hue: number) {
    const rad = ((hue - 90) * Math.PI) / 180
    return { x: 50 + WHEEL_MID * Math.cos(rad), y: 50 + WHEEL_MID * Math.sin(rad) }
  }

  const basePos = computed(() => angleToXY(hexToHue(baseHex)))

  const harmonyPositions = computed(() =>
    harmonyHexes.map((hex) => ({ hex, ...angleToXY(hexToHue(hex)) }))
  )
</script>

<template>
  <!--
    Pure CSS ring + SVG overlay approach.
    foreignObject inside SVG doesn't scale with the element in most browsers,
    so the conic ring is a plain CSS div and the SVG handles only dots/lines.
  -->
  <div class="relative" style="aspect-ratio: 1; width: 100%">
    <!-- Conic gradient ring — scales perfectly because it's plain CSS -->
    <div
      class="absolute inset-0 rounded-full"
      :style="{
        background: `conic-gradient(${conicStops})`,
        maskImage: `radial-gradient(circle closest-side at center, transparent ${INNER_CSS - 1}%, black ${INNER_CSS}%, black ${OUTER_CSS}%, transparent ${OUTER_CSS + 1}%)`,
        WebkitMaskImage: `radial-gradient(circle closest-side at center, transparent ${INNER_CSS - 1}%, black ${INNER_CSS}%, black ${OUTER_CSS}%, transparent ${OUTER_CSS + 1}%)`,
      }"
    />

    <!-- Inner fill — hides the wheel behind the center hole -->
    <div class="absolute rounded-full bg-(--ui-bg)" :style="{ inset: `${50 - INNER_R}%` }" />

    <!-- SVG overlay: lines and dots only -->
    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Spoke lines from center -->
      <line
        :x1="50"
        :y1="50"
        :x2="basePos.x"
        :y2="basePos.y"
        stroke="white"
        stroke-width="0.8"
        stroke-opacity="0.7"
        stroke-dasharray="2 2"
      />
      <line
        v-for="(pos, i) in harmonyPositions"
        :key="`l${i}`"
        :x1="50"
        :y1="50"
        :x2="pos.x"
        :y2="pos.y"
        stroke="white"
        stroke-width="0.6"
        stroke-opacity="0.4"
        stroke-dasharray="2 2"
      />

      <!-- Center point -->
      <circle cx="50" cy="50" r="1.5" fill="white" opacity="0.4" />

      <!-- Harmony dots -->
      <g v-for="(pos, i) in harmonyPositions" :key="`d${i}`">
        <circle :cx="pos.x" :cy="pos.y" :r="DOT_R + 2" fill="rgba(255,255,255,0.2)" />
        <circle
          :cx="pos.x"
          :cy="pos.y"
          :r="DOT_R"
          :fill="pos.hex"
          stroke="white"
          stroke-width="1.5"
        />
      </g>

      <!-- Base dot (on top) -->
      <circle :cx="basePos.x" :cy="basePos.y" :r="DOT_R + 2.5" fill="rgba(255,255,255,0.3)" />
      <circle
        :cx="basePos.x"
        :cy="basePos.y"
        :r="DOT_R + 0.5"
        :fill="baseHex"
        stroke="white"
        stroke-width="2"
      />
    </svg>
  </div>
</template>
