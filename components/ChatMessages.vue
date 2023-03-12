<script setup lang="ts">
import { marked } from 'marked'
import type { Message } from '~/composables/chat'

const { session, messages, sendChat } = useChat()

const messageRefs = ref<Record<string, any>>({})

function toggleEdit({ id, role, text, isEditing }: Message & any, cancel = false) {
  if (!messages.value?.length || !session.value?.messages?.length)
    return

  clearSelection()

  messages.value.forEach((message) => {
    message.isEditing = message.id === id ? !message.isEditing : false
  })

  if (!isEditing) {
    nextTick().then(() => {
      messageRefs.value[id]?.querySelector?.('textarea')?.focus()
    })
  }
  else if (!cancel) {
    if (role === 'system') {
      const text = messages.value[1].text
      session.value.messages = session.value.messages.slice(0, 1)
      sendChat(text)
    }
    else {
      const messageIndex = messages.value.findIndex(message => message.id === id)
      session.value.messages = session.value.messages.slice(0, messageIndex)
      sendChat(text)
    }
  }
}

function clearSelection() {
  if (window.getSelection)
    window.getSelection()?.empty() || window.getSelection()?.removeAllRanges()
}

function parse(text: string) {
  return marked.parse(text, {
    gfm: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
  })
}
</script>

<template>
  <div
    w-full flex-auto bg-base-100 text-base-content
    flex flex-col justify-end gap-3 pt-8
  >
    <ClientOnly>
      <template v-for="message, i in messages" :key="message.id">
        <div
          :ref="el => messageRefs[message.id] = el"
          w-full flex items-start gap-3 px-3
          class="group"
          :class="{
            'bg-base-content text-base-300': message.isEditing,
          }"
        >
          <!-- Avatar Start -->
          <div
            min-w-7 h-7 my-4 rounded-full flex-center
            :class="{
              'bg-primary text-primary-content': message.role === 'system',
              'bg-accent text-accent-content': message.role === 'assistant',
              'bg-base-100 text-base-content': message.role === 'user',
            }"
          >
            <span v-if="message.role === 'system'" i-ph-brain-bold />
            <span v-if="message.role === 'assistant'" i-ph-brain-bold />
            <span v-if="message.role === 'user'" i-ph-user-bold />
          </div>
          <!-- Message Start -->
          <div relative flex flex-col w-full min-w-0 @dblclick="message.role !== 'assistant' && toggleEdit(message)">
            <span
              v-if="message.role === 'system'"
              text-xs uppercase absolute text-base-content text-opacity-50 transition-top
              :style="{ top: message.isEditing ? '-1.5rem' : 0 }"
              v-text="'System prompt'"
            />
            <template v-if="!message.isEditing">
              <div v-if="message.text.length" prose :class="{ 'opacity-80 font-italic': message.role === 'system' }" v-html="parse(message.text)" />
              <div v-else prose v-html="'<p>...</p>'" />
            </template>
            <template v-else>
              <TextArea v-model="message.text" tabindex="0" min-h-7 my-4 w-full :class="{ 'font-italic': message.role === 'system' }" @submit="toggleEdit(message)" @close="toggleEdit(message, true)" />
            </template>
          </div>
          <!-- Controls Start -->
          <div
            v-if="!message.isEditing"
            flex-auto h-7 my-4 flex justify-end gap-2
            invisible group-hover:visible
          >
            <template v-if="message.role === 'system'">
              <button title="Edit system prompt" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="toggleEdit(message)">
                <span i-ph-note-pencil-bold />
              </button>
            </template>
            <template v-if="message.role === 'assistant'">
              <button v-if="message.audio" title="Play audio" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content>
                <span i-ph-speaker-high-bold />
              </button>
              <button v-if="!message.text" title="Reload response" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="toggleEdit(messages?.[i - 1]); toggleEdit(messages?.[i - 1])">
                <span i-ph-arrows-counter-clockwise-bold />
              </button>
            </template>
            <template v-if="message.role === 'user'">
              <button title="Edit message" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="toggleEdit(message)">
                <span i-ph-note-pencil-bold />
              </button>
            </template>
          </div>
          <div
            v-if="message.isEditing"
            flex-auto h-7 my-4 flex justify-end gap-2
          >
            <button title="Update message" btn w-6 h-6 bg-success text-success-content @click="toggleEdit(message)">
              <span i-ph-arrows-counter-clockwise-bold />
            </button>
            <button title="Cancel edit" btn w-6 h-6 bg-error text-error-content @click="toggleEdit(message, true)">
              <span i-ph-x-bold />
            </button>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
