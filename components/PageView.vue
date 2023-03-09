<script setup lang="ts">
const { data } = await useFetch('/api/pageview')

const time = useTimeAgo(computed(() => data.value!.startAt))
</script>

<template>
  <div>
    <span font-500>{{ data?.pageview }}</span>
    page views since
    <span>{{ time }}</span>
  </div>
</template>
