<script setup lang="ts">
</script>

<template>
  <main flex min-h-screen w-full>
    <div
      flex-auto flex flex-col max-w-3xl w-full mx-auto
      bg-base-100 shadow-2xl shadow-neutral shadow-opacity-50
    >
      <TheNav />
      <slot />
      <ThePwaPrompts />
    </div>
  </main>
</template>

<style>
main {
  background:
    linear-gradient(0deg, hsla(var(--n), 0.1), transparent),
    linear-gradient(225deg, hsla(var(--a), 0.05), transparent),
    linear-gradient(45deg, hsla(var(--s), 0.05), transparent),
    linear-gradient(345deg, hsla(var(--p), 0.05), transparent)
}
</style>
