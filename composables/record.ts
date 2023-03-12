import { MicRecorder } from '~/lib/mp3'

export function useRecorder() {
  const { submitChat } = useChat()
  const isRecording = ref(false)
  const recorder = new MicRecorder({ bitRate: 128 })

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
    })
    const content = data.value?.content
    if (content)
      submitChat(content)
  }

  function toggleRecorder() {
    isRecording.value ? stop() : start()
  }

  return {
    isRecording,
    toggleRecorder,
  }
}
