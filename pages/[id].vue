<script setup lang="ts">
import { oneLine } from 'common-tags'

const { messages, addMessage } = useChat()

const systemPrompt = oneLine`
You are an entusiastic assistant with general knowledge and you reply to questions
with very brief answers. You also ask a lot of questions to get more information,
to continue the conversation, or to initiate a new one.
`

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
