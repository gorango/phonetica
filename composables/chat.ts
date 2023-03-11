import type { ChatCompletionRequestMessage } from 'openai'
import { nanoid } from 'nanoid'
import { MicRecorder } from '~/lib/mp3'

export interface Message {
  id: string
  text: string
  role: 'user' | 'assistant' | 'system'
  name?: string
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
      playbackRate: 1.25,
    },
    sessions: [] as Session[],
  })
  const route = useRoute()
  const router = useRouter()

  const session = computed(() => state.value.sessions.find?.(({ id }) => id === route.params.id))
  const messages = computed<Message[] | undefined>(() => session.value?.messages)

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

  function addMessage({ text, role }: Pick<Message, 'text' | 'role'>) {
    if (!session.value)
      return
    const message = { text, role, id: nanoid(6) }
    session.value.messages?.push(message)
    scrollToBottom()
    return message
  }

  async function scrollToBottom() {
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
  }

  async function synthesizeChat(text: string) {
    const { data } = await useFetch('/api/synthesize', {
      method: 'POST',
      body: { text },
    })
    if (!data.value?.audio)
      return
    const audioData = atob(data.value?.audio)
    const bytes = new Uint8Array(audioData.length).map((_, i) => audioData.charCodeAt(i))
    const outputAudioBlob = new Blob([bytes.buffer], { type: 'audio/mp3' })
    const url = URL.createObjectURL(outputAudioBlob)
    const audio = new Audio(url)
    audio.playbackRate = state.value.audio.playbackRate || 1.25
    audio.play()
  }

  async function sendChat(text: string) {
    if (!text || !text.trim() || !messages.value)
      return
    addMessage({ text, role: 'user' })
    const body = {
      messages: JSON.stringify(
        messages.value.map(({ role, text: content, name }) =>
          ({ role, content, name }) as ChatCompletionRequestMessage),
      ),
    }
    addMessage({ text: '', role: 'assistant' })
    const { data } = await useFetch('/api/chat', { method: 'POST', body })
    console.log(data) // eslint-disable-line no-console
    if (!data.value?.text)
      return
    const { text: responseText } = data.value
    messages.value[messages.value.length - 1].text = responseText
    scrollToBottom()
    if (!state.value.audio.isMuted)
      synthesizeChat(responseText)
  }

  return {
    state,
    session,
    messages,
    addSession,
    removeSession,
    addMessage,
    sendChat,
  }
}

export function useRecorder() {
  const { sendChat } = useChat()
  const isRecording = ref(false)
  const recorder = new MicRecorder({ bitRate: 128 })

  const d = new Date()
  const id = `${d.valueOf()}-${d.getTimezoneOffset()}-${Math.round(Math.random() * 1000)}`

  async function start() {
    isRecording.value = true
    recorder.start()
  }
  async function stop() {
    isRecording.value = false
    const [buffer, blob]: any = await recorder.stop().getMp3()

    if (!buffer || !blob)
      return

    const inputAudioBlob = new File(buffer, 'input.mp3', {
      type: blob.type,
      lastModified: Date.now(),
    })
    const formData = new FormData()
    formData.append('file', inputAudioBlob)

    const { data } = await useFetch('/api/transcribe', {
      method: 'POST',
      body: formData,
      query: { id },
      // responseType: 'stream',
    })
    const text = data.value?.text
    console.log(text) // eslint-disable-line no-console
    if (text)
      sendChat(text)
  }

  function toggleRecorder() {
    if (isRecording.value)
      stop()
    else
      start()
  }

  return {
    isRecording,
    toggleRecorder,
  }
}
