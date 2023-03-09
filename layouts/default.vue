<script setup lang="ts">
</script>

<template>
  <div flex flex-col min-h-screen>
    <nav
      bg-base-200 text-base-content
      flex items-center justify-center self-center p3 gap3
      max-w-4xl w-full
    >
      <button btn bg-base-300 px2 gap2 h8 flex-center font-800>
        <Logo w-6 h-6 />
        <h1>Phonetica</h1>
      </button>
      <!-- <img src="/logo.svg" w-6> -->
      <span flex-auto />
      <CycleThemes />
    </nav>

    <slot />
  </div>
</template>

<style>
body {
  background-color: hsla(var(--n), 0.5);
}
</style>
