<script lang="ts" setup>
  import { colorClass } from '../../composables/color'
  import { useRepeatFill } from '../../composables/repeatFill'
  import { typographyClasses } from '../../composables/typography'
  import type { UiColors } from '../../types/colors'
  import type { FontWeight, TypeStep, TypographyTag } from '../../types/typography'

  const {
    rows = 1,
    direction = 'vertical',
    text = '',
    repeat = 'auto',
    separator = '',
    weight = undefined,
    step = 7,
    color = undefined,
    offset = [],
    letterSpacing = undefined,
    wordSpacing = undefined,
    rowGap = '0',
    as = 'div',
    stroke = false,
    strokeWidth = 1.5,
  } = defineProps<{
    rows?: number
    direction?: 'horizontal' | 'vertical'
    text?: string | string[]
    repeat?: number | 'auto'
    separator?: string
    weight?: FontWeight | FontWeight[]
    step?: TypeStep | TypeStep[]
    color?: UiColors | UiColors[]
    offset?: string[]
    letterSpacing?: string | string[]
    wordSpacing?: string | string[]
    rowGap?: string
    as?: TypographyTag
    // Renders copies as outline-only (no fill) — the classic poster trick of
    // mixing solid/hollow repeats down a column. 'even'/'odd' alternate;
    // 'center' fills only the middle copy and strokes the rest.
    stroke?: 'even' | 'odd' | 'center' | false
    strokeWidth?: number
  }>()

  function pick<T>(value: T | T[] | undefined, index: number): T | undefined {
    if (value === undefined) return undefined
    return Array.isArray(value) ? value[index % value.length] : value
  }

  const rowText = (i: number) => pick(text, i) ?? ''
  const rowWeight = (i: number) => pick(weight, i)
  const rowStep = (i: number) => pick(step, i)
  const rowColor = (i: number) => pick(color, i)
  const rowOffset = (i: number) => offset[i] ?? '0'
  const rowLetterSpacing = (i: number) => pick(letterSpacing, i)
  const rowWordSpacing = (i: number) => pick(wordSpacing, i)

  const rowClasses = computed(() =>
    Array.from({ length: rows }, (_, i) => {
      const weight = rowWeight(i)
      const step = rowStep(i)
      return typographyClasses({
        leading: 'leading-normal',
        ...(weight !== undefined && { weight }),
        ...(step !== undefined && { step }),
      })
    })
  )

  const rowColorClasses = computed(() =>
    Array.from({ length: rows }, (_, i) => colorClass(rowColor(i), 'text'))
  )

  const rowStyle = (i: number) => ({
    transform:
      direction === 'vertical' ? `translateY(${rowOffset(i)})` : `translateX(${rowOffset(i)})`,
    ...(rowLetterSpacing(i) !== undefined && { letterSpacing: rowLetterSpacing(i) }),
    ...(rowWordSpacing(i) !== undefined && { wordSpacing: rowWordSpacing(i) }),
  })

  const containerRefs = useTemplateRef<HTMLElement[]>('containerRefs')
  const itemRefs = ref<HTMLElement[]>([])

  const { calculatedCopies } = useRepeatFill({
    containerRefs,
    itemRefs,
    rowCount: computed(() => (repeat === 'auto' ? rows : 0)),
    axis: computed(() => (direction === 'vertical' ? 'height' : 'width')),
  })

  const rowCopies = (i: number) => {
    const n = repeat === 'auto' ? (calculatedCopies.value[i] ?? 1) : repeat
    // 'center' needs a true middle copy, so always round up to an odd count.
    return stroke === 'center' && n % 2 === 0 ? n + 1 : n
  }

  const isStrokeCopy = (copy: number, total: number) => {
    if (!stroke) return false
    if (stroke === 'center') return copy !== (total + 1) / 2
    return stroke === 'even' ? copy % 2 === 0 : copy % 2 === 1
  }

  const setItemRef = (el: Element | ComponentPublicInstance | null, rowIndex: number) => {
    const node = el && '$el' in el ? (el.$el as HTMLElement) : el
    if (node instanceof HTMLElement) itemRefs.value[rowIndex] = node
  }
</script>

<template>
  <ElementTw
    :as
    :component-props="{
      class: ['flex', direction === 'vertical' ? 'flex-row h-full' : 'flex-col'],
      style: { gap: rowGap },
    }"
  >
    <div
      v-for="i in rows"
      :key="i - 1"
      ref="containerRefs"
      class="overflow-hidden"
      :class="direction === 'vertical' ? 'h-full' : 'w-full'"
    >
      <div
        class="flex whitespace-nowrap"
        :class="direction === 'vertical' ? 'flex-col' : 'flex-nowrap'"
        :style="rowStyle(i - 1)"
      >
        <template v-for="copy in rowCopies(i - 1)" :key="copy">
          <TypographyTextStroke
            v-if="isStrokeCopy(copy, rowCopies(i - 1))"
            :ref="(el) => copy === 1 && setItemRef(el, i - 1)"
            :text="rowText(i - 1)"
            :stroke-width
            :class="[rowClasses[i - 1], rowColorClasses[i - 1]]"
          />
          <span
            v-else
            :ref="(el) => copy === 1 && setItemRef(el, i - 1)"
            :class="[rowClasses[i - 1], rowColorClasses[i - 1]]"
          >
            {{ rowText(i - 1) }}{{ copy < rowCopies(i - 1) ? separator : '' }}
          </span>
        </template>
      </div>
    </div>
  </ElementTw>
</template>
