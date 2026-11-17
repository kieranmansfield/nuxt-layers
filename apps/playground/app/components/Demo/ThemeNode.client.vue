<script setup lang="ts">
  import { useThemeNodeUniforms, type ThemeNodeProps } from '~/composables/useThemeNodeUniforms'

  const props = defineProps<ThemeNodeProps>()

  const colorNode = useThemeNodeUniforms(props).createColorNode(props.themeId)

  useShaderStage(() => colorNode, 0)
</script>
