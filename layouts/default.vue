<script setup lang="ts">
</script>

<template>
  <div flex flex-col min-h-screen max-w-3xl w-full mx-auto shadow-xl shadow-neutral>
    <TheNav />
    <slot />
    <ThePwaPrompts />
  </div>
</template>
