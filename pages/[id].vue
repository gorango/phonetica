<script setup lang="ts">
const { messages, addMessage } = useChat()
const route = useRoute()
const { ssrContext } = useNuxtApp()

const systemPrompt = 'You are a helpful assistant.'

onMounted(() => {
  if (!messages.value?.length) {
    addMessage({
      text: systemPrompt,
      role: 'system',
    })
  }
})

watch(
  () => route.params.id,
  async () => {
    if (!ssrContext) {
      await new Promise(resolve => setTimeout(resolve))
      window.scrollTo({
        top: document?.body.scrollHeight,
        behavior: 'auto',
      })
    }
  },
  { immediate: true },
)
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
