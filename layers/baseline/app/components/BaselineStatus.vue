<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'BaselineStatus',
  props: {
    featureId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    if (import.meta.server) return () => null
    return () => h('baseline-status', { featureId: props.featureId })
  },
})
</script>
