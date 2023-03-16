<script setup lang="ts">
const { isRecording, toggleRecorder } = useRecorder()
const { isLoading, submitChat } = useChat()
const { breakpoints } = useTheme()

const inputRef = ref()
const input = ref('')

onMounted(() => breakpoints.md && inputRef.value.focus())

function onSubmit(hydrate = false) {
  if (isLoading.value)
    return
  if (hydrate) {
    const component = inputRef.value
    return component.submit()
  }
  submitChat(input.value)
  input.value = ''
}
</script>

<template>
  <div
    sticky bottom-0 flex items-end gap-2 py-2 px-3 w-full z-2
    bg-base-300 text-base-content
  >
    <ATextArea ref="inputRef" v-model="input" self-center @submit="onSubmit()" />
    <button
      btn h-10 w-10 flex-center
      hover:bg-neutral hover:text-neutral-content
      title="Send"
      :disabled="!!isLoading"
      @click="onSubmit(true)"
    >
      <span i-ph-paper-plane-tilt-bold text-lg />
    </button>
    <ClientOnly>
      <button
        btn h-10 w-10 flex-center rounded-full
        bg-error text-error-content hover:outline outline-error-content
        :class="{ 'animate-pulse': isRecording }"
        :title="!isRecording ? 'Start Recording' : 'Stop Recording'"
        :disabled="!!isLoading"
        @click="toggleRecorder"
      >
        <span v-if="!isRecording" i-ph-microphone-bold text-lg />
        <span v-else i-ph-circle-fill text-xs />
      </button>
    </ClientOnly>
  </div>
</template>
