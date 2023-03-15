<script setup lang="ts">
import { marked } from 'marked'
import type { Message } from '~/composables/chat'

const props = defineProps<{ message: Message }>()
const message = toRef(props, 'message')
const state = useLocalState()
const { breakpoints } = useTheme()
const { messageRefs, messages, isEditing, isLoading, toggleMessage, retryMessage } = useChat()
const { audioRef, controls, togglePlay } = useAudio(message)
const editRef = ref()

const progress = computed(() => {
  const { currentTime, duration } = controls
  const progress = currentTime.value / duration.value
  return 128 - (128 * (progress || 1))
})

function updateMessage() {
  const component = editRef.value
  component.submit()
}

function parse(text: string) {
  return marked.parse(text, {
    gfm: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
  })
}

function toggleEdit(event: MouseEvent) {
  if (event.type === 'contextmenu' && ['user', 'system'].includes(message.value.role) && !isEditing.value)
    event.preventDefault()
  if (!isEditing.value && message.value.role !== 'assistant')
    toggleMessage(message.value)
}
</script>

<template>
  <div
    v-if="message"
    :ref="el => messageRefs[message.id] = el"
    w-full flex items-start gap-3 px-3
    class="group"
    :class="{
      'bg-base-content text-base-300': isEditing,
      'bg-base-200': message.role === 'user',
      'bg-base-300': false,
    }"
  >
    <!-- Avatar Start -->
    <div
      min-w-7 h-7 my-4 rounded-full flex-center
      :class="{
        'bg-gradient-to-l from-primary to-accent text-primary-content': message.role === 'system',
        'bg-secondary text-secondary-content': message.role === 'assistant',
        'bg-base-100 text-base-content': message.role === 'user',
      }"
    >
      <span v-if="message.role === 'system'" i-ph-brain-bold />
      <span v-if="message.role === 'assistant'" i-ph-brain-bold />
      <span v-if="message.role === 'user'" i-ph-user-bold />
    </div>
    <!-- Avatar End -->

    <!-- Message Input Start -->
    <div relative flex flex-col w-full min-w-0 @contextmenu="toggleEdit" @dblclick="toggleEdit">
      <span
        v-if="message.role === 'system'"
        text-xs uppercase absolute text-base-content text-opacity-50 transition-top
        :class="{
          'bg-gradient-to-r from-primary to-accent bg-clip-text': !isEditing,
        }"
        :style="{ top: isEditing ? '-1.5rem' : 0 }"
        v-text="'System prompt'"
      />
      <template v-if="!isEditing">
        <div v-if="message.content.length" prose :class="{ 'opacity-80 font-italic': message.role === 'system' }" v-html="parse(message.content)" />
        <div v-else-if="message.error" prose my-4 opacity-80 text-error font-italic v-text="message.error" />
        <div v-else my-4 v-text="'...'" />
      </template>
      <template v-else>
        <ATextArea
          ref="editRef" v-model="message.content" tabindex="0"
          min-h-7 my-4 w-full :class="{ 'font-italic': message.role === 'system' }"
          @submit="toggleMessage(message)" @close="toggleMessage(message, true)"
        />
      </template>
    </div>
    <!-- Message Input End -->

    <!-- Message Controls Start -->
    <div
      v-if="!isEditing"
      flex-auto h-7 min-w-7 my-4 flex justify-end gap-2
      :class="{ 'invisible group-hover:visible': !isLoading && !message.error && breakpoints.md && !(messages && messages.length < 4 && message.role === 'system') && !controls.playing.value }"
    >
      <template v-if="isLoading === message.id">
        <span i-ph-circle-notch-bold text-xl animate-spin animate-duration-2000 />
      </template>
      <template v-if="message.role === 'system'">
        <button title="Edit system prompt" btn min-w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="toggleMessage(message)">
          <span i-ph-note-pencil-bold />
        </button>
      </template>
      <template v-if="message.role === 'assistant'">
        <button v-if="message.error" title="Reload response" btn min-w-7 h-7 text-error hover:bg-neutral hover:text-neutral-content @click="retryMessage(message)">
          <span i-ph-arrows-counter-clockwise-bold />
        </button>
        <div v-if="message.hasAudio && !state.audio.isMuted" relative>
          <svg
            v-if="progress"
            width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"
            absolute :style="{ top: '-2px', left: '-2px' }"
          >
            <rect
              width="32" height="32" rx="4" ry="4" stroke-dasharray="128, 128" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"
              :stroke-dashoffset="`${progress}`"
              stroke-base-content
            />
          </svg>
          <button title="Play audio" btn min-w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="togglePlay()">
            <span v-if="!controls?.playing.value" i-ph-play-bold />
            <span v-else i-ph-pause-bold />
          </button>
        </div>
      </template>
      <template v-if="message.role === 'user'">
        <button title="Edit message" btn min-w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="toggleEdit">
          <span i-ph-note-pencil-bold />
        </button>
      </template>
    </div>
    <!-- Message Controls End -->

    <!-- Edit Controls Start -->
    <div
      v-if="isEditing"
      flex-auto h-7 my-4 flex justify-end gap-2
    >
      <button
        title="Update system prompt"
        btn flex-center w-7 h-7 bg-accent text-accent-content
        @click="updateMessage()"
      >
        <span v-if="messages && messages.length > 1" i-ph-arrows-counter-clockwise-bold text-sm />
        <span v-else i-ph-check-bold text-sm />
      </button>
      <button title="Cancel edit" btn flex-center w-7 h-7 bg-base-100 bg-opacity-25 text-base-300 hover:text-base-content @click="toggleMessage(message, true)">
        <span i-ph-x-bold text-sm />
      </button>
    </div>
    <!-- Edit Controls End -->
    <audio ref="audioRef" />
  </div>
</template>
