<script setup lang="ts">
const { messages } = useChat()
</script>

<template>
  <div
    w-full flex-auto bg-base-100 text-base-content
    flex flex-col justify-end gap-3 pt-8 pb-4 overflow-hidden
  >
    <ClientOnly>
      <ChatMessage v-for="message in messages" :key="message.id" :message="message" />
    </ClientOnly>
  </div>
</template>
