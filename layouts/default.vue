<script setup lang="ts">
// const { next: nextTheme } = useTheme()
const { state, addSession, removeSession } = useChat()
const { themes, set } = useTheme()
const route = useRoute()
const { ssrContext } = useNuxtApp()
const { breakpoints } = useTheme()

const sessions = computed(() => [
  ...state.value?.sessions
    .map(session => ({
      ...session,
      isActive: session.id === route.params.id,
    })),
].reverse())
const hasSessions = computed(() => sessions.value.length > 1)

const sessionScrollRef = ref<HTMLDivElement>()
const { x } = useScroll(sessionScrollRef)

const isSessionScrollHovered = !ssrContext && useElementHover(sessionScrollRef)

function scrollX({ deltaY }: WheelEvent) {
  x.value += deltaY
}

const isActiveTheme = ref(false)
const isActiveSound = ref(false)
</script>

<template>
  <div flex flex-col min-h-screen max-w-3xl w-full mx-auto>
    <nav
      sticky top-0 z-1 select-none
      bg-base-300 text-base-content
      w-full flex items-center justify-start self-center h-14 px-3 gap-3
    >
      <ClientOnly>
        <button
          btn flex-center h-8 w-auto flex-nowrap whitespace-nowrap px-2
          hover:bg-primary hover:text-primary-content text-base-content
          @click="addSession()"
        >
          <template v-if="breakpoints.sm">
            New Chat
          </template>
          <template v-else>
            <span i-ph-plus-bold />
          </template>
        </button>
        <div
          ref="sessionScrollRef"
          flex-auto flex items-center gap-1 overflow-x-auto scroll-smooth py-2 mx--2
          @mousewheel="scrollX"
        >
          <div h-10 min-w-6 sticky left-0 bg-gradient-to-r from-base-300 to-transparent z-1 />
          <template v-for="session, i in sessions" :key="session.id">
            <div v-if="hasSessions" relative py-1 class="group">
              <button
                btn flex-center h-8 min-w-8
                :class="[
                  session.isActive ? 'bg-primary text-primary-content' : 'bg-base-100 text-base-content group-hover:bg-neutral group-hover:text-neutral-content group-hover:text-opacity-100',
                  { 'bg-opacity-15 text-opacity-15 focus:bg-opacity-100 focus:text-opacity-100': !session.isActive && !isSessionScrollHovered },
                ]"
                :title="`${session.isActive ? 'Current' : 'View'} Chat`"
                @click="$router.push(session.id)"
                @keypress.delete.backspace="removeSession(session.id)"
                v-text="sessions.length - i"
              />
              <button
                absolute z-1
                class="top-[-2px] right-[-6px]"
                invisible group-hover:visible
                btn w-3 h-3 flex-center
                bg-error text-error-content
                @click="removeSession(session.id)"
              >
                <span i-ph-x-bold />
              </button>
            </div>
          </template>
          <div h-10 min-w-6 sticky right-0 bg-gradient-to-l from-base-300 to-transparent z-1 />
        </div>
        <div id="theme-container" relative>
          <button
            btn flex-center h-8 min-w-8 select-none capitalize
            hover:bg-neutral hover:text-neutral-content
            :class="isActiveTheme ? 'bg-neutral text-neutral-content' : 'text-base-content'"
            title="Theme Settings"
          >
            <AMenu v-model="isActiveTheme" placement="bottom-end" target="#theme-container" persist="content">
              <div bg-neutral my-4 rounded grid grid-cols-2 p-1 gap-1 w-32 @click.stop.prevent>
                <button
                  v-for="theme in themes"
                  :key="theme"
                  :data-theme="theme"
                  btn h-8 w-full whitespace-nowrap px-2 py-1
                  flex-center flex-nowrap gap-1
                  @click.stop.prevent="set(theme)"
                >
                  <span w-3 h-3 bg-primary rounded-full />
                  <span w-2 h-2 bg-secondary rounded-full />
                  <span w-2 h-2 bg-accent rounded-full />
                </button>
              </div>
            </AMenu>
            <span i-ph-paint-brush-bold font-2xl />
          </button>
        </div>
        <div id="sound-container" relative>
          <button
            btn flex-center h-8 min-w-8 select-none capitalize
            hover:bg-neutral hover:text-neutral-content
            :class="isActiveSound ? 'bg-neutral text-neutral-content' : 'text-base-content'"
            title="Sound Settings"
          >
            <AMenu v-model="isActiveSound" placement="bottom-end" target="#sound-container" persist="content">
              <div bg-neutral text-neutral-content my-4 rounded p-1 flex flex-col gap-1 @click.stop.prevent>
                <button
                  btn bg-base-300 text-base-content px-2 h-8 flex-center whitespace-nowrap w-full
                  @click.stop.prevent="state.audio.isMuted = !state.audio.isMuted"
                >
                  <template v-if="!state.audio.isMuted">
                    Mute
                  </template>
                  <template v-else>
                    Unmute
                  </template>
                </button>
                <div flex gap-2 items-center>
                  <button btn h-8 w-8 flex-center bg-base-300 text-base-content :disabled="state.audio.playbackRate === 0.25" @click="state.audio.playbackRate = Math.max(state.audio.playbackRate - 0.25, 0.25)">
                    <span i-ph-arrow-fat-lines-down-bold />
                  </button>
                  <div flex flex-col items-center w-14>
                    <!-- <input
                      v-model="state.audio.playbackRate"
                      type="number" step="0.25" min="0.25" max="3.5"
                      bg-transparent w-full text-center
                    > -->
                    {{ state.audio.playbackRate.toFixed(2) }}
                  </div>
                  <button btn h-8 w-8 flex-center bg-base-300 text-base-content :disabled="state.audio.playbackRate === 3.5" @click="state.audio.playbackRate = Math.min(state.audio.playbackRate + 0.25, 3.5)">
                    <span i-ph-arrow-fat-lines-up-bold />
                  </button>
                </div>
              </div>
            </AMenu>
            <span v-if="!state.audio.isMuted" i-ph-speaker-high-bold font-2xl />
            <span v-else i-ph-speaker-slash-bold font-2xl />
          </button>
        </div>
      </ClientOnly>
    </nav>

    <slot />
  </div>
</template>

<style>
body {
  background-color: hsla(var(--n), .75);
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
