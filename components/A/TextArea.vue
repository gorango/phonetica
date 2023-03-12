<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const textareaRef = ref<HTMLTextAreaElement>()
const cloneValue = ref('')
defineExpose({ submit, textareaRef })

onKeyStroke('Enter', (e) => {
  if (!e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    submit()
  }
})
onKeyStroke('Escape', () => emit('close'))

watch(
  () => props.modelValue,
  (value) => {
    cloneValue.value = value
  },
  { immediate: true },
)

watch(
  cloneValue,
  async () => {
    await nextTick()
    if (textareaRef.value)
      resizeElement()
  },
  { immediate: true },
)

function submit() {
  emit('update:modelValue', cloneValue.value)
  emit('submit')
  cloneValue.value = ''
}

function onInput(event: Event) {
  cloneValue.value = (event.target as HTMLTextAreaElement).value
}

function resizeElement() {
  const maxHeight = 144
  const textarea = textareaRef.value
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
    ref="textareaRef"
    :value="cloneValue"
    tabindex="0"
    rows="1"
    autofocus bg-transparent
    resize-none flex-auto
    class="leading-[28px]"
    outline="none"
    @input="onInput"
  />
</template>
