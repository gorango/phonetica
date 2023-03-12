<script setup lang="ts">
const props = defineProps<{ dir: 't' | 'b' }>()

const buttonRef = ref()
const { y: scrollTop } = useScroll(window)

const isVisible = computed(() => {
  if (props.dir === 't')
    return scrollTop.value > 300
  if (props.dir === 'b')
    return scrollTop.value < document?.body.scrollHeight - window?.innerHeight - 300
  return false
})

function go() {
  if (props.dir === 't')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  if (props.dir === 'b')
    window.scrollTo({ top: document?.body.scrollHeight, behavior: 'smooth' })
}
</script>

<template>
  <button
    v-if="isVisible"
    ref="buttonRef"
    backdrop-blur-sm
    hover:bg-base-300 bg-opacity-05 text-base-content text-opacity-65 hover:text-opacity-100
    transition-all
    sticky z-1
    h-7 w-7 self-center rounded-full
    flex-center
    :class="{
      'top-16': dir === 't',
      'bottom-16': dir === 'b',
    }"
    @click="go"
  >
    <span v-if="dir === 't'" i-ph-arrow-up-bold />
    <span v-if="dir === 'b'" i-ph-arrow-down-bold />
  </button>
</template>
