<script setup lang="ts">
  import { Color } from 'three'
  import {
    float,
    floor,
    fract,
    min,
    mix,
    mod,
    smoothstep,
    uniform,
    vec2,
    vec4,
  } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    brickColor = '#a8452b',
    mortarColor = '#d8d2c4',
    columns = 8,
    rows = 16,
    mortar = 0.06,
    order = 0,
  } = defineProps<{
    brickColor?: string
    mortarColor?: string
    /** Bricks across the screen */
    columns?: number
    /** Brick rows down the screen */
    rows?: number
    /** Mortar width as a fraction of one brick */
    mortar?: number
    order?: number
  }>()

  const brickNode = hexToVec3Uniform(brickColor)
  const mortarColorNode = hexToVec3Uniform(mortarColor)
  const columnsNode = uniform(columns)
  const rowsNode = uniform(rows)
  const mortarNode = uniform(mortar)
  watch(
    () => brickColor,
    (v) => {
      const c = new Color(v)
      brickNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => mortarColor,
    (v) => {
      const c = new Color(v)
      mortarColorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => columns,
    (v) => {
      columnsNode.value = v
    }
  )
  watch(
    () => rows,
    (v) => {
      rowsNode.value = v
    }
  )
  watch(
    () => mortar,
    (v) => {
      mortarNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uvCurrent = pipeline.uvNode.value
    const row = floor(uvCurrent.y.mul(rowsNode))
    // Offset every other row by half a brick
    const offset = mod(row, 2).mul(0.5)
    const cell = vec2(uvCurrent.x.mul(columnsNode).add(offset), uvCurrent.y.mul(rowsNode))
    const f = fract(cell)
    const edge = min(min(f.x, float(1).sub(f.x)), min(f.y, float(1).sub(f.y)))
    const brick = smoothstep(mortarNode, mortarNode.add(0.02), edge)
    return vec4(mix(mortarColorNode, brickNode, brick), 1.0)
  }, order)
</script>
