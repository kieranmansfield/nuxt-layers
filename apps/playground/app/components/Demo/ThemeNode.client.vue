<script setup lang="ts">
  import { useThemeNodeUniforms, type ThemeNodeProps } from '~/composables/useThemeNodeUniforms'

  // eslint-disable-next-line vue/define-props-destructuring -- useThemeNodeUniforms reads the whole reactive props object
  const props = defineProps<ThemeNodeProps>()

  const colorNode = useThemeNodeUniforms(props).createColorNode(props.themeId)

  useShaderStage(() => colorNode, 0)
</script>
