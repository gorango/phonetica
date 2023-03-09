<script setup lang="ts">
const { audioInputs: microphones } = useDevicesList({ requestPermissions: true, constraints: { audio: true, video: false } })
const currentMicrophone = computed(() => microphones.value[0]?.deviceId)
const { stream: audioStream, start: startAudioStream, stop: stopAudioStream } = useUserMedia({ audioDeviceId: currentMicrophone, videoDeviceId: false })

const d = new Date()
const id = `${d.valueOf()}-${d.getTimezoneOffset()}-${Math.round(Math.random() * 1000)}`

function record() {
  if (!audioStream.value)
    return

  const chunks: Blob[] = []
  const mediaRecorder = new MediaRecorder(audioStream.value)
  mediaRecorder.start()
  mediaRecorder.ondataavailable = event => chunks.push(event.data)
  mediaRecorder.onstop = async () => {
    if (chunks[0].size < 5000)
      return

    const inputAudioBlob = new Blob(chunks, { type: 'audio/mpeg-3' })
    const formData = new FormData()
    formData.append('file', inputAudioBlob)

    const { data } = await useFetch('/api/record', {
      method: 'POST',
      body: formData,
      query: { id },
      // responseType: 'audioStream',
    })
    console.log(data.value) // eslint-disable-line no-console
    const audioData = atob(data.value?.audio)
    const bytes = new Uint8Array(audioData.length).map((_, i) => audioData.charCodeAt(i))
    const outputAudioBlob = new Blob([bytes.buffer], { type: 'audio/mp3' })
    const url = URL.createObjectURL(outputAudioBlob)
    const audio = new Audio(url)
    audio.play()
  }
}

async function onPress() {
  await startAudioStream()
  record()
}
async function onRelease() {
  await stopAudioStream()
}
</script>

<template>
  <button
    btn
    w-24 h-24 rounded-full
    bg-primary text-primary-content
    @mousedown="onPress"
    @mouseup="onRelease"
  >
    Record
  </button>
</template>
