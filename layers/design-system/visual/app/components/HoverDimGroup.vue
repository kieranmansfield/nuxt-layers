<script lang="ts">
  import { cloneVNode, defineComponent, Fragment, h, ref, type VNode } from 'vue'

  export default defineComponent({
    name: 'HoverDimGroup',
    inheritAttrs: false,
    props: {
      as: { type: String, default: 'div' },
      dimOpacity: { type: Number, default: 0.3 },
      duration: { type: Number, default: 200 },
    },
    setup(props, { slots, attrs }) {
      const hoveredIndex = ref<number | null>(null)

      // v-for over slots nests fragments (v-for → slot → element), so flatten all the way down
      const flatten = (nodes: VNode[]): VNode[] =>
        nodes.flatMap((node) =>
          node.type === Fragment && Array.isArray(node.children)
            ? flatten(node.children as VNode[])
            : [node]
        )

      return () => {
        const children = flatten(slots.default?.() ?? []).filter(
          (node) => typeof node.type === 'string' || typeof node.type === 'object'
        )

        const styledChildren = children.map((vnode, index) =>
          cloneVNode(vnode, {
            onMouseenter: () => {
              hoveredIndex.value = index
            },
            style: {
              opacity:
                hoveredIndex.value !== null && hoveredIndex.value !== index ? props.dimOpacity : 1,
              transition: `opacity ${props.duration}ms ease-out`,
            },
          })
        )

        return h(
          props.as,
          {
            ...attrs,
            onMouseleave: () => {
              hoveredIndex.value = null
            },
          },
          styledChildren
        )
      }
    },
  })
</script>
