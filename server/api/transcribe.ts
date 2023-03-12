import fs from 'node:fs'
import { Configuration, OpenAIApi } from 'openai'
import { readFiles } from 'h3-formidable'

export default defineEventHandler(async (event) => {
  const files = await readFiles(event, { includeFields: false, keepExtensions: true })
  const audioFile = files.file[0]
  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.GPT_KEY }))
  const audioStream: any = fs.createReadStream(audioFile.filepath)
  const resp = await openai.createTranscription(audioStream, 'whisper-1')

  if (!resp || !resp.data)
    return { statusCode: 500, message: 'No response' }

  const { data: { text: inputText } } = resp

  if (!inputText)
    return { statusCode: 500, message: 'No text' }

  return {
    statusCode: 200,
    text: inputText,
  }
})
