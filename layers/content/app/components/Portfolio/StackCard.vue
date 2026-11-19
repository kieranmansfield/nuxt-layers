<script setup lang="ts">
  /**
   * PortfolioStackCard — one technology as a playing card: corner indices (icon + vertical name,
   * readable even when a neighbour overlaps most of the card), a large centre pip, a brand-colour
   * wash, and a glare that follows the tilt.
   *
   * Motion comes from the animations layer: `useMagneticElement` pulls the card toward the
   * pointer, `useTiltEffect` tilts the face. Both honour reduced motion.
   */
  const {
    name,
    icon,
    color = '#94a3b8',
    url = undefined,
    strength = 0.25,
    radius = 220,
    maxTilt = 14,
  } = defineProps<{
    name: string
    /** Iconify name, e.g. `i-logos-vue` */
    icon: string
    /** Brand colour for the wash, border and glow */
    color?: string
    /** Makes the card a link */
    url?: string
    /** Magnetic pull, as a fraction of the pointer's offset from centre */
    strength?: number
    /** Distance (px) from centre the magnetic pull reaches */
    radius?: number
    /** Maximum tilt in degrees */
    maxTilt?: number
  }>()

  const NuxtLink = resolveComponent('NuxtLink')

  const magnet = useTemplateRef<HTMLElement>('magnet')
  const tilt = useTemplateRef<HTMLElement>('tilt')
  const { isActive } = useMagneticElement(magnet, { strength, radius })
  const { rotateX, rotateY } = useTiltEffect(tilt, { maxTilt })

  const linkProps = computed(() =>
    url ? { to: url, ...(/^https?:/.test(url) && { target: '_blank' }) } : {}
  )

  // Glare reads the tilt (already spring-smoothed) instead of the raw pointer
  const vars = computed(() => ({
    '--stack-color': color,
    '--glare-x': `${50 + (rotateY.value / maxTilt) * 50}%`,
    '--glare-y': `${50 - (rotateX.value / maxTilt) * 50}%`,
    '--glare-o': String(Math.min(1, (Math.abs(rotateX.value) + Math.abs(rotateY.value)) / maxTilt)),
  }))
</script>

<template>
  <div ref="magnet" class="stack-card" :data-active="isActive || undefined" :style="vars">
    <div ref="tilt" class="stack-card-tilt">
      <component :is="url ? NuxtLink : 'div'" class="stack-card-face" v-bind="linkProps">
        <span class="stack-card-corner">
          <UIcon :name="icon" class="stack-card-corner-icon" aria-hidden="true" />
          <span class="stack-card-name">{{ name }}</span>
        </span>

        <UIcon :name="icon" class="stack-card-pip" aria-hidden="true" />

        <span class="stack-card-corner stack-card-corner-end" aria-hidden="true">
          <UIcon :name="icon" class="stack-card-corner-icon" />
          <span class="stack-card-name">{{ name }}</span>
        </span>

        <span class="stack-card-glare" aria-hidden="true" />
      </component>
    </div>
  </div>
</template>

<style scoped>
  .stack-card {
    will-change: transform;
  }

  .stack-card-tilt {
    transform-style: preserve-3d;
    will-change: transform;
  }

  .stack-card-face {
    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 5 / 7;
    overflow: hidden;
    border: 1px solid color-mix(in oklab, var(--stack-color) 35%, var(--ui-border));
    border-radius: clamp(0.5rem, 7cqi, 0.875rem);
    background:
      radial-gradient(
        120% 80% at 50% 45%,
        color-mix(in oklab, var(--stack-color) 22%, transparent),
        transparent 70%
      ),
      linear-gradient(160deg, var(--ui-bg-elevated), var(--ui-bg));
    box-shadow:
      0 1px 2px oklch(0% 0 0deg / 0.08),
      0 14px 28px -14px color-mix(in oklab, var(--stack-color) 50%, transparent);
    color: var(--ui-text-highlighted);
    container-type: inline-size;
    transition:
      box-shadow 0.3s ease,
      border-color 0.3s ease;
  }

  /* Inset frame, like the border printed on a playing card */
  .stack-card-face::before {
    position: absolute;
    border: 1px solid color-mix(in oklab, var(--stack-color) 25%, transparent);
    border-radius: clamp(0.25rem, 4cqi, 0.5rem);
    content: '';
    inset: 5cqi;
    pointer-events: none;
  }

  .stack-card[data-active] .stack-card-face {
    border-color: color-mix(in oklab, var(--stack-color) 70%, var(--ui-border));
    box-shadow:
      0 1px 2px oklch(0% 0 0deg / 0.1),
      0 22px 40px -16px color-mix(in oklab, var(--stack-color) 75%, transparent);
  }

  .stack-card-face:focus-visible {
    outline: 2px solid var(--stack-color);
    outline-offset: 3px;
  }

  .stack-card-corner {
    position: absolute;
    top: 9cqi;
    left: 9cqi;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3cqi;
  }

  .stack-card-corner-end {
    inset: auto 9cqi 9cqi auto;
    rotate: 180deg;
  }

  .stack-card-corner-icon {
    width: clamp(0.75rem, 13cqi, 1.125rem);
    height: clamp(0.75rem, 13cqi, 1.125rem);
  }

  .stack-card-name {
    max-block-size: 52cqi;
    overflow: hidden;
    font-size: clamp(0.5625rem, 9cqi, 0.75rem);
    font-weight: 600;
    letter-spacing: 0.08em;
    line-height: 1;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
    writing-mode: vertical-rl;
  }

  .stack-card-pip {
    width: 46cqi;
    height: 46cqi;
    filter: drop-shadow(0 6px 12px color-mix(in oklab, var(--stack-color) 40%, transparent));
    transition: scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .stack-card[data-active] .stack-card-pip {
    scale: 1.08;
  }

  .stack-card-glare {
    position: absolute;
    background: radial-gradient(
      circle at var(--glare-x, 50%) var(--glare-y, 50%),
      oklch(100% 0 0deg / 0.28),
      transparent 55%
    );
    inset: 0;
    opacity: var(--glare-o, 0);
    pointer-events: none;
  }
</style>
