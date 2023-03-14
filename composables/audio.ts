import type { Message } from './chat'
import { getAudio } from '~/lib/idb'

interface LoadAudioParams {
  autoplay?: boolean
  messageId?: string
}

export function useAudio(message: Ref<Message>) {
  const state = useLocalState()
  const audioRef = ref<HTMLAudioElement>()
  const src = ref('')
  const controls = useMediaControls(audioRef, { src })
  const audioBase64 = ref('')

  onMounted(async () => {
    if (message.value.role !== 'assistant' || !message.value.hasAudio)
      return

    audioBase64.value = await getAudio(message.value.id)
  })

  watchOnce(
    () => message.value.hasAudio,
    async (n, o) => {
      if (n && !o) {
        audioBase64.value = await getAudio(message.value.id)
        await new Promise(resolve => setTimeout(resolve, 100))
        togglePlay()
      }
    },
  )

  watch(
    audioBase64,
    async (audioBase64) => {
      loadAudio(audioBase64, { autoplay: false })
    },
  )

  watch(
    () => state.value.audio,
    ({ isMuted, playbackRate }) => {
      if (isMuted)
        controls.playing.value = false
      controls.rate.value = playbackRate
    },
  )

  async function loadAudio(audioBase64: string, { autoplay }: LoadAudioParams) {
    const audioData = atob(audioBase64)
    const bytes = new Uint8Array(audioData.length).map((_, i) => audioData.charCodeAt(i))
    const outputAudioBlob = new Blob([bytes.buffer], { type: 'audio/mp3' })
    const url = URL.createObjectURL(outputAudioBlob)
    src.value = url
    await nextTick()
    controls.rate.value = state.value.audio.playbackRate
    autoplay && togglePlay()
  }

  function togglePlay() {
    if (state.value.audio.isMuted)
      return

    controls.playing.value = !controls.playing.value
    controls.rate.value = state.value.audio.playbackRate
  }

  return {
    audioRef,
    controls,
    loadAudio,
    togglePlay,
  }
}
