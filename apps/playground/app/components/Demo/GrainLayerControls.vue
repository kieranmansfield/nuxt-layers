<script setup lang="ts">
type GrainType = 'fine' | 'film' | 'riso'
type GrainBlend = 'add' | 'sub' | 'screen' | 'overlay' | 'soft-light'
type GrainStyle = 'smooth' | 'dotted' | 'coarse'

const { label, enabled, state } = defineProps<{
  label: string
  enabled: boolean
  state: {
    type: GrainType
    style?: GrainStyle
    intensity: number
    opacity: number
    size: number
    blendMode: GrainBlend
    animated?: boolean
    fps: number
    scale?: number
    strength?: number
  }
}>()

const emit = defineEmits<{ toggle: [] }>()

const TYPES = [{ id: 'fine', label: 'Fine' }, { id: 'film', label: 'Film' }, { id: 'riso', label: 'Riso' }] as const
const STYLES = [{ id: 'smooth', label: 'Smooth' }, { id: 'dotted', label: 'Dotted' }, { id: 'coarse', label: 'Grit' }] as const
const BLENDS = [
  { id: 'add', label: 'Add' }, { id: 'sub', label: 'Sub' }, { id: 'screen', label: 'Screen' },
  { id: 'overlay', label: 'Ovly' }, { id: 'soft-light', label: 'Soft' },
] as const
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <p class="text-xs font-semibold uppercase tracking-wider text-white/30">{{ label }}</p>
      <button
        class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150"
        :class="enabled ? 'bg-violet-500/25 text-violet-300 ring-1 ring-violet-500/40' : 'bg-white/5 text-white/40 hover:text-white/70'"
        @click="emit('toggle')"
      >{{ enabled ? 'On' : 'Off' }}</button>
    </div>
    <template v-if="enabled">
      <div>
        <p class="text-xs text-white/30 font-medium mb-1.5">Type</p>
        <div class="flex gap-1">
          <button
            v-for="t in TYPES" :key="t.id"
            class="flex-1 py-1 rounded-lg text-xs font-medium transition-all"
            :class="state.type === t.id ? 'bg-violet-500/25 text-violet-300 ring-1 ring-violet-500/40' : 'bg-white/5 text-white/40 hover:text-white/70'"
            @click="state.type = t.id"
          >{{ t.label }}</button>
        </div>
      </div>
      <!-- Style selector (Fine grain only) -->
      <div v-if="state.type === 'fine' && state.style !== undefined">
        <p class="text-xs text-white/30 font-medium mb-1.5">Texture</p>
        <div class="flex gap-1">
          <button
            v-for="s in STYLES" :key="s.id"
            class="flex-1 py-1 rounded-lg text-xs font-medium transition-all"
            :class="state.style === s.id ? 'bg-violet-500/25 text-violet-300 ring-1 ring-violet-500/40' : 'bg-white/5 text-white/40 hover:text-white/70'"
            @click="state.style = s.id"
          >{{ s.label }}</button>
        </div>
      </div>
      <div>
        <p class="text-xs text-white/30 font-medium mb-1.5">Blend</p>
        <div class="flex gap-1 flex-wrap">
          <button
            v-for="m in BLENDS" :key="m.id"
            class="px-2 py-1 rounded-lg text-xs font-medium transition-all"
            :class="state.blendMode === m.id ? 'bg-violet-500/25 text-violet-300 ring-1 ring-violet-500/40' : 'bg-white/5 text-white/40 hover:text-white/70'"
            @click="state.blendMode = m.id"
          >{{ m.label }}</button>
        </div>
      </div>
      <DemoSliderRow label="Intensity" :min="0.01" :max="0.4" :step="0.005" v-model="state.intensity" />
      <DemoSliderRow label="Opacity" :min="0" :max="1" :step="0.01" v-model="state.opacity" />
      <DemoSliderRow label="Size" :min="0.25" :max="8" :step="0.25" v-model="state.size" />
      <DemoSliderRow label="FPS" :min="4" :max="60" :step="1" v-model="state.fps" />
      <template v-if="state.type === 'riso' && state.scale !== undefined && state.strength !== undefined">
        <DemoSliderRow label="Scale" :min="0.1" :max="2" :step="0.05" v-model="state.scale" />
        <DemoSliderRow label="Strength" :min="0.01" :max="0.5" :step="0.01" v-model="state.strength" />
      </template>
    </template>
  </div>
</template>
