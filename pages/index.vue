<script setup lang="ts">
const { state, addSession } = useChat()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (!route.params.id) {
    if (state.value?.sessions.length)
      router.replace(state.value.sessions[state.value.sessions.length - 1].id)
    else
      addSession()
  }
})
</script>

<template>
  <div />
</template>
