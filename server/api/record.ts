import fs from 'node:fs'
import { oneLine } from 'common-tags'
import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai'
import { Configuration, OpenAIApi } from 'openai'
import { readFiles } from 'h3-formidable'
import { voices } from './voices.json'

const messagesDict: Map<string, ChatCompletionRequestMessage[]> = new Map()

const systemPrompt = oneLine`
You are an entusiastic assistant with general knowledge and you reply to questions
with very brief answers. You also ask a lot of questions to get more information.
You also ask a lot of questions to continue the conversation or initiate a new one.
`

export default defineEventHandler(async (event) => {
  const files = await readFiles(event, { includeFields: false, keepExtensions: true })
  const query = getQuery(event)

  if (!query.id)
    return { statusCode: 400, message: 'Missing id' }

  const audioFile = files.file[0]
  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.GPT_KEY }))
  const audioStream: any = fs.createReadStream(audioFile.filepath)

  const resp = await openai.createTranscription(audioStream, 'whisper-1')

  if (!resp || !resp.data)
    return { statusCode: 500, message: 'No response' }

  const { data: { text: inputText } } = resp

  // console.log(inputText) // eslint-disable-line no-console

  if (!inputText)
    return { statusCode: 500, message: 'No text' }

  if (!messagesDict.get(query.id as string)) {
    messagesDict.set(query.id as string, [
      { role: 'system', content: systemPrompt },
    ])
  }
  const messages = messagesDict.get(query.id as string) as ChatCompletionRequestMessage[]
  messages.push({ role: 'user', content: inputText.trim(), name: 'user' })

  const completionOpts: CreateChatCompletionRequest = {
    model: 'gpt-3.5-turbo',
    messages,
    n: 1,
    max_tokens: 256,
    temperature: 0.9,
    // stream: true,
  }

  const response = await openai.createChatCompletion(completionOpts)

  if (response.status !== 200 || !response.data?.choices.length)
    return { statusCode: 500, message: 'No response from OpenAI' }

  const responseText = response.data?.choices[0]?.message?.content

  // console.log(responseText) // eslint-disable-line no-console

  if (!responseText)
    return { statusCode: 500, message: 'No response from OpenAI' }

  messages.push({ role: 'assistant', content: responseText })

  // console.log(messages.length) // eslint-disable-line no-console

  const { audioContent: audioBase64 }: any = await getAudio(responseText)

  // console.log(audioBase64) // eslint-disable-line no-console

  return {
    statusCode: 200,
    text: responseText,
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
