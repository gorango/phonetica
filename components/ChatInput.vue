<script setup lang="ts">
const { toggleRecorder, isRecording } = useRecorder()
const { sendChat } = useChat()

const input = ref('')

function onSubmit() {
  sendChat(input.value)
  input.value = ''
}
</script>

<template>
  <div
    sticky bottom-0
    w-full flex items-end gap-2 py-2 px-3
    bg-base-300 text-base-content
  >
    <TextArea v-model="input" self-center @submit="onSubmit" />
    <button
      btn h-8 w-8 flex-center
      hover:bg-neutral hover:text-neutral-content
      title="Send"
      @click="onSubmit"
    >
      <span i-ph-paper-plane-tilt-bold />
    </button>
    <ClientOnly>
      <button
        btn h-8 w-8 flex-center
        :class="{
          'bg-error-content text-error hover:outline outline-error': !isRecording,
          'bg-error text-error-content hover:outline outline-error-content': isRecording,
        }"
        :title="!isRecording ? 'Start Recording' : 'Stop Recording'"
        @click="toggleRecorder"
      >
        <span v-if="!isRecording" i-ph-microphone-bold />
        <span v-else i-ph-microphone-slash-bold />
      </button>
    </ClientOnly>
  </div>
</template>
