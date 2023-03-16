<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { session } = useChat()
const { ssrContext } = useNuxtApp()

watch(
  () => route.params.id,
  async () => {
    if (!ssrContext) {
      await new Promise(resolve => setTimeout(resolve))
      window.scrollTo({ top: document?.body.scrollHeight, behavior: 'auto' })
      !session.value && router.replace('/')
    }
  },
  { immediate: true },
)
</script>

<template>
  <ClientOnly>
    <AScrollTo dir="t" />
  </ClientOnly>
  <ChatMessages />
  <ClientOnly>
    <AScrollTo dir="b" />
  </ClientOnly>
  <ChatInput />
</template>
