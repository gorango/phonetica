<script setup lang="ts">
useHead({
  title: 'Phonetica',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Ubuntu' },
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
  background:
    linear-gradient(225deg, hsla(var(--a), .1), transparent),
    linear-gradient(45deg, hsla(var(--s), .1), transparent),
    linear-gradient(345deg, hsla(var(--p), .1), transparent),
    hsla(var(--n), 0.8);
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
