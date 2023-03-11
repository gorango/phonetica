<script setup lang="ts">
useHead({
  title: 'Phonetica',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Prompt' },
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
  font-family: 'Prompt', sans-serif;
}
</style>
