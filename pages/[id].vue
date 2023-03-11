<script setup lang="ts">
const { messages, addMessage } = useChat()

const systemPrompt = 'You are a helpful assistant.'

onMounted(() => {
  if (!messages.value?.length) {
    addMessage({
      text: systemPrompt,
      role: 'system',
    })
  }
})
</script>

<template>
  <div
    flex-auto self-center
    w-full h-full bg-base-100
    flex flex-col
  >
    <ChatMessages />
    <ChatInput />
  </div>
</template>
