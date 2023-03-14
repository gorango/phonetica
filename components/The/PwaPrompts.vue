<script setup lang="ts">
const { $pwa } = useNuxtApp()
const state = useLocalState()

const showWorkerPrompt = computed(() => $pwa?.offlineReady || $pwa?.needRefresh)
const showInstallPrompt = computed(() => {
  const isVirgin = new Date(state.value.createdAt).valueOf() > (Date.now() - 1000 * 60 * 5)
  return !isVirgin && $pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh
})

onKeyStroke('Escape', () => {
  showInstallPrompt.value && $pwa.cancelInstall()
  showWorkerPrompt.value && $pwa.cancelPrompt()
})
</script>

<template>
  <!-- https://github.com/vite-pwa/nuxt/blob/fbaaf8cdd9a4fcacb77b6956579be9cec8f5c746/playground/layouts/default.vue -->
  <ClientOnly>
    <transition
      :appear="true"
      enter-active-class="duration-500 ease-out delay-2000"
      enter-from-class="opacity-0 translate-y--2"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y--1"
    >
      <div
        v-if="showWorkerPrompt"
        fixed z-3 top-0 right-0 p-4 max-w-64 bg-neutral text-neutral-content
        role="alert"
      >
        <div>
          <span v-if="$pwa.offlineReady">
            App ready for offline browsing.
          </span>
          <span v-else>
            New content available, click on reload button to update.
          </span>
        </div>
        <div flex gap-2 mt-2>
          <button v-if="$pwa.needRefresh" btn text-primary-content font-bold bg-gradient-to-r from-primary to-secondary px-2 py-1 @click="$pwa.updateServiceWorker()">
            Reload
          </button>
          <button btn bg-base-100 text-base-content px-2 py-1 @click="$pwa.cancelPrompt()">
            Close
          </button>
        </div>
      </div>
    </transition>
    <transition
      :appear="true"
      enter-active-class="duration-500 ease-out delay-2000"
      enter-from-class="opacity-0 translate-y--2"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y--1"
    >
      <div
        v-if="showInstallPrompt"
        fixed top-0 z-3 right-0 p-4 max-w-64 bg-neutral text-neutral-content
        role="alert"
      >
        <div>
          <span>
            Install the app
          </span>
        </div>
        <div flex gap-2 mt-2>
          <button btn text-primary-content font-bold bg-gradient-to-r from-primary to-secondary px-2 py-1 @click="$pwa.install()">
            Install
          </button>
          <button btn bg-base-100 text-base-content px-2 py-1 @click="$pwa.cancelInstall()">
            Cancel
          </button>
        </div>
      </div>
    </transition>
  </ClientOnly>
</template>
