<!-- https://github.com/vite-pwa/nuxt/blob/fbaaf8cdd9a4fcacb77b6956579be9cec8f5c746/playground/layouts/default.vue -->

<template>
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
        v-if="$pwa?.needRefresh"
        fixed top-0 right-0 p-4 max-w-64 bg-neutral text-neutral-content
        role="alert"
      >
        <div>
          <span>
            New content available, reload to update.
          </span>
        </div>
        <div flex gap-2 mt-2>
          <button btn bg-primary text-primary-content px-2 py-1 @click="$pwa.updateServiceWorker()">
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
        v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
        fixed top-0 right-0 p-4 max-w-64 bg-neutral text-neutral-content
        role="alert"
      >
        <div>
          <span>
            Install PWA
          </span>
        </div>
        <div flex gap-2 mt-2>
          <button btn bg-primary text-primary-content px-2 py-1 @click="$pwa.install()">
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
