<script setup lang="ts">
useHead({
  title: 'Phonetica',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
  ],
})
</script>

<template>
  <ClientOnly>
    <VitePwaManifest />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
a {
  cursor: pointer;
}
body {
  font-family: 'Ubuntu', sans-serif;
  scroll-behavior: smooth;
}
* {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
*::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  display: none !important;
}
</style>
