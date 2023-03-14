import { voices } from './voices.json'

const languages = new Set(voices.map(({ languageCodes }) => languageCodes[0].split('-')[0]))

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || !body.content)
    return { statusCode: 500, message: 'No body' }

  const { content: inputText } = body
  const sanitizedText = inputText.replace(/`{3}[^`]*`{3}|`/g, '') // remove code blocks, backquotes
  const { audioContent: audioBase64 }: any = await getAudio(sanitizedText)

  return {
    statusCode: 200,
    audio: audioBase64 || '',
  }
})

async function getAudio(text: string) {
  const lang = await detectLang(text)
  const voice = findVoice(lang)

  if (!lang || !voice)
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

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GGL_KEY}`
  return $fetch(url, { method: 'POST', body: JSON.stringify(ttsConfig) })
}

async function detectLang(text: string): Promise<string> {
  const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.GGL_KEY}`
  const { data }: any = await $fetch(url, { method: 'POST', body: JSON.stringify({ q: text }) })
  return data?.detections[0][0]?.language || 'en'
}

function findVoice(lang: string) {
  lang = languages.has(lang) ? lang : coerceLang(lang)
  const found = voices
    .filter(({ languageCodes, name }) =>
      languageCodes.find(code => code.startsWith(lang))
      && name.split('-')[2] === 'Standard',
    )
    .sort(({ name: na, ssmlGender: ga }, { name: nb, ssmlGender: gb }) => {
      const ra = na.split('-')[1]
      const rb = nb.split('-')[1]
      const r = 'US'
      const g = 'FEMALE'
      // prefer US voices
      if (ra === r && rb !== r)
        return -1
      if (ra !== r && rb === r)
        return 1
      // prefer FEMALE voices
      if (ga === g && gb !== g)
        return -1
      if (ga !== g && gb === g)
        return 1
      return 0
    })
  return found[0]
}

function coerceLang(lang: string) {
  switch (lang) {
    case 'bs':
    case 'hr':
      return 'sr'
    default:
      return 'en'
  }
}
