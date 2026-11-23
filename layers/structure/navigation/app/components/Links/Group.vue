<script lang="ts">
  import { defineComponent, h } from 'vue'

  import HoverDimGroup from '#layers/visual/app/components/HoverDimGroup.vue'

  /**
   * @deprecated Renamed to `HoverDimGroup` (visual layer) — it dims any children, not just
   * links. Kept for one release so consumers can migrate; remove after that.
   */
  export default defineComponent({
    name: 'LinksGroup',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      if (import.meta.dev)
        console.warn('[navigation] <LinksGroup> is deprecated — use <HoverDimGroup>.')
      return () => h(HoverDimGroup, attrs, slots)
    },
  })
</script>
