<script setup lang="ts">
const { messages, addMessage } = useChat()
const route = useRoute()
const { ssrContext } = useNuxtApp()

onMounted(() => {
  if (!messages.value?.length) {
    addMessage({
      content: 'You are a helpful assistant.',
      role: 'system',
    })
  }
})

watch(
  () => route.params.id,
  async () => {
    if (!ssrContext) {
      await new Promise(resolve => setTimeout(resolve))
      window.scrollTo({ top: document?.body.scrollHeight })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div flex-auto self-center flex flex-col relative w-full h-full bg-base-100>
    <ClientOnly>
      <AScrollTo dir="t" />
    </ClientOnly>
    <ChatMessages />
    <ClientOnly>
      <AScrollTo dir="b" />
    </ClientOnly>
    <ChatInput />
  </div>
</template>
