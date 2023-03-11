<script setup lang="ts">
import type { Middleware, Placement, Strategy } from '@floating-ui/dom'

const props = withDefaults(defineProps<{
  modelValue?: boolean | null
  persist?: boolean | 'content'
  trigger?: 'click' | 'hover' | 'contextmenu'
  transition?: string | null
  placement?: Placement
  strategy?: Strategy
  target?: string
  middleware?: ((referenceEl: HTMLElement, floatingEl: HTMLElement) => Middleware[]) | null
}>(), {
  modelValue: null,
  persist: false,
  trigger: 'click',
  transition: undefined,
  placement: 'bottom-start',
  strategy: 'absolute',
  target: 'body',
  middleware: null,
})

const emit = defineEmits(['update:modelValue'])
const isMounted = useMounted()

const _isMenuVisible = ref(false)
const isMenuVisible = computed({
  get: () => props.modelValue || _isMenuVisible.value,
  set: (value) => {
    _isMenuVisible.value = value
    emit('update:modelValue', value)
  },
})
const toggleMenu = useToggle(isMenuVisible)
onKeyStroke('Escape', () => toggleMenu(false))

const { referenceRef, floatingRef, x, y } = useFloating({ placement: props.placement })

const transition = computed(() => {
  if (props.transition === null)
    return null
  if (typeof props.transition === 'string')
    return { name: props.transition }
  if (typeof props.transition === 'object')
    return props.transition
  return {
    enterActiveClass: 'duration-500 ease-out',
    enterFromClass: 'opacity-0 translate-y-2',
    enterToClass: 'opacity-100',
    leaveActiveClass: 'duration-200 ease-out',
    leaveFromClass: 'opacity-100',
    leaveToClass: 'opacity-0 translate-y-1',
  }
})

onMounted(() => {
  const vm = getCurrentInstance()
  referenceRef.value = vm?.proxy?.$el?.parentNode?.parentNode
})

if (props.trigger === 'hover') {
  useEventListener(referenceRef, 'mouseenter', () => toggleMenu(true))
  useEventListener(referenceRef, 'mouseleave', () => toggleMenu(false))
  useEventListener(floatingRef, 'mouseenter', () => toggleMenu(true))
  useEventListener(floatingRef, 'mouseleave', () => toggleMenu(false))
}
if (props.trigger === 'click' && props.modelValue !== null) {
  useEventListener(referenceRef, 'click', () => {
    toggleMenu(!isMenuVisible.value)
  })
}
if (props.trigger === 'contextmenu') {
  useEventListener(referenceRef, 'contextmenu', (event: MouseEvent) => {
    event.preventDefault()
    toggleMenu(!isMenuVisible.value)
  })
}
if (props.persist !== true) {
  onClickOutside(
    floatingRef,
    () => {
      if (props.modelValue || isMenuVisible.value)
        toggleMenu(false)
    }, { ignore: props.persist === 'content' ? [referenceRef] : [] },
  )
}
</script>

<template>
  <template v-if="isMounted">
    <Teleport :to="target">
      <transition v-bind="transition">
        <div
          v-show="modelValue ?? isMenuVisible"
          ref="floatingRef"
          :style="{
            left: `${x}px`,
            top: `${y}px`,
            transitionProperty: 'opacity, transform',
          }"
          :class="props.strategy"
        >
          <slot />
        </div>
      </transition>
    </Teleport>
  </template>
</template>
