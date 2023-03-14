<script setup lang="ts">
defineEmits(['click'])
defineExpose({ update: updateMap })

const { user } = useAuth()
const docComputed = inject('document') as any
const { contentRef, contentBounds, viewportBounds, progress, scale } = docComputed
const mapRef = ref<HTMLElement>()

watch(scale, useDebounceFn(() => updateMap(), 100))

function updateMap() {
  if (!mapRef.value || !contentRef.value)
    return
  const contentEl = contentRef.value.cloneNode(true) as HTMLElement
  const mapEl = mapRef.value as unknown as HTMLElement
  const hasChild = mapEl.childNodes[0]
  const hasNewContent = !mapEl.childNodes?.[0]?.isEqualNode(contentEl)
  if (!hasNewContent)
    return
  if (hasChild)
    mapEl.innerHTML = ''
  contentEl.style.width = `min(${user.value.settings.docWidth}px, 100vw)`
  contentEl.style.userSelect = 'none'
  contentEl.style.overflow = 'hidden'
  contentEl.style.pointerEvents = 'none'
  contentEl.style.transform = `scale(${scale.value})`
  contentEl.style.transformOrigin = 'top left'
  mapEl.appendChild(contentEl)
}

const contentStyle = computed(() => {
  const mapHeight = contentBounds.height.value * scale.value
  let offset = 0
  if (mapHeight >= viewportBounds.height.value)
    offset = (mapHeight - viewportBounds.height.value) * progress.value * -1
  return {
    height: `${mapHeight}px`,
    transform: `translateY(${offset}px)`,
  }
})
</script>

<template>
  <div
    ref="mapRef"
    :style="contentStyle"
    will-change-transform
    @click="$emit('click', $event)"
  />
</template>
