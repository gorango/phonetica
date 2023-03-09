<script setup lang="ts">
import { MicRecorder } from '~/lib/mp3'

const recorder = new MicRecorder({ bitRate: 128 })

const d = new Date()
const id = `${d.valueOf()}-${d.getTimezoneOffset()}-${Math.round(Math.random() * 1000)}`

async function onPress() {
  recorder.start()
}
async function onRelease() {
  const [buffer, blob]: any = await recorder.stop().getMp3()
  if (!buffer || !blob)
    return
  const inputAudioBlob = new File(buffer, 'input.mp3', {
    type: blob.type,
    lastModified: Date.now(),
  })
  const formData = new FormData()
  formData.append('file', inputAudioBlob)

  const { data } = await useFetch('/api/record', {
    method: 'POST',
    body: formData,
    query: { id },
    // responseType: 'stream',
  })
  console.log(data.value) // eslint-disable-line no-console

  const audioData = atob(data.value?.audio)
  const bytes = new Uint8Array(audioData.length).map((_, i) => audioData.charCodeAt(i))
  const outputAudioBlob = new Blob([bytes.buffer], { type: 'audio/mp3' })
  const url = URL.createObjectURL(outputAudioBlob)
  const audio = new Audio(url)
  audio.play()
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
