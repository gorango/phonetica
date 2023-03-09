<script setup lang="ts">
const colorMode = useColorMode()
const themes = [
  'system', 'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
  'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden',
  'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury',
  'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night',
  'coffee', 'winter',
]
const cycle = useCycleList(themes)

onMounted(() => {
  cycle.index.value = themes.indexOf(colorMode.preference)
})

function next() {
  const pref = cycle.next()
  colorMode.preference = pref
}
</script>

<template>
  <ClientOnly>
    <button
      btn flex-center h-8 w-8 select-none capitalize
      bg-base-300 text-base-content
      hover:bg-secondary hover:text-secondary-content transition-colors
      @click="next()"
    >
      <!-- {{ colorMode.preference }} Theme -->
      <span i-ph-paint-brush-bold font-2xl />
    </button>
  </ClientOnly>
</template>
