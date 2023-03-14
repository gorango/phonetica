<script lang="ts" setup>
import type { Handler } from '@vueuse/gesture'

const { user } = useAuth()
const { breakpoints } = useTheme()
const docComputed = inject('document') as any
const { minimapRef, viewportBounds, contentBounds, progress, scale, y, dragging } = docComputed

const clone = ref(user.value.clone())
const thumbHeight = computedEager(() => viewportBounds.height.value * scale.value)
const thumbStyle = computedEager(() => {
  const min = contentBounds.height.value * scale.value - thumbHeight.value
  const max = viewportBounds.height.value - thumbHeight.value
  const mod = min > max ? max : min
  const pos = progress.value * mod
  return {
    height: `${thumbHeight.value}px`,
    transform: `translateY(${pos}px)`,
  }
})

onMounted(() => {
  if (!clone.value.settings?.minimapWidth)
    clone.value.settings.minimapWidth = 100
})

const handleResize = useDebounceFn(() => clone.value.save(), 1000)

const onClick = ({ offsetY }: MouseEvent) => {
  const next = (offsetY - thumbHeight.value / 2) / scale.value
  y.value = next
}

const onDrag: Handler<'drag', PointerEvent> = ({ movement, first, last, lastOffset, delta }) => {
  const min = contentBounds.height.value * scale.value - thumbHeight.value
  const max = viewportBounds.height.value - thumbHeight.value
  const mod = min > max ? min / max : 1
  if (first) {
    dragging.value = true
    lastOffset[1] = y.value * scale.value / mod
  }
  const nextY = lastOffset[1] + movement[1] - delta[1]
  const pos = nextY / scale.value * mod
  y.value = pos
  if (last)
    dragging.value = false
}

const isActive = ref(breakpoints.md)
</script>

<template>
  <AButton
    top-0 right-0
    w-10 h-10 bg-base-100 text-base-content text-opacity-50
    style="position: fixed"
    @click="isActive = !isActive"
  >
    <span i-ph:scroll text-xl />
  </AButton>
  <transition name="page-fade">
    <div
      v-if="!breakpoints.md && isActive"
      fixed w-full h-full top-0 left-0 bg-base-300 bg-opacity-20
      @click="isActive = false"
    />
  </transition>
  <transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="transform opacity-0 translate-x-full"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opcaity-0 translate-x-full"
  >
    <ResizeContainer
      v-if="isActive && clone.settings.minimapWidth"
      ref="minimapRef"
      v-model:width="clone.settings.minimapWidth"
      dir="x" pos="left" tag="aside"
      :min="40" :max="400" :dragger-offset="-40"
      max-w-10vw ml-2
      bg-base-100 flex flex-col
      :style="[
        breakpoints.md
          ? {
            position: 'sticky',
            top: '0',
            right: '0',
            height: 'auto',
          }
          : {
            position: 'fixed',
            top: '0',
            right: '0',
            bottom: '0',
            height: '100%',
            zIndex: 6,
          },
      ]"
      class="parent"
      @resize="handleResize"
    >
      <div w-full h-full overflow-y-hidden>
        <div absolute top-0 left-0 w-full opacity-100 will-change-transform bg-base-300 :style="thumbStyle" />
        <div w-full relative max-h-full>
          <PostMinimapClone @click="onClick" />
        </div>
        <div
          v-drag="onDrag"
          absolute top-0 left-0 w-full
          outline="solid 3 offset--3 secondary"
          :style="thumbStyle"
          will-change-transform
          class="group"
        >
          <AFocus />
        </div>
      </div>
    </ResizeContainer>
  </transition>
</template>
