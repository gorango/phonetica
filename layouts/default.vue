<script setup lang="ts">
</script>

<template>
  <main flex min-h-screen w-full md:py-14>
    <div flex-auto flex flex-col max-w-3xl w-full mx-auto shadow-xl shadow-neutral>
      <TheNav />
      <slot />
      <ThePwaPrompts />
    </div>
  </main>
</template>
