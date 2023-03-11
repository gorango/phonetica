<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const inputRef = ref<HTMLTextAreaElement>()

onKeyStroke('Enter', (e) => {
  if (!e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    emit('submit')
  }
})

onKeyStroke('Escape', () => emit('close'))

watch(
  () => props.modelValue,
  async () => {
    await nextTick()
    if (inputRef.value)
      resizeElement()
  },
  { immediate: true },
)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

function resizeElement() {
  const maxHeight = 144
  const textarea = inputRef.value
  if (!(textarea instanceof HTMLTextAreaElement))
    return
  textarea.style.height = 'auto'
  const scrollHeight = textarea.scrollHeight
  if (scrollHeight > maxHeight)
    textarea.style.height = `${maxHeight}px`
  else
    textarea.style.height = `${scrollHeight}px`
}
</script>

<template>
  <textarea
    ref="inputRef"
    :value="props.modelValue"
    tabindex="0"
    rows="1"
    autofocus bg-transparent
    resize-none flex-auto
    class="leading-[28px]"
    outline="none"
    @input="onInput"
  />
</template>
