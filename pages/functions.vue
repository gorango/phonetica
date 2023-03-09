<script setup lang="ts">
const fn = useServerFunctions()
const cwd = await fn.sayHi('world')
</script>

<template>
  <div self-center>
    <div>{{ cwd }}</div>
  </div>
</template>
