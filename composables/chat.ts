import type { ChatCompletionRequestMessage } from 'openai'
import { nanoid } from 'nanoid'

export interface Message extends ChatCompletionRequestMessage {
  id: string
  audio?: Blob
  isEditing?: boolean
}

export interface Session {
  id: string
  messages?: Message[]
}

export function useChat() {
  const state = useLocalStorage('phonetica', {
    audio: {
      isMuted: false,
      playbackRate: 1.5,
    },
    sessions: [] as Session[],
  })
  const route = useRoute()
  const router = useRouter()

  const session = computed<Session | undefined>(() => state.value.sessions.find?.(({ id }) => id === route.params.id))
  const messages = computed<Message[] | undefined>(() => session.value?.messages)

  const messageRefs = ref<Record<string, any>>({})

  function addSession() {
    const id = nanoid(3)
    if (!state.value.sessions)
      state.value.sessions = []
    state.value.sessions.push({ id, messages: [] })
    router.push(`/${id}`)
  }

  function removeSession(id: string) {
    state.value.sessions = state.value.sessions.filter(session => session.id !== id)
    if (route.params.id === id)
      router.replace('/')
  }

  function addMessage({ content, role }: Pick<Message, 'content' | 'role'>) {
    if (!session.value)
      return
    const message = { content, role, id: nanoid(6) }
    session.value.messages?.push(message)
    scrollToBottom()
    return message
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

  async function synthesizeChat(content: string) {
    const { data } = await useFetch('/api/synthesize', {
      method: 'POST',
      body: { content },
    })
    if (!data.value?.audio)
      return
    const audioData = atob(data.value?.audio)
    const bytes = new Uint8Array(audioData.length).map((_, i) => audioData.charCodeAt(i))
    const outputAudioBlob = new Blob([bytes.buffer], { type: 'audio/mp3' })
    const url = URL.createObjectURL(outputAudioBlob)
    const audio = new Audio(url)
    audio.playbackRate = state.value.audio.playbackRate || 1.5
    audio.play()
  }

  async function submitChat(content: string) {
    if (!content || !content.trim() || !messages.value)
      return
    addMessage({ content, role: 'user' })
    const body = {
      messages: JSON.stringify(
        messages.value.map(({ role, content, name }) =>
          ({ role, content, name }) as ChatCompletionRequestMessage),
      ),
    }
    addMessage({ content: '', role: 'assistant' })
    const { data } = await useFetch('/api/chat', {
      method: 'POST',
      body,
      // responseType: 'stream',
    })
    if (!data.value?.content)
      return
    const { content: responseText } = data.value
    messages.value[messages.value.length - 1].content = responseText
    scrollToBottom()
    if (!state.value.audio.isMuted)
      synthesizeChat(responseText)
  }

  async function scrollToBottom() {
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
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
