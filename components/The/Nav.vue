<script setup lang="ts">
const state = useLocalState()
const { addSession, removeSession } = useChat()
const { themes, set } = useTheme()
const route = useRoute()
const { ssrContext } = useNuxtApp()
const { breakpoints } = useTheme()

const isActiveTheme = ref(false)
const isActiveSound = ref(false)
const sessionScrollRef = ref<HTMLDivElement>()
const { x, arrivedState } = useScroll(sessionScrollRef, { behavior: 'auto' })
const isSessionScrollHovered = !ssrContext && useElementHover(sessionScrollRef)
const scrollX = (e: WheelEvent) => {
  x.value += e.deltaY
  if ((e.deltaY < 0 && !arrivedState.left) || (e.deltaY > 0 && !arrivedState.right)) {
    e.preventDefault()
    e.stopPropagation()
  }
}

const sessions = computed(() =>
  state.value?.sessions
    .map(session => ({ ...session, isActive: session.id === route.params.id }))
    .reverse(),
)
</script>

<template>
  <nav
    sticky top-0 z-2 select-none w-full flex items-center justify-start self-center
    h-14 px-3 gap-3 bg-base-300 text-base-content
  >
    <ClientOnly>
      <!-- New Chat Start -->
      <button
        btn flex-center h-8 w-auto flex-nowrap whitespace-nowrap px-2 font-bold
        bg-base-100 text-base-content hover:bg-primary hover:text-primary-content
        @click="addSession()"
      >
        <template v-if="breakpoints.sm">
          New Chat
        </template>
        <template v-else>
          <span i-ph-plus-bold />
        </template>
      </button>
      <!-- New Chat End -->

      <!-- Chats Menu Start -->
      <section
        ref="sessionScrollRef"
        flex-auto flex items-center gap-1 overflow-x-auto py-2 mx--2
        @mousewheel="scrollX"
      >
        <div left-0 sticky z-1 h-10 min-w-6 bg-gradient-to-r from-base-300 to-transparent />
        <template v-for="session, i in sessions" :key="session.id">
          <div v-if="sessions.length > 1" relative py-1 class="group">
            <button
              btn flex-center h-8 min-w-8
              :class="{
                'bg-primary text-primary-content': session.isActive,
                'bg-base-100 text-base-content group-hover:bg-neutral group-hover:text-neutral-content group-hover:text-opacity-100': !session.isActive,
                'bg-opacity-15 text-opacity-15 focus:bg-opacity-100 focus:text-opacity-100': !session.isActive && !isSessionScrollHovered && breakpoints.md,
              }"
              :title="`${session.isActive ? 'Current' : 'View'} Chat`"
              @click="$router.push(session.id)"
              @keypress.delete.backspace="removeSession(session.id)"
              v-text="sessions.length - i"
            />
            <button
              absolute z-1 btn w-3 h-3 flex-center
              invisible group-hover:visible
              :style="{ top: '-2px', right: '-6px' }"
              bg-error text-error-content
              @click="removeSession(session.id)"
            >
              <span i-ph-x-bold />
            </button>
          </div>
        </template>
        <div right-0 sticky z-1 h-10 min-w-6 bg-gradient-to-l from-base-300 to-transparent />
      </section>
      <!-- Chats Menu End -->

      <!-- Theme Popup Start -->
      <div id="theme-container" relative>
        <button
          btn flex-center h-8 min-w-8 select-none capitalize
          hover:bg-neutral hover:text-neutral-content
          :class="isActiveTheme ? 'bg-neutral text-neutral-content' : 'text-base-content'"
          title="Theme Settings"
        >
          <span i-ph-paint-brush-bold font-2xl />
          <AMenu v-model="isActiveTheme" placement="bottom-end" target="#theme-container" persist="content">
            <div bg-neutral my-2 rounded p-1 w-32 flex flex-col @click.stop.prevent>
              <div grid grid-cols-2 gap-1>
                <button
                  v-for="theme in themes" :key="theme"
                  :data-theme="theme"
                  btn h-8 w-full whitespace-nowrap flex-center flex-nowrap gap-1 px-2 py-1
                  @click.stop.prevent="set(theme)"
                >
                  <span w-3 h-3 bg-primary rounded-full />
                  <span w-2 h-2 bg-secondary rounded-full />
                  <span w-2 h-2 bg-accent rounded-full />
                </button>
              </div>
            </div>
          </AMenu>
        </button>
      </div>
      <!-- Theme Popup End -->

      <!-- Sound Popup Start -->
      <div id="sound-container" relative>
        <button
          btn flex-center h-8 min-w-8 select-none capitalize hover:bg-neutral hover:text-neutral-content
          :class="isActiveSound ? 'bg-neutral text-neutral-content' : 'text-base-content'"
          title="Sound Settings"
        >
          <span v-if="!state.audio.isMuted" i-ph-speaker-high-bold font-2xl />
          <span v-else i-ph-speaker-slash-bold font-2xl />
          <AMenu v-model="isActiveSound" placement="bottom-end" target="#sound-container" persist="content">
            <div bg-neutral text-neutral-content my-2 rounded p-1 flex flex-col gap-1 @click.stop.prevent>
              <button
                btn bg-base-300 text-base-content px-2 h-8 flex-center whitespace-nowrap w-full
                @click.stop.prevent="state.audio.isMuted = !state.audio.isMuted"
                v-text="state.audio.isMuted ? 'Unmute' : 'Mute'"
              />
              <div flex gap-2 items-center>
                <button
                  btn h-8 w-8 flex-center bg-base-300 text-base-content
                  :disabled="state.audio.playbackRate === 0.25"
                  @click="state.audio.playbackRate = Math.max(state.audio.playbackRate - 0.25, 0.25)"
                >
                  <span i-ph-arrow-fat-lines-down-bold />
                </button>
                <span flex flex-col items-center w-14>{{ state.audio.playbackRate.toFixed(2) }}</span>
                <button
                  btn h-8 w-8 flex-center bg-base-300 text-base-content
                  :disabled="state.audio.playbackRate === 4.5"
                  @click="state.audio.playbackRate = Math.min(state.audio.playbackRate + 0.25, 4.5)"
                >
                  <span i-ph-arrow-fat-lines-up-bold />
                </button>
              </div>
            </div>
          </AMenu>
        </button>
      </div>
      <!-- Sound Popup End -->
    </ClientOnly>
  </nav>
</template>
