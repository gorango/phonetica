import { voices } from './voices.json'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || !body.text)
    return { statusCode: 500, message: 'No body' }

  const { text: inputText } = body

  // console.log(inputText) // eslint-disable-line no-console

  const { audioContent: audioBase64 }: any = await getAudio(inputText)

  // console.log(audioBase64) // eslint-disable-line no-console

  return {
    statusCode: 200,
    audio: audioBase64 || '',
  }
})

async function getAudio(text: string) {
  const lang = await detectLang(text)
  const voice = voices.find(({ languageCodes }) => languageCodes.find(code => code.startsWith(lang)))

  // console.log(voice) // eslint-disable-line no-console

  if (!voice)
    return { audioContent: '' }

  const ttsConfig = {
    input: { text },
    voice: {
      languageCode: lang,
      name: voice.name,
      ssmlGender: voice.ssmlGender,
    },
    audioConfig: {
      audioEncoding: 'MP3',
    },
  }

  // console.log(ttsConfig.voice) // eslint-disable-line no-console

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GGL_KEY}`
  return $fetch(url, { method: 'POST', body: JSON.stringify(ttsConfig) })
}

const languages = new Set(
  voices
    .map(({ languageCodes }) => languageCodes[0].split('-')[0])
    .sort(),
)

async function detectLang(text: string): Promise<string> {
  const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.GGL_KEY}`
  const { data }: any = await $fetch(url, { method: 'POST', body: JSON.stringify({ q: text }) })

  if (!data)
    return 'en'

  const lang = data?.detections[0][0]?.language
  if (!languages.has(lang))
    return coerce(lang)
  return lang
}

function coerce(lang: string) {
  switch (lang) {
    case 'bs':
    case 'hr':
      return 'sr'
    default:
      return 'en'
  }
}
