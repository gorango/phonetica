<script setup lang="ts">
const { state, addSession } = useChat()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (!route.params.id) {
    if (state.value?.sessions.length) {
      const session = state.value.sessions[state.value.sessions.length - 1]
      if (session.messages && session.messages?.length > 1)
        addSession()
      else
        router.replace(session.id)
    }
    else {
      addSession()
    }
  }
})
</script>

<template>
  <div />
</template>
