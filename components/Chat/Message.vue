<script setup lang="ts">
import { marked } from 'marked'
import type { Message } from '~/composables/chat'

const props = defineProps<{ message: Message }>()
defineExpose({ scrollToMessage })

const message = toRef(props, 'message')
const state = useLocalState()
const { messageRefs, messages, toggleMessage, retryMessage } = useChat()
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

function scrollToMessage(message: any) {
  const el = messageRefs.value[message.id]
  const previousSibling = el?.previousSibling
  const top = previousSibling?.offsetTop + previousSibling?.offsetHeight + el?.offsetHeight
  top && window.scrollTo({ top, behavior: 'smooth' })
}
</script>

<template>
  <div
    v-if="message"
    :ref="el => messageRefs[message.id] = el"
    w-full flex items-start gap-3 px-3
    class="group"
    :class="{
      'bg-base-content text-base-300': message.isEditing,
      'bg-base-200': message.role === 'user',
      'sticky top-14 z-1 cursor-pointer': false,
    }"
    @skip="message.role === 'user' && scrollToMessage(message)"
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
    <div relative flex flex-col w-full min-w-0 @contextmenu.prevent="!message.isEditing && message.role !== 'assistant' && toggleMessage(message)" @dblclick="!message.isEditing && message.role !== 'assistant' && toggleMessage(message)">
      <span
        v-if="message.role === 'system'"
        text-xs uppercase absolute text-base-content text-opacity-50 transition-top
        :class="{
          'bg-gradient-to-r from-primary to-accent bg-clip-text': !message.isEditing,
        }"
        :style="{ top: message.isEditing ? '-1.5rem' : 0 }"
        v-text="'System prompt'"
      />
      <template v-if="!message.isEditing">
        <div v-if="message.content.length" prose :class="{ 'opacity-80 font-italic': message.role === 'system' }" v-html="parse(message.content)" />
        <div v-else prose v-html="'<p>...</p>'" />
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
      v-if="!message.isEditing"
      flex-auto h-7 min-w-7 my-4 flex justify-end gap-2
      :class="{ 'invisible group-hover:visible': !(messages && messages.length < 4 && message.role === 'system') && !controls.playing.value }"
    >
      <template v-if="message.role === 'system'">
        <button title="Edit system prompt" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="toggleMessage(message)">
          <span i-ph-note-pencil-bold />
        </button>
      </template>
      <template v-if="message.role === 'assistant'">
        <button v-if="!message.content" title="Reload response" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="retryMessage(message)">
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
          <button title="Play audio" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="togglePlay()">
            <span v-if="!controls?.playing.value" i-ph-play-bold />
            <span v-else i-ph-pause-bold />
          </button>
        </div>
      </template>
      <template v-if="message.role === 'user'">
        <button title="Edit message" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="toggleMessage(message)">
          <span i-ph-note-pencil-bold />
        </button>
      </template>
    </div>
    <!-- Message Controls End -->

    <!-- Edit Controls Start -->
    <div
      v-if="message.isEditing"
      flex-auto h-7 my-4 flex justify-end gap-2
    >
      <button title="Update message" btn flex-center w-7 h-7 bg-accent text-accent-content @click="updateMessage()">
        <span i-ph-arrows-counter-clockwise-bold text-sm />
      </button>
      <button title="Cancel edit" btn flex-center w-7 h-7 bg-base-100 bg-opacity-25 text-base-300 hover:text-base-content @click="toggleMessage(message, true)">
        <span i-ph-x-bold text-sm />
      </button>
    </div>
    <!-- Edit Controls End -->
    <audio ref="audioRef" />
  </div>
</template>
