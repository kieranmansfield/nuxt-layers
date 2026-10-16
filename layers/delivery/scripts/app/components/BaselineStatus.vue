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
      // Render the custom element on server AND client. Returning null on the server
      // produced a comment node there but an element on the client (hydration mismatch);
      // an unregistered custom element is inert until the client script upgrades it.
      return () => h('baseline-status', { featureId: props.featureId })
    },
  })
</script>
