<script setup lang="ts">
  import type { ButtonProps } from '@nuxt/ui'

  // A UButton styled by `mastNav.trigger` in app.config; attrs (class, label, icon…) win.
  // Positioning is the parent's call, e.g. `<MastNav class="fixed top-0 right-0" />`.
  defineOptions({ inheritAttrs: false })

  const { open } = useMastNav()
  // app.config types the trigger loosely (see MastNavTrigger); UButton validates the values
  const trigger = ((useAppConfig().mastNav as { trigger?: unknown } | undefined)?.trigger ??
    {}) as ButtonProps
</script>

<template>
  <UButton aria-label="Open navigation menu" v-bind="{ ...trigger, ...$attrs }" @click="open">
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </UButton>
</template>
