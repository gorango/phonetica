<script setup lang="ts">
const state = useLocalState()
</script>

<template>
  <main
    flex min-h-screen w-full md:py-14
    :class="{ color: state.bgOpacity > 0 }"
    :style="{ '--gradient-opacity': `${state.bgOpacity}` }"
  >
    <div
      flex-auto flex flex-col max-w-3xl w-full mx-auto
      bg-base-100 shadow-2xl
      :class="state.bgOpacity > 0 ? 'shadow-primary' : 'shadow-neutral'"
      :style="{ '--un-shadow-opacity': `${state.bgOpacity > 0 ? state.bgOpacity * 1.5 : 0.5}` }"
    >
      <TheNav />
      <slot />
      <ThePwaPrompts />
    </div>
  </main>
</template>

<style>
main {
  background: hsla(var(--n), 0.25);
}
main.color {
  background:
    linear-gradient(225deg, hsla(var(--a), var(--gradient-opacity)), transparent),
    linear-gradient(45deg, hsla(var(--s), var(--gradient-opacity)), transparent),
    linear-gradient(345deg, hsla(var(--p), var(--gradient-opacity)), transparent),
    hsl(var(--b1));
}
</style>
