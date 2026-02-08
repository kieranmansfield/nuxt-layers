<script lang="ts">
import { cloneVNode, defineComponent, Fragment, h, ref, type VNode } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {
    tag: { type: String, default: 'div' },
    dimOpacity: { type: Number, default: 0.3 },
    duration: { type: Number, default: 200 },
  },
  setup(props, { slots, attrs }) {
    const hoveredIndex = ref<number | null>(null)

    return () => {
      const children = (slots.default?.() ?? [])
        .flatMap(node => node.type === Fragment ? (node.children as VNode[]) : [node])
        .filter(node => typeof node.type === 'string' || typeof node.type === 'object')

      const styledChildren = children.map((vnode, index) =>
        cloneVNode(vnode, {
          onMouseenter: () => { hoveredIndex.value = index },
          style: {
            opacity: hoveredIndex.value !== null && hoveredIndex.value !== index
              ? props.dimOpacity
              : 1,
            transition: `opacity ${props.duration}ms ease-out`,
          },
        }),
      )

      return h(props.tag, {
        ...attrs,
        onMouseleave: () => { hoveredIndex.value = null },
      }, styledChildren)
    }
  },
})
</script>
