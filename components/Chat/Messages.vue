<script setup lang="ts">
import { marked } from 'marked'

const { messages, messageRefs, toggleMessage, retryMessage } = useChat()

const editRef = ref()

function updateMessage() {
  const [component] = editRef.value
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
</script>

<template>
  <div
    w-full flex-auto bg-base-100 text-base-content
    flex flex-col justify-end gap-3 pt-8 pb-4
  >
    <ClientOnly>
      <template v-for="message in messages" :key="message.id">
        <div
          :ref="el => messageRefs[message.id] = el"
          w-full flex items-start gap-3 px-3
          class="group"
          :class="{
            'bg-base-content text-base-300': message.isEditing,
            // 'hover:bg-gradient-to-l from-primary via-transparent to-transparent bg-opacity-15': !message.isEditing && message.role === 'system',
          }"
        >
          <!-- Avatar Start -->
          <div
            min-w-7 h-7 my-4 rounded-full flex-center
            :class="{
              'bg-gradient-to-l from-primary to-accent text-primary-content': message.role === 'system',
              'bg-accent text-accent-content': message.role === 'assistant',
              'bg-base-100 text-base-content': message.role === 'user',
            }"
          >
            <span v-if="message.role === 'system'" i-ph-brain-bold />
            <span v-if="message.role === 'assistant'" i-ph-brain-bold />
            <span v-if="message.role === 'user'" i-ph-user-bold />
          </div>
          <!-- Avatar End -->

          <!-- Message Input Start -->
          <div relative flex flex-col w-full min-w-0 @dblclick="!message.isEditing && message.role !== 'assistant' && toggleMessage(message)">
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
            flex-auto h-7 my-4 flex justify-end gap-2
            :class="{ 'invisible group-hover:visible': message.role !== 'system' }"
          >
            <template v-if="message.role === 'system'">
              <button title="Edit system prompt" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="toggleMessage(message)">
                <span i-ph-note-pencil-bold bg-gradient-to-r from-primary to-accent />
              </button>
            </template>
            <template v-if="message.role === 'assistant'">
              <button v-if="message.audio" title="Play audio" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content>
                <span i-ph-speaker-high-bold />
              </button>
              <button v-if="!message.content" title="Reload response" btn w-7 h-7 hover:bg-neutral hover:text-neutral-content @click="retryMessage(message)">
                <span i-ph-arrows-counter-clockwise-bold />
              </button>
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
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
