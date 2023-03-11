<script setup lang="ts">
import { marked } from 'marked'

const { messages } = useChat()

function toggleEdit({ id }: any) {
  if (!messages.value?.length)
    return
  messages.value.forEach((message) => {
    message.isEditing = message.id === id ? !message.isEditing : false
  })
}
</script>

<template>
  <div
    w-full flex-auto bg-base-100 text-base-content
    flex flex-col justify-end gap-3 py-3
  >
    <ClientOnly>
      <template v-for="message in messages" :key="message.id">
        <div
          w-full flex items-start gap-3 px-3
          class="group"
          :class="{
            'bg-base-content text-base-300': message.isEditing,
          }"
        >
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
          <div relative flex flex-col w-full>
            <span
              v-if="message.role === 'system'"
              text-xs uppercase absolute text-neutral-content text-opacity-50 transition-top
              :style="{ top: message.isEditing ? '-1.5rem' : 0 }"
              v-text="'System prompt'"
            />
            <template v-if="!message.isEditing">
              <div v-if="message.text.length" prose v-html="marked.parse(message.text)" />
              <div v-else prose v-html="'<p>...</p>'" />
            </template>
            <template v-else>
              <TextArea v-model="message.text" tabindex="0" min-h-7 my-4 w-full @close="message.isEditing = false" />
            </template>
          </div>
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
              <button v-if="!message.text" title="Reload response" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content>
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
              <span i-ph-check-bold />
            </button>
            <button title="Cancel edit" btn w-6 h-6 bg-error text-error-content @click="toggleEdit(message)">
              <span i-ph-x-bold />
            </button>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
