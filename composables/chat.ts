import type { ChatCompletionRequestMessage } from 'openai'
import { nanoid } from 'nanoid'
import { createAudio } from '~/lib/idb'

export interface Message extends ChatCompletionRequestMessage {
  id: string
  hasAudio?: boolean
  isEditing?: boolean
}

export interface Session {
  id: string
  messages?: Message[]
}

const messageRefs = ref<Record<string, any>>({})

export function useChat() {
  const state = useLocalState()
  const route = useRoute()
  const router = useRouter()

  const session = computed<Session | undefined>(() => state.value.sessions.find?.(({ id }) => id === route.params.id))
  const messages = computed<Message[] | undefined>(() => session.value?.messages)

  function addSession() {
    const id = nanoid(3)
    const initMessage: Message = { id: nanoid(6), content: 'You are a helpful assistant.', role: 'system' }
    state.value.sessions.push({ id, messages: [initMessage] })
    router.push(`/${id}`)
  }

  function removeSession(id: string) {
    state.value.sessions = state.value.sessions.filter(session => session.id !== id)
    if (route.params.id === id)
      router.replace('/')
  }

  function addMessage({ content, role }: Pick<Message, 'content' | 'role'>) {
    if (!messages.value)
      throw new Error('No session messages')
    const message: Message = { content, role, id: nanoid(6), hasAudio: false }
    messages.value.push(message)
    scrollToMessage(message)
    return messages.value[messages.value.length - 1]
  }

  function updateMessage(id: string, payload: Partial<Message>) {
    if (!messages.value)
      throw new Error('No session messages')
    const message = messages.value.find(message => message.id === id)
    if (!message)
      throw new Error('No message')
    Object.assign(message, payload)
    scrollToMessage(message)
  }

  function toggleMessage({ id, role, content, isEditing }: Message, cancel = false) {
    if (!messages.value?.length || !session.value?.messages?.length)
      return

    if (window.getSelection)
      window.getSelection()?.empty() || window.getSelection()?.removeAllRanges()

    messages.value.forEach((message) => {
      message.isEditing = message.id === id ? !message.isEditing : false
    })

    if (!isEditing) {
      return nextTick().then(() => {
        messageRefs.value[id]?.querySelector?.('textarea')?.focus()
      })
    }

    if (cancel)
      return

    if (role === 'system') {
      const content = messages.value[1]?.content
      session.value.messages = session.value.messages.slice(0, 1)
      content && submitChat(content)
    }
    else {
      const messageIndex = messages.value.findIndex(message => message.id === id)
      session.value.messages = session.value.messages.slice(0, messageIndex)
      submitChat(content)
    }
  }

  function retryMessage({ id }: Message) {
    if (!messages.value)
      return
    const prevIndex = messages.value.findIndex(message => message.id === id) - 1
    const prevMessage = messages.value[prevIndex]
    if (session.value?.messages?.length)
      session.value.messages = session.value.messages.slice(0, prevIndex)
    submitChat(prevMessage.content)
  }

  async function synthesizeChat(content: string, id: string) {
    const { data } = await useFetch('/api/synthesize', {
      method: 'POST',
      body: { content },
    })
    const audioBase64 = data.value?.audio
    await createAudio({ id, file: audioBase64 })
    return audioBase64
  }

  async function submitChat(content: string) {
    if (!content || !content.trim() || !messages.value)
      return

    addMessage({ content, role: 'user' })
    const { id: responseId } = addMessage({ content: '', role: 'assistant' })
    const { data } = await useFetch('/api/chat', {
      method: 'POST',
      body: {
        messages: JSON.stringify(
          messages.value.map(({ role, content, name }) =>
            ({ role, content, name }) as ChatCompletionRequestMessage),
        ),
      },
      // responseType: 'stream',
    })
    const responseText = data.value?.content
    if (!responseText)
      throw new Error('No response content')
    updateMessage(responseId, { content: responseText })
    await synthesizeChat(responseText, responseId)
    updateMessage(responseId, { hasAudio: true })
  }

  async function scrollToMessage({ id }: Message) {
    await nextTick()
    const el = messageRefs.value[id]
    const y = el.getBoundingClientRect().top + window.pageYOffset - 56 - 60 - 12 // nav + chat input + padding
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return {
    state,
    session,
    messages,
    messageRefs,
    toggleMessage,
    retryMessage,
    addSession,
    removeSession,
    addMessage,
    submitChat,
  }
}
